import React from 'react'
import type { Metadata } from 'next'
import { Breadcrumb } from '@/components/navigation/Breadcrumb'
import { getAllStaff } from '@/lib/payload'
import { User, Phone, Mail, Building } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Munkatársaink & Szervezet – Vörösmarty Mihály Könyvtár',
  description: 'A Vörösmarty Mihály Könyvtár vezetősége, szakmai részlegei és munkatársainak elérhetőségei.',
}

export default async function MunkatarsakPage() {
  const staffMembers = await getAllStaff().catch(() => [])

  const defaultStaff = [
    { id: 's1', name: 'Burián Jácint', position: 'Igazgató', phone: '+36 22 312 845', email: 'igazgato@vmk.hu', dept: 'Igazgatóság' },
    { id: 's2', name: 'Kovács Zsuzsanna', position: 'Igazgatóhelyettes / Szakmai vezető', phone: '+36 22 312 845 / 102', email: 'kovacs.zsuzsanna@vmk.hu', dept: 'Igazgatóság' },
    { id: 's3', name: 'Tóth Katalin', position: 'Olvasószolgálati Részlegvezető', phone: '+36 22 312 845 / 105', email: 'olvasoszolgalat@vmk.hu', dept: 'Központi Könyvtár' },
    { id: 's4', name: 'Szabó Péter', position: 'Helyismereti Szakreferens', phone: '+36 22 312 845 / 110', email: 'helyismeret@vmk.hu', dept: 'Helyismereti Részleg' },
    { id: 's5', name: 'Nagy Andrea', position: 'Gyermekkönyvtáros', phone: '+36 22 312 845 / 112', email: 'gyermekkonyvtar@vmk.hu', dept: 'Gyermekkönyvtár' },
  ]

  const displayStaff = staffMembers.length > 0 ? staffMembers : defaultStaff

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 space-y-8">
      <Breadcrumb items={[{ label: 'Munkatársaink' }]} />

      <div className="border-b border-slate-200 pb-6">
        <h1 className="text-3xl font-black text-slate-900">Munkatársaink & Szervezeti Felépítés</h1>
        <p className="text-slate-600 mt-2">
          Keresse munkatársainkat szakterület, beosztás és részleg szerint.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {displayStaff.map((person) => {
          const deptName =
            'department' in person && person.department && typeof person.department === 'object' && 'name' in person.department
              ? (person.department.name as string)
              : 'dept' in person
                ? (person.dept as string)
                : 'VMK Székesfehérvár'
          return (
            <div
              key={person.id}
              className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm flex items-start gap-4 hover:shadow-md transition-shadow"
            >
              <div className="w-12 h-12 rounded-full bg-[#8C1D11] text-white flex items-center justify-center font-bold shrink-0">
                <User className="w-6 h-6" />
              </div>

              <div className="space-y-1.5 min-w-0">
                <span className="text-[11px] font-semibold text-[#C85A32] flex items-center gap-1">
                  <Building className="w-3 h-3" />
                  {deptName}
                </span>
                <h3 className="font-bold text-slate-900 text-lg leading-tight truncate">{person.name}</h3>
                <p className="text-xs font-semibold text-slate-600">{person.position}</p>

                <div className="pt-2 space-y-1 text-xs text-slate-500">
                  {person.phone && (
                    <div className="flex items-center gap-1.5">
                      <Phone className="w-3.5 h-3.5 text-[#C85A32] shrink-0" />
                      <a href={`tel:${person.phone}`} className="hover:underline">{person.phone}</a>
                    </div>
                  )}
                  {person.email && (
                    <div className="flex items-center gap-1.5">
                      <Mail className="w-3.5 h-3.5 text-[#C85A32] shrink-0" />
                      <a href={`mailto:${person.email}`} className="hover:underline truncate">{person.email}</a>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
