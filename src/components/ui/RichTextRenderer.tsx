import React from 'react'
import { RichText as PayloadRichText } from '@payloadcms/richtext-lexical/react'
import type { SerializedEditorState } from '@payloadcms/richtext-lexical/lexical'

type Props = {
  content: SerializedEditorState | null | undefined
  className?: string
}

export function RichTextRenderer({ content, className }: Props) {
  if (!content) return null
  return (
    <div className={`prose prose-slate max-w-none text-slate-700 leading-relaxed ${className ?? ''}`}>
      <PayloadRichText data={content} />
    </div>
  )
}
