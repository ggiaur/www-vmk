'use client'

import React, { useActionState } from 'react'
import { submitDonationPledge, type ActionResult } from '@/app/actions'
import { CheckCircle2, AlertCircle } from 'lucide-react'

const initialState: ActionResult | null = null

export function DonationForm() {
  const [state, formAction, isPending] = useActionState(
    async (_prev: ActionResult | null, formData: FormData) => submitDonationPledge(formData),
    initialState,
  )

  if (state?.ok) {
    return (
      <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-lg text-sm text-emerald-800 font-semibold flex items-center gap-2">
        <CheckCircle2 className="w-5 h-5 shrink-0" />
        Köszönjük felajánlását! Munkatársunk hamarosan felveszi Önnel a kapcsolatot az átutalás
        részleteivel.
      </div>
    )
  }

  return (
    <form action={formAction} className="space-y-3 bg-white border border-slate-200 rounded p-5">
      <input
        name="name"
        required
        placeholder="Neve"
        className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm"
      />
      <input
        type="email"
        name="email"
        required
        placeholder="E-mail címe"
        className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm"
      />
      <input
        type="number"
        name="amount"
        placeholder="Felajánlott összeg (Ft, opcionális)"
        className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm"
      />
      <textarea
        name="message"
        placeholder="Üzenet (opcionális)"
        rows={3}
        className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm"
      />
      {state && !state.ok && (
        <p className="text-xs text-red-700 flex items-center gap-1.5">
          <AlertCircle className="w-4 h-4 shrink-0" />
          {state.error}
        </p>
      )}
      <button type="submit" disabled={isPending} className="btn-primary w-full justify-center text-sm">
        {isPending ? 'Küldés...' : 'Felajánlás elküldése'}
      </button>
      <p className="text-[11px] text-slate-500 text-center">
        Nem terheljük meg a kártyáját — kollégánk felveszi Önnel a kapcsolatot az átutalás
        részleteivel.
      </p>
    </form>
  )
}
