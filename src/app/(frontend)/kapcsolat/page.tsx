import React from 'react'
import type { Metadata } from 'next'
import Link from 'next/link'
import { Breadcrumb } from '@/components/navigation/Breadcrumb'
import { PageWithSidebar } from '@/components/layout/PageWithSidebar'
import { ContactForm } from '@/components/forms/ContactForm'
import { getAllLibraries } from '@/lib/payload'

export const metadata: Metadata = {
  title: 'Elérhetőségeink – Vörösmarty Mihály Könyvtár',
  description: 'A Vörösmarty Mihály Könyvtár elérhetőségei és munkatársaink.',
}

const KIEMELT = [
  { position: 'igazgató', name: 'Horváth Adrienn', email: 'igazgato@vmk.hu' },
  { position: 'Szakmai igazgatóhelyettes', name: 'Kálmánné Heim Ágnes', email: 'kalmanne.agi@vmk.hu' },
  { position: 'Titkárság és ügyviteli osztályvezető', name: 'Fülöp Andrea', email: '' },
  { position: 'Olvasószolgálati osztályvezető', name: 'Darvas Veronika Judit', email: '' },
  { position: 'Gyűjteményszervezési osztályvezető', name: 'Kaltenecker Klára', email: 'kaltenecker.klara@vmk.hu' },
  { position: 'Módszertani és településfejlesztési osztályvezető', name: 'Izsák Ferencné', email: 'izsak.ferencne@vmk.hu' },
  { position: 'Informatikai és tartalomszolgáltatási osztályvezető', name: 'Bebreczki János', email: 'bebreczki.janos@vmk.hu' },
]

const KOZPONTI = [
  { dept: 'Központi telefonszámok', phone: '(22) 312-684', email: '(22) 312-845' },
  { dept: 'igazgató', phone: '(22) 513-933', email: 'horvath.adrienn@vmk.hu' },
  { dept: 'Szakmai igazgatóhelyettes', phone: '(22) 340-698', email: 'kalmanne.agi@vmk.hu' },
  { dept: 'Állományalakítási, feldolgozó és metaadatszolg. csoport', phone: '(22) 340-698', email: 'kaltenecker.klara@vmk.hu' },
  { dept: 'Helytörténeti, digitalizáló és webarchívum csoport', phone: '(22) 312-684', email: 'helytortenet@vmk.hu' },
  { dept: 'Informatikai és tartalomszolgáltatási osztály', phone: '(22) 385-241', email: 'tartalom@vmk.hu' },
  { dept: 'Módszertani és településfejlesztési osztály', phone: '(22) 311-434', email: 'modszertan@vmk.hu' },
  { dept: 'Központi olvasószolgálat', phone: '(70) 412-1984', email: 'kolcsonzo@vmk.hu' },
  { dept: 'Gyermek és kamasz VR', phone: '(22) 513-931', email: 'gyerek@vmk.hu' },
  { dept: 'Pedagógiai Szaktanácsadó', phone: '(22) 310-589', email: 'ps@vmk.hu' },
  { dept: 'Olvasóterem', phone: '(22) 312-845', email: 'ol@vmk.hu' },
  { dept: 'Zenei és olvasótermi részleg', phone: '(22) 312-684', email: 'zene@vmk.hu' },
  { dept: 'Közzét', phone: '(22) 312-484', email: 'kozzet@vmk.hu' },
  { dept: 'Titkárság és ügyviteli osztály', phone: '(22) 513-933', email: 'titkarsag@vmk.hu' },
  { dept: 'Könyvtárközi kölcsönzés', phone: '(22) 340-699', email: 'kkcs@vmk.hu' },
]

const TAGKONYVTARAK = [
  { name: 'Budai Úti Tagkönyvtár', phone: '(22) 329-436', email: 'budai@vmk.hu' },
  { name: 'Mészöly Géza Utcai Tagkönyvtár', phone: '(22) 315-603', email: 'meszoly@vmk.hu' },
  { name: 'Széna Téri Tagkönyvtár', phone: '(22) 313-643', email: 'szena@vmk.hu' },
  { name: 'Tolnai Utcai Tagkönyvtár', phone: '(22) 329-437', email: 'tolnai@vmk.hu' },
  { name: 'Zsolt Utcai Tagkönyvtár', phone: '(22) 329-458', email: 'zsolt@vmk.hu' },
]

const POSTACIMEK = [
  { name: 'Postafiók', address: '8000 Székesfehérvár, Pf. 65.' },
  { name: 'Központi Könyvtár', address: '8000 Székesfehérvár, Bartók Béla tér 1.' },
  { name: 'Állományalakítási, feldolgozó és metaadatszolg. csoport', address: '8000 Székesfehérvár, Tolnai utca 41.' },
  { name: 'Budai Úti Tagkönyvtár', address: '8000 Székesfehérvár, Budai út 44-46.' },
  { name: 'Mészöly Géza Utcai Tagkönyvtár', address: '8000 Székesfehérvár, Mészöly Géza utca 1.' },
  { name: 'Széna Téri Tagkönyvtár', address: '8000 Székesfehérvár, Széna tér 16.' },
  { name: 'Tolnai Utcai Tagkönyvtár', address: '8000 Székesfehérvár, Tolnai utca 30.' },
  { name: 'Zsolt Utcai Tagkönyvtár', address: '8000 Székesfehérvár, Zsolt utca 54.' },
]

