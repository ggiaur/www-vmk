import React from 'react'
import type { Metadata } from 'next'
import { Breadcrumb } from '@/components/navigation/Breadcrumb'
import { PageWithSidebar } from '@/components/layout/PageWithSidebar'
import { getAllStaff } from '@/lib/payload'

export const metadata: Metadata = {
  title: 'Munkatársaink – Vörösmarty Mihály Könyvtár',
  description: 'A Vörösmarty Mihály Könyvtár munkatársainak elérhetőségei.',
}

type StaffEntry = {
  name: string
  position: string
  phone?: string
  email?: string
}

type StaffCategory = {
  title: string
  color: string
  members: StaffEntry[]
}

const STAFF_DATA: StaffCategory[] = [
  {
    title: 'Igazgatóság',
    color: '#137F85',
    members: [
      { name: 'Horváth Adrienn', position: 'igazgató', phone: '(22) 513-933', email: 'igazgato@vmk.hu' },
      { name: 'Kálmánné Heim Ágnes', position: 'Szakmai igazgatóhelyettes', phone: '(22) 340-698', email: 'kalmanne.agi@vmk.hu' },
    ],
  },
  {
    title: 'Titkárság és ügyviteli osztály',
    color: '#137F85',
    members: [
      { name: 'Fülöp Andrea', position: 'osztályvezető', email: 'fulop.andrea@vmk.hu' },
    ],
  },
  {
    title: 'Gyűjteményszervezési osztály',
    color: '#137F85',
    members: [
      { name: 'Kaltenecker Klára', position: 'osztályvezető', phone: '(22) 340-698', email: 'kaltenecker.klara@vmk.hu' },
    ],
  },
  {
    title: 'Állományalakítási, feldolgozó és metaadatszolgáltató csoport',
    color: '#508028',
    members: [
      { name: 'Darvas Veronika Judit', position: 'csoportvezető', email: 'darvas.veronika@vmk.hu' },
    ],
  },
  {
    title: 'Olvasószolgálati osztály',
    color: '#137F85',
    members: [
      { name: 'Darvas Veronika Judit', position: 'osztályvezető', email: 'darvas.veronika@vmk.hu' },
    ],
  },
  {
    title: 'Felnőtt kölcsönző részleg',
    color: '#508028',
    members: [
      { name: 'Központi olvasószolgálat', position: '', phone: '(70) 412-1984', email: 'kolcsonzo@vmk.hu' },
    ],
  },
  {
    title: 'Gyermek és kamasz VR',
    color: '#508028',
    members: [
      { name: 'Gyerekrészleg', position: '', phone: '(22) 513-931', email: 'gyerek@vmk.hu' },
    ],
  },
  {
    title: 'Pedagógiai Szaktanácsadó',
    color: '#508028',
    members: [
      { name: 'Pedagógiai szaktanácsadó', position: '', phone: '(22) 310-589', email: 'ps@vmk.hu' },
    ],
  },
  {
    title: 'Zenei és olvasótermi részleg',
    color: '#508028',
    members: [
      { name: 'Olvasóterem, zenei részleg', position: '', phone: '(22) 312-845', email: 'ol@vmk.hu' },
    ],
  },
  {
    title: 'Informatikai és tartalomszolgáltatási osztály',
    color: '#137F85',
    members: [
      { name: 'Bebreczki János', position: 'osztályvezető', phone: '(22) 385-241', email: 'bebreczki.janos@vmk.hu' },
    ],
  },
  {
    title: 'Helytörténeti, digitalizáló és webarchívum csoport',
    color: '#508028',
    members: [
      { name: 'Helytörténeti csoport', position: '', phone: '(22) 312-684', email: 'helytortenet@vmk.hu' },
    ],
  },
  {
    title: 'Módszertani és településfejlesztési osztály',
    color: '#137F85',
    members: [
      { name: 'Izsák Ferencné', position: 'osztályvezető', phone: '(22) 311-434', email: 'izsak.ferencne@vmk.hu' },
    ],
  },
  {
    title: 'Közzét',
    color: '#508028',
    members: [
      { name: 'Közzét', position: '', phone: '(22) 312-484', email: 'kozzet@vmk.hu' },
    ],
  },
  {
    title: 'Budai Úti Tagkönyvtár',
    color: '#e4b02c',
    members: [
      { name: 'Budai Úti Tagkönyvtár', position: '', phone: '(22) 329-436', email: 'budai@vmk.hu' },
    ],
  },
  {
    title: 'Mészöly Géza Utcai Tagkönyvtár',
    color: '#e4b02c',
    members: [
      { name: 'Mészöly Géza Utcai Tagkönyvtár', position: '', phone: '(22) 315-603', email: 'meszoly@vmk.hu' },
    ],
  },
  {
    title: 'Széna Téri Tagkönyvtár',
    color: '#e4b02c',
    members: [
      { name: 'Széna Téri Tagkönyvtár', position: '', phone: '(22) 313-643', email: 'szena@vmk.hu' },
    ],
  },
  {
    title: 'Tolnai Utcai Tagkönyvtár',
    color: '#e4b02c',
    members: [
      { name: 'Tolnai Utcai Tagkönyvtár', position: '', phone: '(22) 329-437', email: 'tolnai@vmk.hu' },
    ],
  },
  {
    title: 'Zsolt Utcai Tagkönyvtár',
    color: '#e4b02c',
    members: [
      { name: 'Zsolt Utcai Tagkönyvtár', position: '', phone: '(22) 329-458', email: 'zsolt@vmk.hu' },
    ],
  },
]

