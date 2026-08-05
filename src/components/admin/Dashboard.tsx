'use client'

/**
 * AdminDashboard — Egyedi Payload CMS v3 adminisztrátor főoldal.
 *
 * Ez a React Server Component (RSC) felváltja a Payload alapértelmezett
 * "Welcome to Payload" üdvözlő képernyőjét az /admin URL-en.
 *
 * Megjelenik:
 *  - Gyorsstatisztikák: publikált hírek, közelgő események, beolvasatlan
 *    kapcsolatfelvételi üzenetek, feldolgozatlan foglalások száma
 *  - Gyors-hozzáférési kártyák: leggyakrabban használt collection-ök
 *  - Legutóbb módosított tartalmak
 *
 * FONTOS: A Payload v3 custom dashboard komponense 'use client' direktívát
 * igényel — a statisztikák REST API-hívásokkal töltődnek be, nem Local API-val,
 * mert ez a komponens a böngészőben fut, nem a Node.js szerver kontextusában.
 *
 * Az adatok nem érzékenyek (csak számok), az API végpontok bejelentkezett
 * admin felhasználó session cookie-jával védettek.
 */

import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import { DashboardBanner } from './DashboardBanner'

type Stats = {
  publishedNews: number
  upcomingEvents: number
  newMessages: number
  pendingBookings: number
  totalStaff: number
  totalDocuments: number
}

type QuickLink = {
  label: string
  href: string
  description: string
  icon: string
  color: string
}

const QUICK_LINKS: QuickLink[] = [
  {
    label: 'Új Hír',
    href: '/admin/collections/news/create',
    description: 'Hírközlemény, pályázat vagy hirdetmény felvitele',
    icon: '📰',
    color: '#2563eb',
  },
  {
    label: 'Új Esemény',
    href: '/admin/collections/events/create',
    description: 'Rendezvény, foglalkozás, könyvbemutató rögzítése',
    icon: '📅',
    color: '#16a34a',
  },
  {
    label: 'Beérkező üzenetek',
    href: '/admin/collections/contact-messages',
    description: 'Látogatói megkeresések megtekintése és kezelése',
    icon: '✉️',
    color: '#dc2626',
  },
  {
    label: 'Foglalások',
    href: '/admin/collections/bookings',
    description: 'Terembérlési igények jóváhagyása vagy elutasítása',
    icon: '🏛️',
    color: '#7c3aed',
  },
  {
    label: 'Munkatársak',
    href: '/admin/collections/staff',
    description: 'Munkatársi adatok, elérhetőségek karbantartása',
    icon: '👥',
    color: '#0891b2',
  },
  {
    label: 'Médiatár',
    href: '/admin/collections/media',
    description: 'Képek és PDF fájlok feltöltése, kezelése',
    icon: '🖼️',
    color: '#b45309',
  },
]