const TABLE_STYLE = 'w-full border-collapse mb-8 text-[14px]'
const TH_STYLE = 'text-center text-white font-bold text-[16px] py-[10px] px-[15px] uppercase'
const TD_STYLE = 'py-[8px] px-[15px] border border-[#ddd] align-top'

function rowBg(i: number) {
  return i % 2 === 0 ? '#ffffff' : '#f9f9f9'
}

export default async function KapcsolatPage() {
  let branches = TAGKONYVTARAK
  try {
    const libraries = await getAllLibraries()
    const dbBranches = libraries.filter((l) => l.type === 'branch')
    if (dbBranches.length > 0) {
      branches = dbBranches.map((b) => ({
        name: b.name,
        phone: b.phone || '',
        email: b.email || '',
      }))
    }
  } catch {
    // CMS nem elérhető
  }

  return (
    <PageWithSidebar>
      <div>
        <Breadcrumb items={[{ label: 'Elérhetőségeink' }]} />

        <h1 className="font-serif text-[24px] font-bold text-[#333333] uppercase pt-[10px] pb-[15px] leading-[26.4px]">
          Elérhetőségeink
        </h1>

        {/* Kiemelt elérhetőségeink */}
        <h2 className="text-[18px] font-bold text-[#333] mb-4 text-center" style={{ fontFamily: 'Roboto, sans-serif' }}>
          Kiemelt elérhetőségeink
        </h2>

        <table className={TABLE_STYLE} style={{ fontFamily: 'Roboto, sans-serif' }}>
          <tbody>
            {KIEMELT.map((row, i) => (
              <tr key={i}>
                <td className={TD_STYLE} style={{ backgroundColor: rowBg(i) }}>
                  {row.position}
                </td>
                <td className={`${TD_STYLE} font-semibold`} style={{ backgroundColor: rowBg(i) }}>
                  {row.name}
                </td>
                <td className={TD_STYLE} style={{ backgroundColor: rowBg(i) }}>
                  {row.email && <a href={`mailto:${row.email}`} className="text-[#2563eb] hover:underline">{row.email}</a>}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Központi Könyvtár elérhetőségei */}
        <h2 className="text-[18px] font-bold text-[#333] mb-4 text-center" style={{ fontFamily: 'Roboto, sans-serif' }}>
          Központi Könyvtár elérhetőségei
        </h2>

        <table className={TABLE_STYLE} style={{ fontFamily: 'Roboto, sans-serif' }}>
          <tbody>
            {KOZPONTI.map((row, i) => (
              <tr key={i}>
                <td className={TD_STYLE} style={{ backgroundColor: rowBg(i) }}>
                  {row.dept}
                </td>
                <td className={TD_STYLE} style={{ backgroundColor: rowBg(i) }}>
                  {row.phone}
                </td>
                <td className={TD_STYLE} style={{ backgroundColor: rowBg(i) }}>
                  {row.email.includes('@') ? (
                    <a href={`mailto:${row.email}`} className="text-[#2563eb] hover:underline">{row.email}</a>
                  ) : row.email}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Tagkönyvtárak elérhetőségei */}
        <h2 className="text-[18px] font-bold text-[#333] mb-4 text-center" style={{ fontFamily: 'Roboto, sans-serif' }}>
          Tagkönyvtárak elérhetőségei
        </h2>

        <table className={TABLE_STYLE} style={{ fontFamily: 'Roboto, sans-serif' }}>
          <tbody>
            {branches.map((row, i) => (
              <tr key={i}>
                <td className={TD_STYLE} style={{ backgroundColor: rowBg(i) }}>
                  {row.name}
                </td>
                <td className={TD_STYLE} style={{ backgroundColor: rowBg(i) }}>
                  {row.phone}
                </td>
                <td className={TD_STYLE} style={{ backgroundColor: rowBg(i) }}>
                  {row.email && (
                    <a href={`mailto:${row.email}`} className="text-[#2563eb] hover:underline">{row.email}</a>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Postacímeink */}
        <h2 className="text-[18px] font-bold text-[#333] mb-4 text-center" style={{ fontFamily: 'Roboto, sans-serif' }}>
          Postacímeink
        </h2>

        <table className={TABLE_STYLE} style={{ fontFamily: 'Roboto, sans-serif' }}>
          <tbody>
            {POSTACIMEK.map((row, i) => (
              <tr key={i}>
                <td className={`${TD_STYLE} font-semibold`} style={{ backgroundColor: rowBg(i) }}>
                  {row.name}
                </td>
                <td className={TD_STYLE} style={{ backgroundColor: rowBg(i) }}>
                  {row.address}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Munkatársaink link */}
        <div className="text-center mb-8">
          <Link
            href="/munkatarsak"
            className="inline-flex items-center gap-2 text-white font-bold py-[8px] px-[20px] rounded text-[14px]"
            style={{ backgroundColor: '#2563eb' }}
          >
            Munkatársaink
            <span className="text-[18px]">&gt;</span>
          </Link>
        </div>

        {/* Kapcsolatfelvételi űrlap */}
        <div className="border-t border-[#ddd] pt-8">
          <h2 className="text-[18px] font-bold text-[#333] mb-4" style={{ fontFamily: 'Roboto, sans-serif' }}>
            Írjon nekünk üzenetet!
          </h2>
          <ContactForm />
        </div>
      </div>
    </PageWithSidebar>
  )
}
