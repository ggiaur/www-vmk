'use client'

import React, { useActionState } from 'react'
import { submitBooking, type ActionResult } from '@/app/actions'
import { CheckCircle2, AlertCircle } from 'lucide-react'

const initialState: ActionResult | null = null

export function BookingForm({ roomId, openFrom, openTo }: { roomId: string; openFrom: string; openTo: string }) {
  const [state, formAction, isPending] = useActionState(
    async (_prev: ActionResult | null, formData: FormData) => submitBooking(formData),
    initialState,
  )

  if (state?.ok) {
    return (
      <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-lg text-sm text-emerald-800 font-semibold flex items-center gap-2">
        <CheckCircle2 className="w-5 h-5 shrink-0" />
        Foglalási igényét rögzítettük — a könyvtár munkatársa hamarosan visszaigazolja.
      </div>
    )
  }

  return (
    <form action={formAction} className="space-y-3 bg-white border border-slate-200 rounded p-5">
      <input type="hidden" name="roomId" value={roomId} />
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <input
          type="date"
          name="date"
          required
          className="px-3 py-2 rounded-lg border border-slate-200 text-sm"
        />
        <input
          type="time"
          name="startTime"
          required
          defaultValue={openFrom}
          className="px-3 py-2 rounded-lg border border-slate-200 text-sm"
        />
        <input
          type="time"
          name="endTime"
          required
          defaultValue={openTo}
          className="px-3 py-2 rounded-lg border border-slate-200 text-sm"
        />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <input
          name="requesterName"
          required
          placeholder="Neve"
          className="px-3 py-2 rounded-lg border border-slate-200 text-sm"
        />
        <input
          type="email"
          name="requesterEmail"
          required
          placeholder="E-mail címe"
          className="px-3 py-2 rounded-lg border border-slate-200 text-sm"
        />
      </div>
      <textarea
        name="purpose"
        placeholder="A foglalás célja (opcionális)"
        rows={2}
        className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm"
      />
      {state && !state.ok && (
        <p className="text-xs text-red-700 flex items-center gap-1.5">
          <AlertCircle className="w-4 h-4 shrink-0" />
          {state.error}
        </p>
      )}
      <button type="submit" disabled={isPending} className="btn-primary text-sm">
        {isPending ? 'Küldés...' : 'Foglalás kérése'}
      </button>
    </form>
  )
}
