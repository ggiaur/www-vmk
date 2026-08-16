import React from 'react'
import type { Metadata } from 'next'
import { Breadcrumb } from '@/components/navigation/Breadcrumb'
import { PageWithSidebar } from '@/components/layout/PageWithSidebar'
import { WishRequestForm } from '@/components/forms/WishRequestForm'
import { WishCommentForm } from '@/components/forms/WishCommentForm'
import { getApprovedWishes, getApprovedWishComments } from '@/lib/payload'
import { Gift, MessageCircle } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Kívánságkosár – Vörösmarty Mihály Könyvtár',
  description: 'Javasoljon könyveket, amelyeket szeretne olvasni, de nem talált a könyvtár állományában.',
}

export default async function WishbasketPage() {
  const [wishes, comments] = await Promise.all([getApprovedWishes(), getApprovedWishComments()])

  return (
    <PageWithSidebar>
      <div className="max-w-5xl space-y-8">
        <Breadcrumb items={[{ label: 'Kívánságkosár' }]} />

        <div className="pb-4">
          <h1 className="font-serif text-[24px] font-bold text-[#333333] uppercase pt-[10px] pb-[15px] leading-[26.4px] flex items-center gap-3">
            <Gift className="w-8 h-8 text-[#159097]" />
            <span>Kívánságkosár</span>
          </h1>
          <p className="text-slate-600 mt-2 max-w-3xl">
            Kedves Olvasónk! Melyik könyvet nem találta katalógusunkban? Mit szeretne elolvasni, ami
            hiányzik állományunkból? Írja meg nekünk és mi — lehetőségeinkhez mérten — beszerezzük! A
            beérkezett könyvekről az igénylőket levélben értesítjük.
          </p>
        </div>

        <WishRequestForm />

        <div className="space-y-3">
          <h2 className="text-lg font-bold text-slate-900">Eddig beküldött kívánságok</h2>
          {wishes.length === 0 ? (
            <p className="text-sm text-slate-400 italic">Még nincs jóváhagyott kívánság.</p>
          ) : (
            <ul className="divide-y divide-slate-100 border border-slate-200 rounded overflow-hidden bg-white">
              {wishes.map((w) => (
                <li key={w.id} className="px-4 py-3">
                  <div className="flex items-baseline justify-between gap-3">
                    <span className="text-sm font-semibold text-slate-800">{w.shownName || 'Olvasónk'}</span>
                    <time className="text-xs text-slate-400">
                      {new Date(w.createdAt).toLocaleDateString('hu-HU')}
                    </time>
                  </div>
                  <p className="text-sm text-slate-700 mt-1">
                    {w.writer} — {w.title}
                  </p>
                  {w.adminNote && <p className="text-xs text-emerald-700 mt-1">{w.adminNote}</p>}
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="pt-4 space-y-3">
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <MessageCircle className="w-5 h-5 text-[#159097]" />
            Hozzászólások
          </h2>
          <p className="text-sm text-slate-600">Kérjük, írja meg véleményét, tapasztalatát! Köszönjük.</p>
          <WishCommentForm />
          {comments.length > 0 && (
            <ul className="divide-y divide-slate-100 border border-slate-200 rounded overflow-hidden bg-white mt-3">
              {comments.map((c) => (
                <li key={c.id} className="px-4 py-3">
                  <div className="flex items-baseline justify-between gap-3">
                    <span className="text-sm font-semibold text-slate-800">{c.shownName || 'Olvasónk'}</span>
                    <time className="text-xs text-slate-400">
                      {new Date(c.createdAt).toLocaleDateString('hu-HU')}
                    </time>
                  </div>
                  <p className="text-sm text-slate-700 mt-1">{c.comment}</p>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </PageWithSidebar>
  )
}
