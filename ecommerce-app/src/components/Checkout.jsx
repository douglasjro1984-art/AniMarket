import React, { useState, useEffect, useRef } from 'react'
import { Truck, Store, CreditCard, Landmark, Banknote, CheckCircle2, X, QrCode } from 'lucide-react'
import { useCart } from '../context/CartContext.jsx'
import { updateStockBulk } from '../api.js'
import QRCode from 'qrcode'

const etiquetaPago = {
  tarjeta: 'Tarjeta de Crédito/Débito',
  transferencia: 'Transferencia Bancaria',
  efectivo: 'Efectivo',
}

const opcionesEntrega = [
  { id: 'domicilio', label: 'Envío a domicilio', icon: Truck },
  { id: 'sucursal', label: 'Retiro en sucursal', icon: Store },
]

export default function Checkout({ products, setProducts, onClose }) {
  const { cartItems, total, clearCart, agregarOrden, obtenerDatosBanco } = useCart()

  const [paso, setPaso] = useState('formulario')
  const [entrega, setEntrega] = useState('domicilio')
  const [direccion, setDireccion] = useState('')
  const [pago, setPago] = useState('transferencia')
  const [orden, setOrden] = useState(null)
  const [qrDataUrl, setQrDataUrl] = useState(null)

  const opcionesPago = entrega === 'domicilio'
    ? [
        { id: 'transferencia', label: 'Transferencia Bancaria', icon: Landmark },
        { id: 'efectivo', label: 'Efectivo', icon: Banknote },
      ]
    : [
        { id: 'tarjeta', label: 'Tarjeta de Crédito/Débito', icon: CreditCard },
        { id: 'transferencia', label: 'Transferencia Bancaria', icon: Landmark },
        { id: 'efectivo', label: 'Efectivo', icon: Banknote },
      ]

  useEffect(() => {
    if (entrega === 'domicilio' && pago === 'tarjeta') {
      setPago('transferencia')
    }
  }, [entrega, pago])

  useEffect(() => {
    if (paso === 'confirmado' && orden?.pago === 'transferencia') {
      const datos = obtenerDatosBanco()
      const texto = [
        `Nombre: ${datos.nombre || '—'}`,
        `Teléfono: ${datos.telefono || '—'}`,
        `CBU / CUIT: ${datos.cbu || '—'}`,
        `N° Cuenta: ${datos.numero || '—'}`,
        `Alias: ${datos.alias || '—'}`,
        `Total: $${orden.total.toLocaleString('es-AR')}`,
        `Orden: ${orden.numero}`,
      ].join('\n')
      QRCode.toDataURL(texto, { width: 280, margin: 2 }).then(setQrDataUrl)
    }
  }, [paso, orden])

  const confirmarPedido = async (e) => {
    e.preventDefault()

    const stockUpdates = cartItems.map((item) => {
      const prod = products.find((p) => p.id === item.id)
      return { id: item.id, stock: prod ? prod.stock - item.cantidad : 0 }
    })
    await updateStockBulk(stockUpdates)
    setProducts((prev) =>
      prev.map((p) => {
        const update = stockUpdates.find((u) => u.id === p.id)
        return update ? { ...p, stock: update.stock } : p
      }),
    )

    const numeroOrden = `AM-${Math.floor(100000 + Math.random() * 900000)}`
    const nuevaOrden = {
      numero: numeroOrden,
      items: cartItems,
      total,
      entrega,
      direccion,
      pago,
      estado: 'pendiente',
      fecha: new Date().toLocaleDateString('es-AR', { day: '2-digit', month: 'long', year: 'numeric' }),
    }
    setOrden(nuevaOrden)
    agregarOrden(nuevaOrden)
    clearCart()
    setPaso('confirmado')
    setQrDataUrl(null)
  }

  return (
    <div className="fixed inset-0 bg-ink/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-xl max-h-[92vh] overflow-y-auto thin-scrollbar">
        {paso === 'formulario' ? (
          <form onSubmit={confirmarPedido} className="p-6 space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="font-display font-800 text-xl">Finalizar compra</h2>
              <button type="button" onClick={onClose} className="p-1.5 hover:bg-canvas rounded-full">
                <X size={18} />
              </button>
            </div>

            <section>
              <h3 className="text-sm font-semibold text-ink/70 mb-3">Método de entrega</h3>
              <div className="grid grid-cols-2 gap-3">
                {opcionesEntrega.map(({ id, label, icon: Icon }) => (
                  <button
                    type="button"
                    key={id}
                    onClick={() => setEntrega(id)}
                    className={`flex flex-col items-center gap-2 py-4 rounded-xl border-2 transition ${
                      entrega === id
                        ? 'border-accent bg-accent/5 text-accent'
                        : 'border-ink/10 text-ink/60 hover:border-ink/20'
                    }`}
                  >
                    <Icon size={22} />
                    <span className="text-sm font-medium">{label}</span>
                  </button>
                ))}
              </div>

              {entrega === 'domicilio' && (
                <input
                  required
                  value={direccion}
                  onChange={(e) => setDireccion(e.target.value)}
                  placeholder="Calle, número, ciudad, provincia"
                  className="w-full mt-3 px-3 py-2.5 rounded-xl bg-canvas border border-transparent focus:border-accent outline-none"
                />
              )}
              {entrega === 'sucursal' && (
                <p className="mt-3 text-sm text-ink/50 bg-canvas rounded-xl p-3">
                  Retirás en Sucursal Central — Av. Siempre Viva 742, disponible en 24hs.
                </p>
              )}
            </section>

            <section>
              <h3 className="text-sm font-semibold text-ink/70 mb-3">Método de pago</h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {opcionesPago.map(({ id, label, icon: Icon }) => (
                  <button
                    type="button"
                    key={id}
                    onClick={() => setPago(id)}
                    className={`flex flex-col items-center gap-2 py-4 rounded-xl border-2 transition text-center ${
                      pago === id
                        ? 'border-mint bg-mint-light text-mint'
                        : 'border-ink/10 text-ink/60 hover:border-ink/20'
                    }`}
                  >
                    <Icon size={22} />
                    <span className="text-xs font-medium">{label}</span>
                  </button>
                ))}
              </div>
            </section>

            <div className="bg-canvas rounded-xl p-4 flex items-center justify-between">
              <span className="text-ink/60 text-sm">Total a pagar</span>
              <span className="font-display font-800 text-xl">${total.toLocaleString('es-AR')}</span>
            </div>

            <button
              type="submit"
              className="w-full py-3.5 rounded-xl bg-accent text-white font-semibold hover:bg-accent-dark active:scale-[0.98] transition"
            >
              Confirmar pedido
            </button>
          </form>
        ) : (
          <div className="p-8 text-center space-y-5">
            <div className="w-16 h-16 mx-auto rounded-full bg-mint-light flex items-center justify-center">
              <CheckCircle2 size={36} className="text-mint" />
            </div>
            <div>
              <h2 className="font-display font-800 text-xl">¡Pedido confirmado!</h2>
              <p className="text-ink/50 text-sm mt-1">
                Orden <span className="font-semibold text-ink">{orden.numero}</span> generada el {orden.fecha}
              </p>
            </div>

            {orden.pago === 'transferencia' && qrDataUrl && (
              <div className="bg-canvas rounded-2xl p-5 space-y-3">
                <div className="flex items-center justify-center gap-2 text-sm font-semibold text-ink/70">
                  <QrCode size={18} /> Escaneá el QR para pagar
                </div>
                <img src={qrDataUrl} alt="QR de pago" className="mx-auto rounded-xl" />
                <div className="text-left text-xs text-ink/50 space-y-0.5 bg-white rounded-xl p-3">
                  {(() => {
                    const datos = obtenerDatosBanco()
                    return (
                      <>
                        <p><strong>Nombre:</strong> {datos.nombre || '—'}</p>
                        <p><strong>Teléfono:</strong> {datos.telefono || '—'}</p>
                        <p><strong>CBU / CUIT:</strong> {datos.cbu || '—'}</p>
                        <p><strong>N° Cuenta:</strong> {datos.numero || '—'}</p>
                        <p><strong>Alias:</strong> {datos.alias || '—'}</p>
                      </>
                    )
                  })()}
                </div>
              </div>
            )}

            <div className="bg-canvas rounded-xl p-4 text-left space-y-2">
              {orden.items.map((item) => (
                <div key={item.id} className="flex justify-between text-sm">
                  <span className="text-ink/70">
                    {item.cantidad}x {item.nombre}
                  </span>
                  <span className="font-medium">${(item.precio * item.cantidad).toLocaleString('es-AR')}</span>
                </div>
              ))}
              <div className="border-t border-ink/10 pt-2 flex justify-between font-display font-800">
                <span>Total</span>
                <span>${orden.total.toLocaleString('es-AR')}</span>
              </div>
            </div>

            <div className="text-left text-sm text-ink/60 space-y-1">
              <p>
                <strong className="text-ink">Entrega:</strong>{' '}
                {orden.entrega === 'domicilio' ? `Envío a ${orden.direccion}` : 'Retiro en sucursal'}
              </p>
              <p>
                <strong className="text-ink">Pago:</strong> {etiquetaPago[orden.pago]}
              </p>
            </div>

            <button
              onClick={onClose}
              className="w-full py-3 rounded-xl bg-ink text-white font-semibold hover:bg-ink/90 transition"
            >
              Volver a la tienda
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
