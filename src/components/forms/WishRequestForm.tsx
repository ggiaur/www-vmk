'use client'

import React, { useActionState } from 'react'
import { submitWishRequest, type ActionResult } from '@/app/actions'
import { CheckCircle2, AlertCircle } from 'lucide-react'

const initialState: ActionResult | null = null

export function WishRequestForm() {
  const [state, formAction, isPending] = useActionState(
    async (_prev: ActionResult | null, formData: FormData) => submitWishRequest(formData),
    initialState,
  )

  if (state?.ok) {
    return (
      <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-lg text-sm text-emerald-800 font-semibold flex items-center gap-2">
        <CheckCircle2 className="w-5 h-5 shrink-0" />
        Köszönjük! Kívánságát rögzítettük, a beérkezett könyvekről e-mailben értesítjük.
      </div>
    )
  }

  return (
    <form action={formAction} className="space-y-3 bg-white border border-slate-200 rounded p-5">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <input name="name" required placeholder="Név *" className="px-3 py-2 rounded-lg border border-slate-200 text-sm" />
        <input name="shownName" placeholder="Megjelenített név" className="px-3 py-2 rounded-lg border border-slate-200 text-sm" />
        <input type="email" name="email" required placeholder="E-mail *" className="px-3 py-2 rounded-lg border border-slate-200 text-sm" />
        <input name="libraryCard" required placeholder="Olvasójegy száma *" className="px-3 py-2 rounded-lg border border-slate-200 text-sm" />
        <input name="writer" required placeholder="Szerző *" className="px-3 py-2 rounded-lg border border-slate-200 text-sm" />
        <input name="title" required placeholder="Cím *" className="px-3 py-2 rounded-lg border border-slate-200 text-sm" />
      </div>
      <textarea name="comment" placeholder="Megjegyzés (opcionális)" rows={2} className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm" />
      {state && !state.ok && (
        <p className="text-xs text-red-700 flex items-center gap-1.5">
          <AlertCircle className="w-4 h-4 shrink-0" />
          {state.error}
        </p>
      )}
      <button type="submit" disabled={isPending} className="btn-primary text-sm">
        {isPending ? 'Küldés...' : 'Kívánság beküldése'}
      </button>
    </form>
  )
}
