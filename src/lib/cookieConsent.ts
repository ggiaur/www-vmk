// Süti-hozzájárulás állapotkezelése. A "necessary" kategória mindig aktív
// (munkamenet-, admin-bejelentkezés-sütik), az "analytics" alapértelmezetten
// kikapcsolt, amíg a látogató kifejezetten el nem fogadja — így ha később
// Google Analytics vagy más nyomkövető script kerül az oldalra, azt a
// hasConsent('analytics') ellenőrzés mögé kell tenni, hogy csak elfogadás
// után töltődjön be.
export type ConsentCategory = 'necessary' | 'analytics'

export interface ConsentState {
  necessary: true
  analytics: boolean
  decidedAt: string
}

const STORAGE_KEY = 'vmk-cookie-consent'
export const CONSENT_CHANGE_EVENT = 'vmk-consent-change'
export const OPEN_CONSENT_SETTINGS_EVENT = 'vmk-open-consent-settings'

export function getConsent(): ConsentState | null {
  if (typeof window === 'undefined') return null
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (!raw) return null
    return JSON.parse(raw) as ConsentState
  } catch {
    return null
  }
}

export function saveConsent(analytics: boolean): ConsentState {
  const state: ConsentState = { necessary: true, analytics, decidedAt: new Date().toISOString() }
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
  window.dispatchEvent(new CustomEvent(CONSENT_CHANGE_EVENT, { detail: state }))
  return state
}

export function hasConsent(category: ConsentCategory): boolean {
  if (category === 'necessary') return true
  return getConsent()?.analytics === true
}

export function openConsentSettings(): void {
  window.dispatchEvent(new Event(OPEN_CONSENT_SETTINGS_EVENT))
}
