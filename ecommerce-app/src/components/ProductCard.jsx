import React, { useState } from 'react'
import { ShoppingCart, PackageX, X, ChevronLeft, ChevronRight, Images, Eye, Share2, Check } from 'lucide-react'
import { useCart } from '../context/CartContext.jsx'

export default function ProductCard({ product }) {
  const { addToCart, cartItems } = useCart()
  const enCarrito = cartItems.find((i) => i.id === product.id)?.cantidad || 0
  const agotado = product.stock === 0
  const sinMasStock = enCarrito >= product.stock
  const imagenes = product.imagenes || (product.imagen ? [product.imagen] : [])
  const [idxImg, setIdxImg] = useState(0)
  const [modalImg, setModalImg] = useState(false)
  const [modalDetalle, setModalDetalle] = useState(false)
  const [modalIdx, setModalIdx] = useState(0)
  const [copiado, setCopiado] = useState(false)

  const anterior = () => setModalIdx((p) => (p === 0 ? imagenes.length - 1 : p - 1))
  const siguiente = () => setModalIdx((p) => (p === imagenes.length - 1 ? 0 : p + 1))

  const shareUrl = `${window.location.origin}${window.location.pathname}?producto=${product.id}`

  const compartir = async () => {
    if (navigator.share) {
      try {
        await navigator.share({ title: product.nombre, text: `${product.nombre} - $${product.precio.toLocaleString('es-AR')}`, url: shareUrl })
      } catch {}
    } else {
      await navigator.clipboard.writeText(shareUrl)
      setCopiado(true)
      setTimeout(() => setCopiado(false), 2000)
    }
  }

  return (
    <>
      <div className="group bg-white rounded-2xl shadow-card hover:shadow-cardHover transition-shadow duration-300 overflow-hidden flex flex-col">
        <div className="relative aspect-[4/3] overflow-hidden bg-canvas">
          <img
            src={imagenes[idxImg]}
            alt={product.nombre}
            onClick={() => { setModalIdx(idxImg); setModalImg(true) }}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 cursor-zoom-in"
          />
          <span className="absolute top-3 left-0 bg-ink/90 text-white text-[11px] font-semibold tracking-wide uppercase px-3 py-1 rounded-r-full">
            {product.categoria}
          </span>
          {imagenes.length > 1 && (
            <span className="absolute top-3 right-3 bg-ink/60 text-white text-[11px] font-semibold px-2 py-1 rounded-full flex items-center gap-1">
              <Images size={12} /> {imagenes.length}
            </span>
          )}
          {agotado && (
            <div className="absolute inset-0 bg-ink/50 flex items-center justify-center">
              <span className="bg-white text-ink font-display font-700 px-4 py-1.5 rounded-full text-sm">Agotado</span>
            </div>
          )}
        </div>

        {imagenes.length > 1 && (
          <div className="flex gap-1.5 px-3 pt-3 overflow-x-auto thin-scrollbar">
            {imagenes.map((img, i) => (
              <button key={i} onClick={() => setIdxImg(i)}
                className={`flex-shrink-0 w-14 h-14 rounded-lg overflow-hidden border-2 transition ${idxImg === i ? 'border-accent' : 'border-transparent opacity-60 hover:opacity-100'}`}>
                <img src={img} alt="" className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        )}

        <div className="p-4 flex flex-col flex-1 gap-2">
          <h3 className="font-display font-700 text-ink leading-snug line-clamp-2">{product.nombre}</h3>
          <p className="text-sm text-ink/55 line-clamp-2">{product.descripcion}</p>
          <div className="mt-auto pt-2 flex items-end justify-between">
            <div>
              <p className="font-display font-800 text-xl text-ink">${product.precio.toLocaleString('es-AR')}</p>
              <p className={`text-xs font-medium ${agotado ? 'text-red-500' : product.stock <= 5 ? 'text-gold' : 'text-mint'}`}>
                {agotado ? 'Sin stock' : `${product.stock} disponibles`}
              </p>
            </div>
          </div>

          <div className="flex gap-2 mt-2">
            <button onClick={() => setModalDetalle(true)}
              className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl border-2 border-ink/10 text-ink/60 hover:border-accent hover:text-accent font-semibold text-sm transition">
              <Eye size={15} /> Ver más
            </button>
            <button onClick={compartir}
              className={`flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl border-2 font-semibold text-sm transition ${
                copiado ? 'border-mint bg-mint-light text-mint' : 'border-ink/10 text-ink/60 hover:border-brand hover:text-brand'
              }`}>
              {copiado ? <><Check size={15} /> Copiado</> : <Share2 size={15} />}
            </button>
            <button onClick={() => addToCart(product)} disabled={agotado || sinMasStock}
              className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl font-semibold text-sm transition ${
                agotado || sinMasStock ? 'bg-ink/10 text-ink/40 cursor-not-allowed' : 'bg-accent text-white hover:bg-accent-dark active:scale-[0.98]'
              }`}>
              {agotado ? <><PackageX size={15} /> Agotado</> : sinMasStock ? 'Sin stock' : <><ShoppingCart size={15} /> Agregar</>}
            </button>
          </div>
        </div>
      </div>

      {modalImg && (
        <div className="fixed inset-0 bg-ink/90 z-50 flex items-center justify-center p-4" onClick={() => setModalImg(false)}>
          <button onClick={() => setModalImg(false)} className="absolute top-4 right-4 text-white/80 hover:text-white p-2">
            <X size={28} />
          </button>
          {imagenes.length > 1 && (
            <>
              <button onClick={(e) => { e.stopPropagation(); anterior() }} className="absolute left-4 text-white/80 hover:text-white p-2 bg-ink/40 rounded-full">
                <ChevronLeft size={32} />
              </button>
              <button onClick={(e) => { e.stopPropagation(); siguiente() }} className="absolute right-4 text-white/80 hover:text-white p-2 bg-ink/40 rounded-full">
                <ChevronRight size={32} />
              </button>
            </>
          )}
          <img src={imagenes[modalIdx]} alt={product.nombre} onClick={(e) => e.stopPropagation()}
            className="max-h-[85vh] max-w-[90vw] object-contain rounded-2xl shadow-2xl" />
          {imagenes.length > 1 && (
            <div className="absolute bottom-6 flex gap-2">
              {imagenes.map((img, i) => (
                <button key={i} onClick={(e) => { e.stopPropagation(); setModalIdx(i) }}
                  className={`w-16 h-16 rounded-xl overflow-hidden border-2 transition ${modalIdx === i ? 'border-accent' : 'border-white/30 opacity-60 hover:opacity-100'}`}>
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {modalDetalle && (
        <div className="fixed inset-0 bg-ink/50 z-50 flex items-center justify-center p-4" onClick={() => setModalDetalle(false)}>
          <div onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[92vh] overflow-y-auto thin-scrollbar">

            <div className="relative bg-canvas">
              <img src={imagenes[idxImg]} alt={product.nombre} className="w-full aspect-[16/9] object-cover rounded-t-2xl" />
              <button onClick={() => setModalDetalle(false)}
                className="absolute top-3 right-3 p-2 bg-white/80 hover:bg-white rounded-full shadow transition">
                <X size={18} />
              </button>
              {imagenes.length > 1 && (
                <span className="absolute top-3 left-3 bg-ink/60 text-white text-xs font-semibold px-2.5 py-1 rounded-full flex items-center gap-1">
                  <Images size={12} /> {imagenes.length} fotos
                </span>
              )}
            </div>

            {imagenes.length > 1 && (
              <div className="flex gap-2 px-5 pt-3 overflow-x-auto thin-scrollbar">
                {imagenes.map((img, i) => (
                  <button key={i} onClick={() => setIdxImg(i)}
                    className={`flex-shrink-0 w-16 h-16 rounded-xl overflow-hidden border-2 transition ${idxImg === i ? 'border-accent' : 'border-transparent opacity-60 hover:opacity-100'}`}>
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}

            <div className="p-6 space-y-4">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <span className="text-xs font-semibold text-accent uppercase tracking-wide">{product.categoria}</span>
                  <h2 className="font-display font-800 text-2xl text-ink mt-1">{product.nombre}</h2>
                </div>
                <div className="text-right flex-shrink-0">
                  <p className="font-display font-800 text-2xl text-ink">${product.precio.toLocaleString('es-AR')}</p>
                  <p className={`text-sm font-medium ${agotado ? 'text-red-500' : product.stock <= 5 ? 'text-gold' : 'text-mint'}`}>
                    {agotado ? 'Sin stock' : `${product.stock} unidades`}
                  </p>
                </div>
              </div>

              <div>
                <h4 className="text-sm font-semibold text-ink/70 mb-2">Descripción</h4>
                <p className="text-ink/65 text-sm leading-relaxed whitespace-pre-line">{product.descripcion}</p>
              </div>

              <div className="flex gap-3">
                <button onClick={compartir}
                  className={`flex items-center justify-center gap-1.5 py-3.5 px-5 rounded-xl border-2 font-semibold text-sm transition ${
                    copiado ? 'border-mint bg-mint-light text-mint' : 'border-ink/10 text-ink/60 hover:border-brand hover:text-brand'
                  }`}>
                  {copiado ? <><Check size={15} /> ¡Copiado!</> : <><Share2 size={15} /> Compartir</>}
                </button>
                <button onClick={() => { addToCart(product); setModalDetalle(false) }} disabled={agotado || sinMasStock}
                  className={`flex-1 py-3.5 rounded-xl font-semibold text-sm transition ${
                    agotado || sinMasStock ? 'bg-ink/10 text-ink/40 cursor-not-allowed' : 'bg-accent text-white hover:bg-accent-dark active:scale-[0.98]'
                  }`}>
                  {agotado ? 'Producto agotado' : sinMasStock ? 'Límite de stock alcanzado' : 'Agregar al carrito'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
