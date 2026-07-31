import { describe, expect, it } from 'vitest'
import { parseNewsListingPage, parseArticleDetail, guessDateFromSlug } from '../src/lib/scraper/vmkScraper'
import { htmlFragmentToLexical } from '../src/lib/scraper/htmlToLexical'
import { parseStaffListing } from '../src/lib/scraper/vmkStaffScraper'
import { parseDocumentsListing, guessCategory, guessYear } from '../src/lib/scraper/vmkDocumentsScraper'

describe('vmkScraper: parseNewsListingPage', () => {
  it('extracts title, url and lead from a real-shaped .news-index card', () => {
    const html = `
      <div class="news-index">
        <div class="title type1">
          <a href="/tajekoztatas-kozpont-2026-08-10" >Tájékoztatás</a>
        </div>
        <div class="news-lead"><p>Kedves Olvasóink!<br />Áramszünet lesz.</p></div>
        <a class="news-arrow" href="/tajekoztatas-kozpont-2026-08-10" ></a>
      </div>
    `
    const items = parseNewsListingPage(html)
    expect(items).toHaveLength(1)
    expect(items[0]).toMatchObject({
      url: '/tajekoztatas-kozpont-2026-08-10',
      title: 'Tájékoztatás',
    })
    expect(items[0].lead).toContain('Áramszünet lesz')
  })

  it('returns an empty array when no cards are present', () => {
    expect(parseNewsListingPage('<div>nothing here</div>')).toEqual([])
  })
})

describe('vmkScraper: parseArticleDetail', () => {
  it('extracts title, body html and image urls, resolving relative paths', () => {
    const html = `
      <div class="news-details-title type1">Tájékoztatás</div>
      <div class="news-details">
        <p><img src="/_upload/editor/2026/altalanos/ramszunet.png" width="1587" /></p>
        <p>Törzsszöveg itt.</p>
      </div>
    `
    const article = parseArticleDetail(html)
    expect(article.title).toBe('Tájékoztatás')
    expect(article.imageUrls).toEqual(['https://www.vmk.hu/_upload/editor/2026/altalanos/ramszunet.png'])
    expect(article.bodyHtml).not.toContain('<img')
    expect(article.bodyHtml).toContain('Törzsszöveg itt.')
  })
})

describe('vmkScraper: guessDateFromSlug', () => {
  it('parses an ISO-dashed slug exactly, not guessed', () => {
    const { date, guessed } = guessDateFromSlug('2026-06-15-a-muveszet-mindenkie')
    expect(guessed).toBe(false)
    expect(date.getUTCFullYear()).toBe(2026)
    expect(date.getUTCMonth()).toBe(5) // 0-indexed -> June
    expect(date.getUTCDate()).toBe(15)
  })

  it('parses a compact YYYYMMDD_ slug exactly, not guessed', () => {
    const { date, guessed } = guessDateFromSlug('20260602_nyaraljon_kedvenc')
    expect(guessed).toBe(false)
    expect(date.getUTCFullYear()).toBe(2026)
    expect(date.getUTCMonth()).toBe(5)
    expect(date.getUTCDate()).toBe(2)
  })

  it('falls back to a guessed month-only date for a YYYYMM_ slug', () => {
    const { guessed } = guessDateFromSlug('202605_szena_ter_kolcsonozheto')
    expect(guessed).toBe(true)
  })

  it('falls back to guessed=true for a slug with no date pattern at all', () => {
    const { guessed } = guessDateFromSlug('valami-cim-datum-nelkul')
    expect(guessed).toBe(true)
  })

  it('extracts a bare YYYY- year prefix (regression: was silently defaulting to scrape time)', () => {
    const { date, guessed } = guessDateFromSlug('2013-szent-istvan-emlekev')
    expect(guessed).toBe(true)
    expect(date.getUTCFullYear()).toBe(2013)
  })

  it('extracts a year embedded anywhere in the slug, e.g. at the end (regression)', () => {
    const { date, guessed } = guessDateFromSlug('kortars-muveszeti-fesztival-2017')
    expect(guessed).toBe(true)
    expect(date.getUTCFullYear()).toBe(2017)
  })

  it('extracts a year embedded in the middle of the slug (regression)', () => {
    const { date, guessed } = guessDateFromSlug('orszagos-konyvtari-napok-2016-1')
    expect(guessed).toBe(true)
    expect(date.getUTCFullYear()).toBe(2016)
  })

  it('parses an underscore-separated YYYY_MM_ prefix (regression)', () => {
    const { date, guessed } = guessDateFromSlug('2025_12_karacsonyi_varazslat_tolnai')
    expect(guessed).toBe(true)
    expect(date.getUTCFullYear()).toBe(2025)
    expect(date.getUTCMonth()).toBe(11) // December
  })

  it('parses a trailing compact YYYYMMDD suffix (regression)', () => {
    const { date, guessed } = guessDateFromSlug('kulcsert-dij-20250822')
    expect(guessed).toBe(true)
    expect(date.getUTCFullYear()).toBe(2025)
    expect(date.getUTCMonth()).toBe(7) // August
    expect(date.getUTCDate()).toBe(22)
  })

  it('does not misfire on a slug with no plausible 19xx/20xx year anywhere', () => {
    const { date } = guessDateFromSlug('konyvtarunk-rovid-tortenete')
    // No extractable year at all -> the only honest fallback left is "now".
    expect(date.getUTCFullYear()).toBe(new Date().getUTCFullYear())
  })
})

