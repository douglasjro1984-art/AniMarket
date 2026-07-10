import React, { useMemo, useState } from 'react'
import SearchFilters from './SearchFilters.jsx'
import ProductCard from './ProductCard.jsx'
import { categories } from '../data/products.js'
import { PackageSearch } from 'lucide-react'

// Vista principal de la tienda: mantiene el estado de búsqueda/filtros
// localmente (useState) y deriva la lista filtrada con useMemo para
// evitar recalcular en cada render innecesariamente.
export default function ProductGrid({ products }) {
  const [search, setSearch] = useState('')
  const [categoriaActiva, setCategoriaActiva] = useState('Todas')

  const precioLimite = useMemo(
    () => Math.max(...products.map((p) => p.precio), 100000),
    [products],
  )
  const [precioMax, setPrecioMax] = useState(precioLimite)

  const productosFiltrados = useMemo(() => {
    return products.filter((p) => {
      const coincideBusqueda = p.nombre.toLowerCase().includes(search.toLowerCase())
      const coincideCategoria = categoriaActiva === 'Todas' || p.categoria === categoriaActiva
      const coincidePrecio = p.precio <= precioMax
      return coincideBusqueda && coincideCategoria && coincidePrecio
    })
  }, [products, search, categoriaActiva, precioMax])

  return (
    <div className="space-y-6">
      <SearchFilters
        search={search}
        onSearchChange={setSearch}
        categories={categories}
        categoriaActiva={categoriaActiva}
        onCategoriaChange={setCategoriaActiva}
        precioMax={precioMax}
        onPrecioMaxChange={setPrecioMax}
        precioLimite={precioLimite}
      />

      {productosFiltrados.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-ink/40 gap-3">
          <PackageSearch size={40} />
          <p className="font-medium">No encontramos productos con esos filtros</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {productosFiltrados.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  )
}
