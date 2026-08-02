'use client'

import React, { useActionState } from 'react'
import { submitNewsletterSignup, type ActionResult } from '@/app/actions'
import { CheckCircle2, AlertCircle } from 'lucide-react'

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
    <form action={formAction} className="space-y-2">
      <input
        name="email"
        type="email"
        required
        placeholder="E-mail cím"
        className="w-full px-3 py-2 rounded-lg bg-white/10 border border-white/10 text-white placeholder:text-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-[#e4b02c]"
      />
      <input
        name="name"
        type="text"
        placeholder="Név (opcionális)"
        className="w-full px-3 py-2 rounded-lg bg-white/10 border border-white/10 text-white placeholder:text-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-[#e4b02c]"
      />
      <label className="flex items-start gap-2 text-[11px] text-slate-400">
        <input type="checkbox" required className="mt-0.5" />
        <span>Az Adatvédelmi tájékoztatóban foglaltakat megismertem és elfogadom.</span>
      </label>
      {state && !state.ok && (
        <p className="text-xs text-red-400 flex items-center gap-1.5" role="alert">
          <AlertCircle className="w-4 h-4 shrink-0" />
          {state.error}
        </p>
      )}
      <button
        type="submit"
        disabled={isPending}
        className="w-full px-4 py-2 rounded-lg bg-[#e4b02c] hover:bg-[#c99a1f] text-[#1B1B1B] text-sm font-bold transition-colors"
      >
        {isPending ? 'Küldés...' : 'Feliratkozás'}
      </button>
    </form>
  )
}