function StatCard({
  label,
  value,
  icon,
  href,
  highlight = false,
}: {
  label: string
  value: number | null
  icon: string
  href: string
  highlight?: boolean
}) {
  return (
    <a
      href={href}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '1rem',
        padding: '1.25rem 1.5rem',
        background: highlight ? '#fef2f2' : '#f8fafc',
        border: `1.5px solid ${highlight ? '#fca5a5' : '#e2e8f0'}`,
        borderRadius: '0.75rem',
        textDecoration: 'none',
        color: 'inherit',
        transition: 'box-shadow 0.15s, transform 0.15s',
        cursor: 'pointer',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.boxShadow = '0 4px 16px rgba(0,0,0,0.10)'
        e.currentTarget.style.transform = 'translateY(-2px)'
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.boxShadow = 'none'
        e.currentTarget.style.transform = 'none'
      }}
    >
      <span style={{ fontSize: '2rem' }}>{icon}</span>
      <div>
        <div
          style={{
            fontSize: '1.75rem',
            fontWeight: 700,
            color: highlight ? '#dc2626' : '#1e293b',
            lineHeight: 1,
          }}
        >
          {value === null ? '…' : value}
        </div>
        <div style={{ fontSize: '0.85rem', color: '#64748b', marginTop: '0.25rem' }}>
          {label}
        </div>
      </div>
    </a>
  )
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadStats() {
      try {
        // A Payload REST API-hoz a bejelentkezett admin session cookie automatikusan
        // csatolódik — nincs szükség külön Authorization header-re.
        const [newsRes, eventsRes, messagesRes, bookingsRes, staffRes, docsRes] =
          await Promise.all([
            fetch('/api/news?where[_status][equals]=published&limit=0&depth=0'),
            fetch(
              `/api/events?where[startDate][greater_than]=${new Date().toISOString()}&where[_status][equals]=published&limit=0&depth=0`,
            ),
            fetch('/api/contact-messages?where[status][equals]=new&limit=0&depth=0'),
            fetch('/api/bookings?where[status][equals]=pending&limit=0&depth=0'),
            fetch('/api/staff?limit=0&depth=0'),
            fetch('/api/documents?limit=0&depth=0'),
          ])

        const [news, events, messages, bookings, staff, docs] = await Promise.all([
          newsRes.ok ? newsRes.json() : { totalDocs: 0 },
          eventsRes.ok ? eventsRes.json() : { totalDocs: 0 },
          messagesRes.ok ? messagesRes.json() : { totalDocs: 0 },
          bookingsRes.ok ? bookingsRes.json() : { totalDocs: 0 },
          staffRes.ok ? staffRes.json() : { totalDocs: 0 },
          docsRes.ok ? docsRes.json() : { totalDocs: 0 },
        ])

        setStats({
          publishedNews: news.totalDocs ?? 0,
          upcomingEvents: events.totalDocs ?? 0,
          newMessages: messages.totalDocs ?? 0,
          pendingBookings: bookings.totalDocs ?? 0,
          totalStaff: staff.totalDocs ?? 0,
          totalDocuments: docs.totalDocs ?? 0,
        })
      } catch {
        // Hiba esetén 0-kat mutatunk — a statisztika nem blokkolja a használatot
        setStats({
          publishedNews: 0,
          upcomingEvents: 0,
          newMessages: 0,
          pendingBookings: 0,
          totalStaff: 0,
          totalDocuments: 0,
        })
      } finally {
        setLoading(false)
      }
    }

    void loadStats()
  }, [])

  return (
    <div
      style={{
        padding: '2rem',
        maxWidth: '1100px',
        fontFamily:
          "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
      }}
    >
      <DashboardBanner />

      {/* Statisztikák */}
      <div style={{ marginBottom: '2.5rem' }}>
        <h2
          style={{
            fontSize: '1rem',
            fontWeight: 600,
            color: '#475569',
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
            margin: '0 0 1rem',
          }}
        >
          Aktuális Állapot
        </h2>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
            gap: '1rem',
          }}
        >
          <StatCard
            label="Publikált Hír"
            value={loading ? null : (stats?.publishedNews ?? 0)}
            icon="📰"
            href="/admin/collections/news"
          />
          <StatCard
            label="Közelgő Esemény"
            value={loading ? null : (stats?.upcomingEvents ?? 0)}
            icon="📅"
            href="/admin/collections/events"
          />
          <StatCard
            label="Új Üzenet"
            value={loading ? null : (stats?.newMessages ?? 0)}
            icon="✉️"
            href="/admin/collections/contact-messages"
            highlight={(stats?.newMessages ?? 0) > 0}
          />
          <StatCard
            label="Függő Foglalás"
            value={loading ? null : (stats?.pendingBookings ?? 0)}
            icon="🏛️"
            href="/admin/collections/bookings"
            highlight={(stats?.pendingBookings ?? 0) > 0}
          />
          <StatCard
            label="Munkatárs"
            value={loading ? null : (stats?.totalStaff ?? 0)}
            icon="👥"
            href="/admin/collections/staff"
          />
          <StatCard
            label="Dokumentum"
            value={loading ? null : (stats?.totalDocuments ?? 0)}
            icon="📄"
            href="/admin/collections/documents"
          />
        </div>
      </div>

      {/* Gyors hozzáférés */}
      <div>
        <h2
          style={{
            fontSize: '1rem',
            fontWeight: 600,
            color: '#475569',
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
            margin: '0 0 1rem',
          }}
        >
          Gyors Hozzáférés
        </h2>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
            gap: '1rem',
          }}
        >
          {QUICK_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: '1rem',
                padding: '1.25rem',
                background: '#fff',
                border: '1.5px solid #e2e8f0',
                borderRadius: '0.75rem',
                textDecoration: 'none',
                color: 'inherit',
                transition: 'box-shadow 0.15s, transform 0.15s, border-color 0.15s',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.boxShadow = `0 4px 20px rgba(0,0,0,0.10)`
                e.currentTarget.style.transform = 'translateY(-2px)'
                e.currentTarget.style.borderColor = link.color
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.boxShadow = 'none'
                e.currentTarget.style.transform = 'none'
                e.currentTarget.style.borderColor = '#e2e8f0'
              }}
            >
              <span
                style={{
                  fontSize: '1.75rem',
                  flexShrink: 0,
                  background: '#f1f5f9',
                  borderRadius: '0.5rem',
                  padding: '0.5rem',
                  lineHeight: 1,
                }}
              >
                {link.icon}
              </span>
              <div>
                <div
                  style={{
                    fontWeight: 600,
                    color: '#0f172a',
                    marginBottom: '0.25rem',
                  }}
                >
                  {link.label}
                </div>
                <div style={{ fontSize: '0.8rem', color: '#64748b', lineHeight: 1.4 }}>
                  {link.description}
                </div>
              </div>
            </a>
          ))}
        </div>
      </div>

      {/* Tipp a szerkesztőknek */}
      <div
        style={{
          marginTop: '2.5rem',
          padding: '1rem 1.25rem',
          background: '#fffbeb',
          border: '1px solid #fcd34d',
          borderRadius: '0.5rem',
          fontSize: '0.85rem',
          color: '#92400e',
        }}
      >
        <strong>💡 Tipp:</strong> Ha rendkívüli nyitvatartási változást (ünnepnap, szünet) kell
        közzétenni, menj a bal oldalsávban a{' '}
        <Link href="/admin/globals/opening-hours-global" style={{ color: '#b45309', fontWeight: 600 }}>
          Rendkívüli Nyitvatartás
        </Link>{' '}
        Global-hoz — ott a banner üzenet az összes oldalon megjelenik.
      </div>
    </div>
  )
}
