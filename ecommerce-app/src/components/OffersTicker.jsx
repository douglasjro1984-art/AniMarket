import React from 'react'
import { Zap } from 'lucide-react'

export default function OffersTicker({ products }) {
  const disponibles = products.filter((p) => p.stock > 0)

  if (disponibles.length === 0) return null

  const items = [...disponibles, ...disponibles]

  return (
    <div className="w-full overflow-hidden" style={{ background: 'linear-gradient(90deg, #D946A8, #E879C8, #D946A8)' }}>
      <div className="flex items-center">
        <div className="flex-shrink-0 flex items-center gap-2 px-4 py-2.5 bg-white/20 backdrop-blur-sm z-10">
          <Zap size={16} className="text-white" fill="white" />
          <span className="text-white text-xs font-bold uppercase tracking-wider whitespace-nowrap">Ofertas</span>
        </div>
        <div className="overflow-hidden flex-1">
          <div className="animate-marquee flex items-center whitespace-nowrap py-2.5">
            {items.map((p, i) => (
              <span key={`${p.id}-${i}`} className="inline-flex items-center gap-3 mx-6">
                <img src={p.imagenes?.[0] || p.imagen} alt="" className="w-8 h-8 rounded-lg object-cover border border-white/30 flex-shrink-0" />
                <span className="text-white text-sm font-semibold">{p.nombre}</span>
                <span className="text-white/70 text-sm font-bold">${p.precio.toLocaleString('es-AR')}</span>
                <span className="text-white/40 mx-2">|</span>
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
