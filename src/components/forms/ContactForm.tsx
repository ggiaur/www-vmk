'use client'

import React, { useActionState } from 'react'
import { submitContactMessage, type ActionResult } from '@/app/actions'
import { CheckCircle2, AlertCircle, Send } from 'lucide-react'

const initialState: ActionResult | null = null

// A /kapcsolat oldal üzenetküldő űrlapja korábban egy sima, statikus <form>
// volt a szerver-komponensben: nem volt action/onSubmit handlere, és az input
// mezőknek name attribútuma sem. A "Küldés" gomb így csak egy üres GET-tel
// újratöltötte az oldalt, az üzenet pedig elveszett — miközben a required
// mezők böngésző-validációja azt a benyomást keltette, hogy működik.
export function ContactForm() {
  const [state, formAction, isPending] = useActionState(
    async (_prev: ActionResult | null, formData: FormData) => submitContactMessage(formData),
    initialState,
  )

  if (state?.ok) {
    return (
      <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-lg text-sm text-emerald-800 font-semibold flex items-center gap-2">
        <CheckCircle2 className="w-5 h-5 shrink-0" />
        Köszönjük megkeresését! Üzenetét rögzítettük, munkatársunk hamarosan válaszol a megadott
        e-mail címre.
      </div>
    )
  }

  return (
    <form action={formAction} className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label htmlFor="contact-name" className="block text-xs font-semibold text-slate-700 mb-1">
            Teljes Név *
          </label>
          <input
            id="contact-name"
            name="name"
            type="text"
            required
            placeholder="Minta János"
            className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#f59e0b]"
          />
        </div>
        <div>
          <label htmlFor="contact-email" className="block text-xs font-semibold text-slate-700 mb-1">
            E-mail cím *
          </label>
          <input
            id="contact-email"
            name="email"
            type="email"
            required
            placeholder="janos@example.com"
            className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#f59e0b]"
          />
        </div>
      </div>

      <div>
        <label htmlFor="contact-subject" className="block text-xs font-semibold text-slate-700 mb-1">
          Tárgy / Téma
        </label>
        {/* A value-knak egyezniük kell a ContactMessages gyűjtemény
            'subject' select mezőjének értékkészletével. */}
        <select
          id="contact-subject"
          name="subject"
          defaultValue="general"
          className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#f59e0b]"
        >
          <option value="general">Általános érdeklődés</option>
          <option value="lending">Könyvhosszabbítás / Kölcsönzés</option>
          <option value="event">Rendezvény regisztráció</option>
          <option value="room">Terembérlés</option>
          <option value="local-history">Helyismereti kutatás</option>
        </select>
      </div>

      <div>
        <label htmlFor="contact-message" className="block text-xs font-semibold text-slate-700 mb-1">
          Üzenet szövege *
        </label>
        <textarea
          id="contact-message"
          name="message"
          rows={5}
          required
          placeholder="Írja le kérdését vagy észrevételét..."
          className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#f59e0b]"
        />
      </div>

      {state && !state.ok && (
        <p className="text-xs text-red-700 flex items-center gap-1.5" role="alert">
          <AlertCircle className="w-4 h-4 shrink-0" />
          {state.error}
        </p>
      )}

      <button
        type="submit"
        disabled={isPending}
        className="btn-primary w-full sm:w-auto justify-center text-sm"
      >
        <Send className="w-4 h-4" />
        <span>{isPending ? 'Küldés...' : 'Üzenet Elküldése'}</span>
      </button>
    </form>
  )
}
