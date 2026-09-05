import React from 'react'
import Link from 'next/link'
import { MapPin, Phone, Mail, Clock, ArrowRight } from 'lucide-react'

export interface LibraryCardProps {
  name: string
  slug: string
  address: string
  phone?: string
  email?: string
  type: 'central' | 'branch' | 'department' | string
  href?: string
}

const typeLabels: Record<string, string> = {
  central: 'Központi Könyvtár',
  branch: 'Tagkönyvtár',
  department: 'Részleg',
}

export const LibraryCard: React.FC<LibraryCardProps> = ({
  name,
  slug,
  address,
  phone,
  email,
  type,
  href,
}) => {
  const linkHref = href ?? `/nyitvatartas#${slug}`
  return (
    <div className="bg-white rounded border border-slate-200 p-5 flex flex-col justify-between">
      <div>
        <span className="text-xs px-2.5 py-1 rounded font-medium bg-amber-50 text-[#137F85] border border-amber-200/60 inline-block mb-3">
          {typeLabels[type] || 'Tagkönyvtár'}
        </span>

        <h3 className="font-bold text-slate-900 text-lg mb-3 hover:text-[#137F85] transition-colors">
          <Link href={linkHref}>{name}</Link>
        </h3>

        <div className="space-y-2 text-xs text-slate-600 mb-4">
          <div className="flex items-start gap-2">
            <MapPin className="w-4 h-4 text-[#e4b02c] shrink-0 mt-0.5" />
            <span>{address}</span>
          </div>

          {phone && (
            <div className="flex items-center gap-2">
              <Phone className="w-4 h-4 text-[#e4b02c] shrink-0" />
              <a href={`tel:${phone}`} className="hover:underline">{phone}</a>
            </div>
          )}

          {email && (
            <div className="flex items-center gap-2">
              <Mail className="w-4 h-4 text-[#e4b02c] shrink-0" />
              <a href={`mailto:${email}`} className="hover:underline">{email}</a>
            </div>
          )}
        </div>
      </div>

      <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-[#137F85]">
        <span className="flex items-center gap-1 text-slate-500 font-normal">
          <Clock className="w-3.5 h-3.5 text-emerald-600" />
          <span>Ma nyitva</span>
        </span>
        <Link href={`/nyitvatartas#${slug}`} className="hover:underline flex items-center gap-1">
          <span>Nyitvatartás</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </div>
  )
}
