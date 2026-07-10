import React, { useState, useEffect } from 'react'
import Navbar from './components/Navbar.jsx'
import ProductGrid from './components/ProductGrid.jsx'
import CartSidebar from './components/CartSidebar.jsx'
import AdminForm from './components/AdminForm.jsx'
import Checkout from './components/Checkout.jsx'
import { initialProducts } from './data/products.js'
import { fetchProducts, createProduct, updateProduct, deleteProduct } from './api.js'

export default function App() {
  const [products, setProducts] = useState([])
  const [cargando, setCargando] = useState(true)
  const [view, setView] = useState('tienda')
  const [cartOpen, setCartOpen] = useState(false)
  const [checkoutOpen, setCheckoutOpen] = useState(false)

  useEffect(() => {
    fetchProducts()
      .then((data) => {
        if (data.length > 0) setProducts(data)
        else {
          setProducts(initialProducts)
          initialProducts.forEach((p) => createProduct(p))
        }
      })
      .catch(() => setProducts(initialProducts))
      .finally(() => setCargando(false))
  }, [])

  const addProduct = async (product) => {
    const res = await createProduct(product)
    if (res.id) setProducts((prev) => [...prev, { ...product, id: res.id }])
  }

  const editProduct = async (id, product) => {
    await updateProduct(id, product)
    setProducts((prev) => prev.map((p) => (p.id === id ? { ...product, id } : p)))
  }

  const removeProduct = async (id) => {
    await deleteProduct(id)
    setProducts((prev) => prev.filter((p) => p.id !== id))
  }

  const setProductsLocal = (fn) => {
    setProducts((prev) => {
      const next = typeof fn === 'function' ? fn(prev) : fn
      return next
    })
  }

  if (cargando) {
    return (
      <div className="min-h-screen bg-canvas flex items-center justify-center">
        <p className="text-ink/40 font-medium">Cargando productos...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-canvas font-body text-ink">
      <Navbar view={view} onChangeView={setView} onOpenCart={() => setCartOpen(true)} />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        {view === 'tienda' ? (
          <ProductGrid products={products} />
        ) : (
          <AdminForm products={products} setProducts={setProductsLocal} onAdd={addProduct} onEdit={editProduct} onRemove={removeProduct} />
        )}
      </main>

      <CartSidebar
        open={cartOpen}
        onClose={() => setCartOpen(false)}
        onCheckout={() => { setCartOpen(false); setCheckoutOpen(true) }}
      />

      {checkoutOpen && (
        <Checkout products={products} setProducts={setProductsLocal} onClose={() => setCheckoutOpen(false)} />
      )}
    </div>
  )
}
