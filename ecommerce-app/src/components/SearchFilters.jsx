import React from 'react'
import { Search, SlidersHorizontal } from 'lucide-react'

// Buscador + filtros de categoría y precio máximo.
// Todo el estado de filtro vive en el padre (ProductGrid/App) y se pasa como props:
// esto es "lifting state up", el patrón estándar de React para compartir estado.
export default function SearchFilters({
  search,
  onSearchChange,
  categories,
  categoriaActiva,
  onCategoriaChange,
  precioMax,
  onPrecioMaxChange,
  precioLimite,
}) {
  return (
    <div className="bg-white rounded-2xl shadow-card p-4 sm:p-5 space-y-4">
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-ink/40" size={20} />
        <input
          type="text"
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Buscar productos, marcas y más..."
          className="w-full pl-12 pr-4 py-3 rounded-xl bg-canvas border border-transparent focus:border-accent focus:ring-2 focus:ring-accent/20 outline-none transition text-ink placeholder:text-ink/40"
        />
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center gap-4">
        <div className="flex items-center gap-2 text-ink/60 text-sm font-medium shrink-0">
          <SlidersHorizontal size={16} /> Filtros
        </div>

        {/* Categorías como chips */}
        <div className="flex flex-wrap gap-2">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => onCategoriaChange(cat)}
              className={`px-3.5 py-1.5 rounded-full text-sm font-medium transition border ${
                categoriaActiva === cat
                  ? 'bg-ink text-white border-ink'
                  : 'bg-white text-ink/70 border-ink/10 hover:border-ink/30'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Slider de precio máximo */}
        <div className="flex items-center gap-3 sm:ml-auto w-full sm:w-64">
          <span className="text-xs text-ink/50 whitespace-nowrap">Hasta ${precioMax.toLocaleString('es-AR')}</span>
          <input
            type="range"
            min={0}
            max={precioLimite}
            step={1000}
            value={precioMax}
            onChange={(e) => onPrecioMaxChange(Number(e.target.value))}
            className="w-full accent-accent"
          />
        </div>
      </div>
    </div>
  )
}
