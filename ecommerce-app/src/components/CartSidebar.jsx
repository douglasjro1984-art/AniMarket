import React from 'react'
import { X, Plus, Minus, Trash2, ShoppingBag } from 'lucide-react'
import { useCart } from '../context/CartContext.jsx'

// Panel lateral del carrito. Se muestra/oculta según la prop `open`
// controlada desde App. Usa useCart() para leer y modificar los ítems.
export default function CartSidebar({ open, onClose, onCheckout }) {
  const { cartItems, updateQuantity, removeFromCart, total } = useCart()

  return (
    <>
      {/* Overlay oscuro */}
      <div
        onClick={onClose}
        className={`fixed inset-0 bg-ink/40 z-40 transition-opacity ${
          open ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
      />

      <aside
        className={`fixed top-0 right-0 h-full w-full sm:w-[420px] bg-white z-50 shadow-2xl flex flex-col ${
          open ? 'animate-slide-in' : 'translate-x-full'
        } transition-transform`}
        style={{ transform: open ? 'translateX(0)' : 'translateX(100%)' }}
      >
        <div className="flex items-center justify-between p-5 border-b border-ink/10">
          <h2 className="font-display font-800 text-lg flex items-center gap-2">
            <ShoppingBag size={20} /> Tu carrito
          </h2>
          <button onClick={onClose} className="p-2 hover:bg-canvas rounded-full transition">
            <X size={20} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto thin-scrollbar p-5 space-y-4">
          {cartItems.length === 0 ? (
            <div className="text-center text-ink/40 mt-16">
              <ShoppingBag size={40} className="mx-auto mb-3 opacity-40" />
              Tu carrito está vacío
            </div>
          ) : (
            cartItems.map((item) => (
              <div key={item.id} className="flex gap-3 pb-4 border-b border-ink/5 last:border-0">
                <img
                  src={item.imagen}
                  alt={item.nombre}
                  className="w-16 h-16 rounded-lg object-cover shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm text-ink line-clamp-1">{item.nombre}</p>
                  <p className="text-accent font-display font-700 text-sm mt-0.5">
                    ${item.precio.toLocaleString('es-AR')}
                  </p>

                  <div className="flex items-center gap-2 mt-2">
                    <button
                      onClick={() => updateQuantity(item.id, -1, item.stock)}
                      className="w-7 h-7 rounded-full bg-canvas hover:bg-ink/10 flex items-center justify-center transition"
                    >
                      <Minus size={14} />
                    </button>
                    <span className="text-sm font-semibold w-5 text-center">{item.cantidad}</span>
                    <button
                      onClick={() => updateQuantity(item.id, 1, item.stock)}
                      disabled={item.cantidad >= item.stock}
                      className="w-7 h-7 rounded-full bg-canvas hover:bg-ink/10 disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center transition"
                    >
                      <Plus size={14} />
                    </button>

                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="ml-auto text-ink/30 hover:text-red-500 transition"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {cartItems.length > 0 && (
          <div className="p-5 border-t border-ink/10 space-y-3">
            <div className="flex items-center justify-between text-ink/60 text-sm">
              <span>Subtotal</span>
              <span>${total.toLocaleString('es-AR')}</span>
            </div>
            <div className="flex items-center justify-between font-display font-800 text-lg">
              <span>Total</span>
              <span>${total.toLocaleString('es-AR')}</span>
            </div>
            <button
              onClick={onCheckout}
              className="w-full py-3 rounded-xl bg-ink text-white font-semibold hover:bg-ink/90 active:scale-[0.98] transition"
            >
              Iniciar compra
            </button>
          </div>
        )}
      </aside>
    </>
  )
}
