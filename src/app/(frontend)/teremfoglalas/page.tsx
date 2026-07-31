import React from 'react'
import type { Metadata } from 'next'
import { Breadcrumb } from '@/components/navigation/Breadcrumb'
import { BookingForm } from '@/components/forms/BookingForm'
import { getAllRooms } from '@/lib/payload'
import { DoorOpen, Users } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Teremfoglalás – Vörösmarty Mihály Könyvtár',
  description: 'Foglaljon tanuló- vagy rendezvénytermet a Vörösmarty Mihály Könyvtár épületeiben.',
}

export default async function TeremfoglalasPage() {
  const rooms = await getAllRooms().catch(() => [])

  return (
    <div className="max-w-5xl mx-auto px-4 py-6 space-y-8">
      <Breadcrumb items={[{ label: 'Teremfoglalás' }]} />

      <div className="border-b border-slate-200 pb-6">
        <h1 className="text-3xl font-black text-slate-900 flex items-center gap-3">
          <DoorOpen className="w-8 h-8 text-[#F3701D]" />
          <span>Teremfoglalás</span>
        </h1>
        <p className="text-slate-600 mt-2 max-w-3xl">
          Foglaljon tanulószobát, közösségi teret vagy rendezvénytermet könyvtárainkban. A foglalási
          igényét munkatársunk hamarosan visszaigazolja e-mailben.
        </p>
      </div>

      {rooms.length === 0 ? (
        <p className="text-sm text-slate-400 italic text-center py-12">
          Jelenleg nincs foglalható terem a rendszerben.
        </p>
      ) : (
        <div className="space-y-8">
          {rooms.map((room) => (
            <div key={room.id} className="space-y-3">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-slate-900">{room.name}</h2>
                <span className="flex items-center gap-1.5 text-xs text-slate-500">
                  <Users className="w-4 h-4" />
                  {room.capacity} fő
                </span>
              </div>
              {room.description && <p className="text-sm text-slate-600">{room.description}</p>}
              <BookingForm
                roomId={String(room.id)}
                openFrom={room.openFrom ?? '09:00'}
                openTo={room.openTo ?? '18:00'}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
