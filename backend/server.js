const express = require('express')
const cors = require('cors')
const path = require('path')
const pool = require('./db')

const app = express()
app.use(cors())
app.use(express.json({ limit: '10mb' }))

// ============================================
// PRODUCTOS
// ============================================

app.get('/api/products', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM products ORDER BY id ASC')
    const products = rows.map((r) => ({
      id: r.id,
      nombre: r.nombre,
      descripcion: r.descripcion,
      precio: Number(r.precio),
      stock: r.stock,
      categoria: r.categoria,
      imagenes: typeof r.imagenes === 'string' ? JSON.parse(r.imagenes) : r.imagenes || [],
    }))
    res.json(products)
  } catch (err) {
    console.error('GET /api/products:', err.message)
    res.status(500).json({ error: err.message })
  }
})

app.post('/api/products', async (req, res) => {
  try {
    const { nombre, descripcion, precio, stock, categoria, imagenes } = req.body
    const [result] = await pool.query(
      'INSERT INTO products (nombre, descripcion, precio, stock, categoria, imagenes) VALUES (?, ?, ?, ?, ?, ?)',
      [nombre, descripcion, precio || 0, stock || 0, categoria || '', JSON.stringify(imagenes || [])]
    )
    res.json({ id: result.insertId, ...req.body })
  } catch (err) {
    console.error('POST /api/products:', err.message)
    res.status(500).json({ error: err.message })
  }
})

app.put('/api/products/:id', async (req, res) => {
  try {
    const { id } = req.params
    const { nombre, descripcion, precio, stock, categoria, imagenes } = req.body
    await pool.query(
      'UPDATE products SET nombre=?, descripcion=?, precio=?, stock=?, categoria=?, imagenes=? WHERE id=?',
      [nombre, descripcion, precio || 0, stock || 0, categoria || '', JSON.stringify(imagenes || []), id]
    )
    res.json({ id: Number(id), ...req.body })
  } catch (err) {
    console.error('PUT /api/products:', err.message)
    res.status(500).json({ error: err.message })
  }
})

app.delete('/api/products/:id', async (req, res) => {
  try {
    await pool.query('DELETE FROM products WHERE id=?', [req.params.id])
    res.json({ ok: true })
  } catch (err) {
    console.error('DELETE /api/products:', err.message)
    res.status(500).json({ error: err.message })
  }
})

// ============================================
// ORDENES
// ============================================

app.get('/api/orders', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM orders ORDER BY created_at DESC')
    const orders = rows.map((r) => ({
      numero: r.numero,
      items: typeof r.items === 'string' ? JSON.parse(r.items) : r.items || [],
      total: Number(r.total),
      entrega: r.entrega,
      direccion: r.direccion,
      pago: r.pago,
      estado: r.estado,
      fecha: r.fecha,
    }))
    res.json(orders)
  } catch (err) {
    console.error('GET /api/orders:', err.message)
    res.status(500).json({ error: err.message })
  }
})

app.post('/api/orders', async (req, res) => {
  try {
    const { numero, items, total, entrega, direccion, pago, estado, fecha } = req.body
    await pool.query(
      'INSERT INTO orders (numero, items, total, entrega, direccion, pago, estado, fecha) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
      [numero, JSON.stringify(items), total, entrega, direccion || '', pago, estado || 'pendiente', fecha || '']
    )
    res.json({ ok: true, numero })
  } catch (err) {
    console.error('POST /api/orders:', err.message)
    res.status(500).json({ error: err.message })
  }
})

app.put('/api/orders/:numero', async (req, res) => {
  try {
    const { estado } = req.body
    await pool.query('UPDATE orders SET estado=? WHERE numero=?', [estado, req.params.numero])
    res.json({ ok: true })
  } catch (err) {
    console.error('PUT /api/orders:', err.message)
    res.status(500).json({ error: err.message })
  }
})

// ============================================
// DATOS BANCARIOS
// ============================================

app.get('/api/bank-data', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM bank_data WHERE id=1')
    const r = rows[0] || { nombre: '', telefono: '', numero: '', cbu: '', alias: '' }
    res.json({ nombre: r.nombre, telefono: r.telefono, numero: r.numero, cbu: r.cbu, alias: r.alias })
  } catch (err) {
    console.error('GET /api/bank-data:', err.message)
    res.status(500).json({ error: err.message })
  }
})

app.put('/api/bank-data', async (req, res) => {
  try {
    const { nombre, telefono, numero, cbu, alias } = req.body
    await pool.query(
      'UPDATE bank_data SET nombre=?, telefono=?, numero=?, cbu=?, alias=? WHERE id=1',
      [nombre || '', telefono || '', numero || '', cbu || '', alias || '']
    )
    res.json({ ok: true })
  } catch (err) {
    console.error('PUT /api/bank-data:', err.message)
    res.status(500).json({ error: err.message })
  }
})

// ============================================
// SERVIR FRONTEND EN PRODUCCIÓN
// ============================================

const frontendPath = path.join(__dirname, '..', 'ecommerce-app', 'dist')
app.use(express.static(frontendPath))
app.get('*', (req, res) => {
  res.sendFile(path.join(frontendPath, 'index.html'))
})

// ============================================
// START
// ============================================

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`AniMarket API corriendo en http://localhost:${PORT}`)
})