describe('htmlToLexical: htmlFragmentToLexical', () => {
  it('converts a paragraph with bold/italic/linebreak into the expected node shape', () => {
    const result = htmlFragmentToLexical('<p>Hello <strong>bold</strong> and <em>italic</em><br />world</p>')
    expect(result.root.type).toBe('root')
    expect(result.root.children).toHaveLength(1)
    const paragraph = result.root.children[0] as any
    expect(paragraph.type).toBe('paragraph')
    const textNode = paragraph.children.find((n: any) => n.text === 'bold')
    expect(textNode.format).toBe(1) // bold bit
  })

  it('produces a valid link node for a well-formed href', () => {
    const result = htmlFragmentToLexical('<p><a href="https://example.com">link</a></p>')
    const paragraph = result.root.children[0] as any
    const linkNode = paragraph.children.find((n: any) => n.type === 'link')
    expect(linkNode).toBeDefined()
    expect(linkNode.fields.url).toBe('https://example.com')
  })

  it('falls back to plain text (no link node) for a malformed href like "#"', () => {
    const result = htmlFragmentToLexical('<p><a href="#">click here</a></p>')
    const paragraph = result.root.children[0] as any
    const linkNode = paragraph.children.find((n: any) => n.type === 'link')
    expect(linkNode).toBeUndefined()
    const textNode = paragraph.children.find((n: any) => n.text === 'click here')
    expect(textNode).toBeDefined()
  })

  it('returns a single empty paragraph for empty input, never an empty children array', () => {
    const result = htmlFragmentToLexical('')
    expect(result.root.children).toHaveLength(1)
    expect(result.root.children[0].type).toBe('paragraph')
  })
})

describe('vmkStaffScraper: parseStaffListing', () => {
  it('extracts name, position, phone and email from a real-shaped staff card', () => {
    const html = `
      <div class="news-index">
        <div class="title type1" style="padding: 10px;">
          <a href="anyos-darinka">Ányos Darinka</a>
          <div class="date">olvasószolgálati könyvtáros</div>
        </div>
        <div class="news-lead">
          <div>Telefonszám: +36-22-329-438</div>
          <div>E-mail cím: <a class="mailto" href="mailto:darinka@vmk.hu">darinka@vmk.hu</a></div>
        </div>
      </div>
    `
    const members = parseStaffListing(html)
    expect(members).toHaveLength(1)
    expect(members[0]).toMatchObject({
      name: 'Ányos Darinka',
      position: 'olvasószolgálati könyvtáros',
      phone: '+36-22-329-438',
      email: 'darinka@vmk.hu',
    })
  })
})

describe('vmkDocumentsScraper: parseDocumentsListing', () => {
  it('extracts pdf title and absolute url from a freeform content block', () => {
    const html = `
      <div class="col-content">
        <div><a href="/_upload/editor/Alapdokumentumok/SZMSZ_20170719.pdf" target="_blank">Szervezeti és Működési Szabályzat</a></div>
      </div>
    `
    const docs = parseDocumentsListing(html)
    expect(docs).toHaveLength(1)
    expect(docs[0].title).toBe('Szervezeti és Működési Szabályzat')
    expect(docs[0].url).toBe('https://www.vmk.hu/_upload/editor/Alapdokumentumok/SZMSZ_20170719.pdf')
  })

  it('de-duplicates repeated hrefs (e.g. nav + content linking the same pdf)', () => {
    const html = `
      <div class="col-content">
        <div><a href="/_upload/editor/x.pdf">Cím</a></div>
        <div><a href="/_upload/editor/x.pdf">Cím Ismét</a></div>
      </div>
    `
    expect(parseDocumentsListing(html)).toHaveLength(1)
  })
})

describe('vmkDocumentsScraper: guessCategory / guessYear', () => {
  it.each([
    ['Szervezeti és Működési Szabályzat', 'szmsz'],
    ['SZMSZ 2017', 'szmsz'],
    ['Beszámoló-2015', 'report'],
    ['NKA pályázat 2020', 'grant'],
    ['Panaszbejelentő űrlap', 'form'],
    ['Használói kérdőív', 'form'],
    ['Jövőkép', 'other'],
  ])('categorizes "%s" as %s', (title, expected) => {
    expect(guessCategory(title)).toBe(expected)
  })

  it('extracts a 4-digit year from the title when present', () => {
    expect(guessYear('Beszámoló-2015', 'https://x/Beszamolo.pdf')).toBe(2015)
  })

  it('falls back to a year found in the URL when absent from the title', () => {
    expect(guessYear('Jövőkép', 'https://x/2019/jovokep.pdf')).toBe(2019)
  })

  it('returns undefined when no year is found anywhere', () => {
    expect(guessYear('Jövőkép', 'https://x/jovokep.pdf')).toBeUndefined()
  })
})
