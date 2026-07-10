import React, { createContext, useContext, useState, useCallback, useEffect } from 'react'
import { fetchOrders, createOrder, updateOrderStatus, fetchBankData, saveBankData } from '../api.js'

const CartContext = createContext(null)

export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState([])
  const [ordenes, setOrdenes] = useState([])
  const [datosBanco, setDatosBanco] = useState({ nombre: '', telefono: '', numero: '', cbu: '', alias: '' })

  useEffect(() => {
    fetchOrders().then(setOrdenes).catch(() => {})
    fetchBankData().then(setDatosBanco).catch(() => {})
  }, [])

  const addToCart = (product) => {
    setCartItems((prev) => {
      const existing = prev.find((item) => item.id === product.id)
      if (existing) {
        if (existing.cantidad >= product.stock) return prev
        return prev.map((item) =>
          item.id === product.id ? { ...item, cantidad: item.cantidad + 1 } : item,
        )
      }
      return [...prev, { ...product, cantidad: 1 }]
    })
  }

  const updateQuantity = (id, delta, stockDisponible) => {
    setCartItems((prev) =>
      prev
        .map((item) => {
          if (item.id !== id) return item
          const nuevaCantidad = Math.min(Math.max(item.cantidad + delta, 0), stockDisponible)
          return { ...item, cantidad: nuevaCantidad }
        })
        .filter((item) => item.cantidad > 0),
    )
  }

  const removeFromCart = (id) => {
    setCartItems((prev) => prev.filter((item) => item.id !== id))
  }

  const clearCart = () => setCartItems([])

  const total = cartItems.reduce((acc, item) => acc + item.precio * item.cantidad, 0)
  const totalItems = cartItems.reduce((acc, item) => acc + item.cantidad, 0)

  const agregarOrden = useCallback(async (orden) => {
    await createOrder(orden)
    setOrdenes((prev) => [orden, ...prev])
  }, [])

  const obtenerOrdenes = useCallback(() => ordenes, [ordenes])

  const actualizarEstadoOrden = useCallback(async (numero, estado) => {
    await updateOrderStatus(numero, estado)
    setOrdenes((prev) => prev.map((o) => (o.numero === numero ? { ...o, estado } : o)))
  }, [])

  const obtenerDatosBanco = useCallback(() => datosBanco, [datosBanco])

  const guardarDatosBanco = useCallback(async (datos) => {
    await saveBankData(datos)
    setDatosBanco(datos)
  }, [])

  return (
    <CartContext.Provider
      value={{
        cartItems, addToCart, updateQuantity, removeFromCart, clearCart, total, totalItems,
        agregarOrden, obtenerOrdenes, actualizarEstadoOrden,
        obtenerDatosBanco, guardarDatosBanco,
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const context = useContext(CartContext)
  if (!context) throw new Error('useCart debe usarse dentro de un CartProvider')
  return context
}
