import React from 'react'
import { ShoppingCart, LayoutGrid, Store } from 'lucide-react'
import { useCart } from '../context/CartContext.jsx'

// Navbar recibe callbacks desde App para cambiar de vista y abrir el carrito.
// No maneja estado propio complejo: es "tonto" a propósito (presentacional).
export default function Navbar({ view, onChangeView, onOpenCart }) {
  const { totalItems } = useCart()

  return (
    <header className="sticky top-0 z-30 text-white shadow-lg" style={{ background: 'linear-gradient(135deg, #D946A8 0%, #E879C8 40%, #F0A4D8 70%, #F5C8E8 100%)' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-20 flex items-center justify-between gap-4">
        <button
          onClick={() => onChangeView('tienda')}
          className="flex items-center gap-3 font-display font-800 text-2xl tracking-tight"
        >
          <span className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center font-display font-800 text-white text-lg border border-white/30">
            AM
          </span>
          AniMarket
        </button>

        <nav className="hidden sm:flex items-center gap-1">
          <button
            onClick={() => onChangeView('tienda')}
            className={`px-4 py-2 rounded-full text-sm font-medium transition ${
              view === 'tienda' ? 'bg-white/20' : 'hover:bg-white/10'
            }`}
          >
            <span className="flex items-center gap-1.5">
              <Store size={16} /> Tienda
            </span>
          </button>
          <button
            onClick={() => onChangeView('admin')}
            className={`px-4 py-2 rounded-full text-sm font-medium transition ${
              view === 'admin' ? 'bg-white/20' : 'hover:bg-white/10'
            }`}
          >
            <span className="flex items-center gap-1.5">
              <LayoutGrid size={16} /> Administración
            </span>
          </button>
        </nav>

        <button
          onClick={onOpenCart}
          className="relative flex items-center gap-2 bg-white/15 hover:bg-white/25 transition rounded-full px-4 py-2.5"
        >
          <ShoppingCart size={20} />
          <span className="hidden sm:inline text-sm font-medium">Carrito</span>
          {totalItems > 0 && (
            <span
              key={totalItems}
              className="absolute -top-2 -right-2 bg-white text-brand text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center animate-bump"
            >
              {totalItems}
            </span>
          )}
        </button>
      </div>

      <div className="sm:hidden flex border-t border-white/20">
        <button
          onClick={() => onChangeView('tienda')}
          className={`flex-1 py-2.5 text-sm font-medium ${view === 'tienda' ? 'bg-white/20' : ''}`}
        >
          Tienda
        </button>
        <button
          onClick={() => onChangeView('admin')}
          className={`flex-1 py-2.5 text-sm font-medium ${view === 'admin' ? 'bg-white/20' : ''}`}
        >
          Administración
        </button>
      </div>
    </header>
  )
}
