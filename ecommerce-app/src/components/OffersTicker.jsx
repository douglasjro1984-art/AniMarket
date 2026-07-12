import React from 'react'
import { Zap } from 'lucide-react'

export default function OffersTicker({ products }) {
  const disponibles = products.filter((p) => p.stock > 0)

  if (disponibles.length === 0) return null

  const items = [...disponibles, ...disponibles]

  return (
    <div className="w-full overflow-hidden" style={{ background: 'linear-gradient(90deg, #D946A8, #E879C8, #D946A8)' }}>
      <div className="flex items-center">
        <div className="flex-shrink-0 flex items-center gap-2 px-5 py-4 bg-white/20 backdrop-blur-sm z-10">
          <Zap size={22} className="text-white" fill="white" />
          <span className="text-white text-sm font-bold uppercase tracking-wider whitespace-nowrap">Ofertas</span>
        </div>
        <div className="overflow-hidden flex-1">
          <div className="animate-marquee flex items-center whitespace-nowrap py-3">
            {items.map((p, i) => (
              <span key={`${p.id}-${i}`} className="inline-flex items-center gap-4 mx-8">
                <img src={p.imagenes?.[0] || p.imagen} alt="" className="w-14 h-14 rounded-xl object-cover border-2 border-white/40 shadow-lg flex-shrink-0" />
                <div className="flex flex-col">
                  <span className="text-white text-base font-bold leading-tight">{p.nombre}</span>
                  <span className="text-white/80 text-sm font-bold">${p.precio.toLocaleString('es-AR')}</span>
                </div>
                <span className="text-white/30 text-2xl mx-3">•</span>
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
