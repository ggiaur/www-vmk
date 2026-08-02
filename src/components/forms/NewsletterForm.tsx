'use client'

import React, { useActionState } from 'react'
import { submitNewsletterSignup, type ActionResult } from '@/app/actions'
import { CheckCircle2, AlertCircle, ChevronRight } from 'lucide-react'

const initialState: ActionResult | null = null

export function NewsletterForm() {
  const [state, formAction, isPending] = useActionState(
    async (_prev: ActionResult | null, formData: FormData) => submitNewsletterSignup(formData),
    initialState,
  )

  if (state?.ok) {
    return (
      <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-lg text-sm text-emerald-300 font-semibold flex items-center gap-2">
        <CheckCircle2 className="w-4 h-4 shrink-0" />
        Köszönjük! Feliratkozását rögzítettük.
      </div>
    )
  }

  return (
    <form action={formAction} className="space-y-2.5">
      <div>
        <label htmlFor="newsletter-email" className="block text-sm text-white mb-1">
          E-mail:
        </label>
        <input
          id="newsletter-email"
          name="email"
          type="email"
          required
          className="w-full px-3 py-2 rounded bg-white border border-slate-300 text-slate-700 text-sm focus:outline-none focus:ring-2 focus:ring-[#e4b02c]"
        />
      </div>
      <div>
        <label htmlFor="newsletter-name" className="block text-sm text-white mb-1">
          Név:
        </label>
        <input
          id="newsletter-name"
          name="name"
          type="text"
          className="w-full px-3 py-2 rounded bg-white border border-slate-300 text-slate-700 text-sm focus:outline-none focus:ring-2 focus:ring-[#e4b02c]"
        />
      </div>
      <label className="flex items-start gap-2 text-[11px] text-teal-100">
        <input type="checkbox" required className="mt-0.5" />
        <span>Az Adatvédelmi tájékoztatóban foglaltakat megismertem és elfogadom.</span>
      </label>
      {state && !state.ok && (
        <p className="text-xs text-red-200 flex items-center gap-1.5" role="alert">
          <AlertCircle className="w-4 h-4 shrink-0" />
          {state.error}
        </p>
      )}
      <button
        type="submit"
        disabled={isPending}
        className="flex items-center gap-1 text-white text-sm font-semibold hover:underline disabled:opacity-60"
      >
        <span>{isPending ? 'Küldés...' : 'Feliratkozás'}</span>
        <ChevronRight className="w-4 h-4" />
      </button>
    </form>
  )
}
