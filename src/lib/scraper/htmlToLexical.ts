import * as cheerio from 'cheerio'
import type { AnyNode } from 'domhandler'

// Minimal HTML -> Lexical JSON converter, hand-rolled because
// @payloadcms/richtext-lexical 3.87.0 does not publicly export an
// HTML->Lexical converter (only Lexical->HTML and Slate->Lexical migration
// helpers exist). Covers the tags actually observed on vmk.hu article
// bodies: p, br, strong/b, em/i, a, h1-h6, ul/ol/li. Anything else is
// flattened to plain text. Images are intentionally NOT embedded inline —
// the caller extracts <img> separately and uploads the first one as the
// News/Events featuredImage, matching what the scraped site itself does
// (most "news" bodies are a single poster image).

type TextNode = {
  type: 'text'
  detail: number
  format: number
  mode: 'normal'
  style: string
  text: string
  version: 1
}

type ElementNode = {
  type: string
  children: (TextNode | ElementNode)[]
  direction: 'ltr'
  format: string
  indent: number
  version: 1
  [key: string]: unknown
}

const FORMAT_BOLD = 1
const FORMAT_ITALIC = 2

function textNode(text: string, format = 0): TextNode {
  return { type: 'text', detail: 0, format, mode: 'normal', style: '', text, version: 1 }
}

function inlineChildren($: cheerio.CheerioAPI, node: AnyNode, format = 0): (TextNode | ElementNode)[] {
  const out: (TextNode | ElementNode)[] = []
  const children = ($(node) as any).contents().toArray() as AnyNode[]

  for (const child of children) {
    if (child.type === 'text') {
      const text = $(child).text()
      if (text) out.push(textNode(text, format))
      continue
    }
    if (child.type !== 'tag') continue
    const tagName = (child as any).tagName?.toLowerCase()

    switch (tagName) {
      case 'strong':
      case 'b':
        out.push(...inlineChildren($, child, format | FORMAT_BOLD))
        break
      case 'em':
      case 'i':
        out.push(...inlineChildren($, child, format | FORMAT_ITALIC))
        break
      case 'br':
        out.push({
          type: 'linebreak',
          children: [],
          direction: 'ltr',
          format: '',
          indent: 0,
          version: 1,
        })
        break
      case 'a': {
        const href = $(child).attr('href') ?? ''
        // Payload's link node validator rejects anything that isn't a
        // well-formed URL (real vmk.hu content has plenty of `href="#"` /
        // empty/javascript: anchors) — fall back to plain text for those
        // instead of failing the whole article import.
        const isValidUrl = /^(https?:\/\/|mailto:|tel:|\/)[^\s]+$/.test(href)
        if (isValidUrl) {
          out.push({
            type: 'link',
            children: inlineChildren($, child, format),
            direction: 'ltr',
            format: '',
            indent: 0,
            version: 1,
            fields: { url: href, newTab: true, linkType: 'custom' },
          })
        } else {
          out.push(...inlineChildren($, child, format))
        }
        break
      }
      default:
        out.push(...inlineChildren($, child, format))
    }
  }
  return out
}

function paragraphNode(children: (TextNode | ElementNode)[]): ElementNode {
  return { type: 'paragraph', children, direction: 'ltr', format: '', indent: 0, version: 1 }
}

function headingNode(tag: string, children: (TextNode | ElementNode)[]): ElementNode {
  return { type: 'heading', tag, children, direction: 'ltr', format: '', indent: 0, version: 1 }
}

function listNode(listType: 'bullet' | 'number', items: ElementNode[]): ElementNode {
  return {
    type: 'list',
    listType,
    start: 1,
    tag: listType === 'bullet' ? 'ul' : 'ol',
    children: items,
    direction: 'ltr',
    format: '',
    indent: 0,
    version: 1,
  }
}

/** Converts an HTML fragment (article body innerHTML) into a Lexical SerializedEditorState. */
export function htmlFragmentToLexical(html: string): { root: ElementNode } {
  const $ = cheerio.load(html)
  const body = $('body')
  const blocks: ElementNode[] = []

  const topLevel = body.contents().toArray()
  for (const node of topLevel) {
    if (node.type === 'text') {
      const text = $(node).text().trim()
      if (text) blocks.push(paragraphNode([textNode(text)]))
      continue
    }
    if (node.type !== 'tag') continue
    const tagName = (node as any).tagName?.toLowerCase()

    if (tagName === 'p') {
      const children = inlineChildren($, node)
      if (children.length > 0) blocks.push(paragraphNode(children))
    } else if (/^h[1-6]$/.test(tagName)) {
      blocks.push(headingNode(tagName, inlineChildren($, node)))
    } else if (tagName === 'ul' || tagName === 'ol') {
      const items = $(node)
        .find('> li')
        .toArray()
        .map((li) => ({
          type: 'listitem',
          children: inlineChildren($, li),
          direction: 'ltr' as const,
          format: '',
          indent: 0,
          version: 1 as const,
          value: 1,
        }))
      if (items.length > 0) blocks.push(listNode(tagName === 'ul' ? 'bullet' : 'number', items))
    } else if (tagName === 'img') {
      // Images are handled separately by the caller (extracted before
      // this function runs) — skip here to avoid a broken inline node.
      continue
    } else {
      const text = $(node).text().trim()
      if (text) blocks.push(paragraphNode([textNode(text)]))
    }
  }

  if (blocks.length === 0) {
    blocks.push(paragraphNode([]))
  }

  return {
    root: { type: 'root', children: blocks, direction: 'ltr', format: '', indent: 0, version: 1 },
  }
}
