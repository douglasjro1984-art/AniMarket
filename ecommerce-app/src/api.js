const API = window.location.port === '5173' || window.location.port === '3001'
  ? 'http://localhost:3001/api'
  : `${window.location.origin}/api`

// PRODUCTOS
export async function fetchProducts() {
  const res = await fetch(`${API}/products`)
  return res.json()
}

export async function createProduct(product) {
  const res = await fetch(`${API}/products`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(product),
  })
  return res.json()
}

export async function updateProduct(id, product) {
  const res = await fetch(`${API}/products/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(product),
  })
  return res.json()
}

export async function deleteProduct(id) {
  const res = await fetch(`${API}/products/${id}`, { method: 'DELETE' })
  return res.json()
}

export async function updateStockBulk(updates) {
  await Promise.all(
    updates.map(({ id, stock }) =>
      fetch(`${API}/products/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ stock }),
      })
    )
  )
}

// ORDENES
export async function fetchOrders() {
  const res = await fetch(`${API}/orders`)
  return res.json()
}

export async function createOrder(order) {
  const res = await fetch(`${API}/orders`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(order),
  })
  return res.json()
}

export async function updateOrderStatus(numero, estado) {
  const res = await fetch(`${API}/orders/${numero}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ estado }),
  })
  return res.json()
}

// DATOS BANCARIOS
export async function fetchBankData() {
  const res = await fetch(`${API}/bank-data`)
  return res.json()
}

export async function saveBankData(data) {
  const res = await fetch(`${API}/bank-data`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })
  return res.json()
}
