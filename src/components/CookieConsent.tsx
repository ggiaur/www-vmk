'use client'

import React, { useEffect, useState } from 'react'
import {
  getConsent,
  saveConsent,
  OPEN_CONSENT_SETTINGS_EVENT,
} from '@/lib/cookieConsent'

export function CookieConsent() {
  const [visible, setVisible] = useState(false)
  const [showDetails, setShowDetails] = useState(false)
  const [analytics, setAnalytics] = useState(false)

  useEffect(() => {
    if (!getConsent()) setVisible(true)

    const openSettings = () => {
      setAnalytics(getConsent()?.analytics ?? false)
      setShowDetails(true)
      setVisible(true)
    }
    window.addEventListener(OPEN_CONSENT_SETTINGS_EVENT, openSettings)
    return () => window.removeEventListener(OPEN_CONSENT_SETTINGS_EVENT, openSettings)
  }, [])

  if (!visible) return null

  const acceptAll = () => {
    saveConsent(true)
    setVisible(false)
  }

  const rejectOptional = () => {
    saveConsent(false)
    setVisible(false)
  }

  const saveSelection = () => {
    saveConsent(analytics)
    setVisible(false)
  }

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Sütikezelési beállítások"
      className="fixed inset-x-0 bottom-0 z-[10001] text-white"
      style={{ backgroundColor: '#00909B', fontFamily: 'Roboto, sans-serif' }}
    >
      <div className="max-w-[1170px] mx-auto px-[15px] py-4">
        {!showDetails ? (
          <div className="flex flex-col md:flex-row md:items-center gap-4">
            <p className="text-sm leading-relaxed flex-1">
              Ez a weboldal sütiket használ a működéshez szükséges alapfunkciókhoz. Statisztikai célú
              sütiket csak az Ön hozzájárulásával alkalmazunk.{' '}
              <a
                href="https://www.vmk.hu/_upload/editor/Alapdokumentumok/Adatkezelesi_tajekoztato_honlapra_VMK.pdf"
                target="_blank"
                rel="noopener noreferrer"
                className="underline text-[#7c3aed] hover:text-white"
              >
                Adatkezelési tájékoztató
              </a>
            </p>
            <div className="flex flex-wrap gap-2 shrink-0">
              <button
                type="button"
                onClick={() => setShowDetails(true)}
                className="px-4 py-2 text-sm font-semibold rounded border border-white/60 hover:bg-white/10 transition"
              >
                Beállítások
              </button>
              <button
                type="button"
                onClick={rejectOptional}
                className="px-4 py-2 text-sm font-semibold rounded border border-white/60 hover:bg-white/10 transition"
              >
                Elutasítom
              </button>
              <button
                type="button"
                onClick={acceptAll}
                className="px-4 py-2 text-sm font-bold rounded text-[#1B1B1B] hover:brightness-95 transition"
                style={{ backgroundColor: '#7c3aed' }}
              >
                Elfogadom
              </button>
            </div>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            <h2 className="text-base font-bold">Sütikezelési beállítások</h2>

            <div className="flex items-start justify-between gap-4 border-t border-white/20 pt-3">
              <div>
                <p className="font-semibold text-sm">Szükséges sütik</p>
                <p className="text-xs text-teal-50">
                  A weboldal alapműködéséhez (pl. bejelentkezés, foglalások) elengedhetetlenek, ezért
                  nem kapcsolhatók ki.
                </p>
              </div>
              <input type="checkbox" checked disabled aria-label="Szükséges sütik (mindig aktív)" className="mt-1 shrink-0" />
            </div>

            <div className="flex items-start justify-between gap-4 border-t border-white/20 pt-3">
              <div>
                <p className="font-semibold text-sm">Statisztikai sütik</p>
                <p className="text-xs text-teal-50">
                  Segítenek megérteni, hogyan használják a látogatók az oldalt (pl. látogatottsági
                  statisztikák). Csak hozzájárulás esetén aktiválódnak.
                </p>
              </div>
              <input
                type="checkbox"
                checked={analytics}
                onChange={(e) => setAnalytics(e.target.checked)}
                aria-label="Statisztikai sütik engedélyezése"
                className="mt-1 shrink-0"
              />
            </div>

            <div className="flex flex-wrap gap-2 justify-end border-t border-white/20 pt-3">
              <button
                type="button"
                onClick={() => setShowDetails(false)}
                className="px-4 py-2 text-sm font-semibold rounded border border-white/60 hover:bg-white/10 transition"
              >
                Vissza
              </button>
              <button
                type="button"
                onClick={saveSelection}
                className="px-4 py-2 text-sm font-bold rounded text-[#1B1B1B] hover:brightness-95 transition"
                style={{ backgroundColor: '#7c3aed' }}
              >
                Kiválasztottak mentése
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