export default async function MunkatarsakPage() {
  const staffMembers = await getAllStaff().catch(() => [])

  let categories = STAFF_DATA

  if (staffMembers.length > 0) {
    const grouped = new Map<string, { color: string; members: StaffEntry[] }>()
    for (const s of staffMembers) {
      const deptName =
        s.department && typeof s.department === 'object' && 'name' in s.department
          ? (s.department.name as string)
          : 'Egyéb'
      if (!grouped.has(deptName)) {
        grouped.set(deptName, { color: '#137F85', members: [] })
      }
      grouped.get(deptName)!.members.push({
        name: s.name,
        position: s.position,
        phone: s.phone || undefined,
        email: s.email || undefined,
      })
    }
    categories = Array.from(grouped.entries()).map(([title, data]) => ({
      title,
      color: data.color,
      members: data.members,
    }))
  }

  return (
    <PageWithSidebar>
      <div>
        <Breadcrumb items={[{ label: 'Munkatársaink' }]} />

        <h1 className="font-serif text-[24px] font-bold text-[#333333] uppercase pt-[10px] pb-[15px] leading-[26.4px]">
          Munkatársaink
        </h1>

        <div className="space-y-[2px]" style={{ fontFamily: 'Roboto, sans-serif' }}>
          {categories.map((cat, ci) => (
            <div key={ci}>
              {/* Category header bar. #e4b02c (gold) is light enough that
                  white text on it only reaches 1.99:1 (WCAG needs 4.5:1) --
                  every other category color here is dark enough for white
                  text to pass, so this only special-cases the one light one
                  rather than darkening gold into a duller color site-wide. */}
              <div
                className="font-bold text-[14px] py-[8px] px-[15px] uppercase"
                style={{ backgroundColor: cat.color, color: cat.color === '#e4b02c' ? '#1B1B1B' : '#FFFFFF' }}
              >
                {cat.title}
              </div>

              {/* Staff members under this category */}
              {cat.members.map((member, mi) => (
                <div
                  key={mi}
                  className="grid grid-cols-1 sm:grid-cols-[1fr_auto_auto] gap-x-4 gap-y-1 py-[8px] px-[15px] border-b border-[#ddd] text-[14px] text-[#333]"
                  style={{ backgroundColor: mi % 2 === 0 ? '#ffffff' : '#f9f9f9' }}
                >
                  <div>
                    <span className="font-semibold">{member.name}</span>
                    {member.position && (
                      <span className="text-[#666] ml-2">– {member.position}</span>
                    )}
                  </div>
                  <div className="text-[#666]">
                    {member.phone || ''}
                  </div>
                  <div>
                    {member.email && (
                      <a href={`mailto:${member.email}`} className="text-[#137F85] hover:underline">
                        {member.email}
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </PageWithSidebar>
  )
}
