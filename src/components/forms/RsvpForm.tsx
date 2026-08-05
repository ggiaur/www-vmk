'use client'

import React, { useActionState } from 'react'
import { submitRsvp, type ActionResult } from '@/app/actions'
import { CheckCircle2, AlertCircle } from 'lucide-react'

const initialState: ActionResult | null = null

export function RsvpForm({
  eventId,
  eventSlug,
  remainingSpots,
}: {
  eventId: string
  eventSlug: string
  remainingSpots: number | null
}) {
  const [state, formAction, isPending] = useActionState(
    async (_prev: ActionResult | null, formData: FormData) => submitRsvp(formData),
    initialState,
  )

  if (remainingSpots !== null && remainingSpots <= 0) {
    return (
      <div className="p-4 bg-slate-100 rounded-lg text-sm text-slate-600 font-semibold text-center">
        Sajnáljuk, ez a rendezvény betelt.
      </div>
    )
  }

  if (state?.ok) {
    return (
      <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-lg text-sm text-emerald-800 font-semibold flex items-center gap-2">
        <CheckCircle2 className="w-5 h-5 shrink-0" />
        Sikeres jelentkezés! Visszaigazoló e-mailt küldünk.
      </div>
    )
  }

  return (
    <form action={formAction} className="space-y-3 bg-white border border-slate-200 rounded p-5">
      <input type="hidden" name="eventId" value={eventId} />
      <input type="hidden" name="eventSlug" value={eventSlug} />
      <h3 className="font-bold text-slate-900">Jelentkezés a rendezvényre</h3>
      {remainingSpots !== null && (
        <p className="text-xs text-slate-500">Szabad helyek: {remainingSpots}</p>
      )}
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
        name="guestCount"
        min={1}
        defaultValue={1}
        className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm"
      />
      {state && !state.ok && (
        <p className="text-xs text-red-700 flex items-center gap-1.5">
          <AlertCircle className="w-4 h-4 shrink-0" />
          {state.error}
        </p>
      )}
      <button type="submit" disabled={isPending} className="btn-primary w-full justify-center text-sm">
        {isPending ? 'Küldés...' : 'Jelentkezem'}
      </button>
    </form>
  )
}
