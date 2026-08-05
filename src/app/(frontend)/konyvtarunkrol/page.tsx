import React from 'react'
import type { Metadata } from 'next'
import Link from 'next/link'
import { Breadcrumb } from '@/components/navigation/Breadcrumb'
import { PageWithSidebar } from '@/components/layout/PageWithSidebar'

export const metadata: Metadata = {
  title: 'Könyvtárunkról – Vörösmarty Mihály Könyvtár',
  description: 'A Vörösmarty Mihály Könyvtár bemutatása, története és szervezeti felépítése.',
}

export default function KonyvtarunkrolPage() {
  return (
    <PageWithSidebar>
      <div>
        <Breadcrumb items={[{ label: 'Könyvtárunkról' }]} />

        <h1 className="font-serif text-[24px] font-bold text-[#333333] uppercase pt-[10px] pb-[15px] leading-[26.4px]">
          Könyvtárunkról
        </h1>

        <div className="text-[14px] leading-[22px] text-[#333] space-y-4" style={{ fontFamily: 'Roboto, sans-serif' }}>
          <p>
            A <strong>Vörösmarty Mihály Könyvtár</strong> Székesfehérvár megyei hatókörű városi könyvtára.
            A központi könyvtár a város szívében, a <strong>Bartók Béla tér 1.</strong> szám alatt található.
          </p>
          <p>
            Könyvtárunk a központi épületen kívül <strong>öt tagkönyvtárral</strong> szolgálja Székesfehérvár
            különböző városrészeinek lakosságát: Budai Úti, Mészöly Géza Utcai, Széna Téri, Tolnai Utcai
            és Zsolt Utcai Tagkönyvtár.
          </p>
          <p>
            Szolgáltatásaink közé tartozik a könyv- és médiakölcsönzés, helyben olvasás, internet-hozzáférés,
            rendezvények és kulturális programok szervezése, gyermek- és ifjúsági foglalkozások,
            pedagógiai szaktanácsadás, valamint helyismereti kutatási lehetőség.
          </p>

          <h2 className="font-serif text-[20px] font-bold text-[#333] uppercase pt-[15px]">Kapcsolódó oldalak</h2>
          <ul className="list-none space-y-2 pl-0">
            <li>
              <Link href="/munkatarsak" className="text-[#159097] hover:underline">Munkatársaink</Link>
            </li>
            <li>
              <Link href="/dokumentumok" className="text-[#159097] hover:underline">Alapdokumentumok</Link>
            </li>
            <li>
              <Link href="/kapcsolat" className="text-[#159097] hover:underline">Elérhetőségeink</Link>
            </li>
            <li>
              <Link href="/nyitvatartas" className="text-[#159097] hover:underline">Nyitvatartás</Link>
            </li>
          </ul>
        </div>
      </div>
    </PageWithSidebar>
  )
}
