import React, { useEffect, useState, useCallback, useRef } from 'react'
import { Pencil, Trash2, PlusCircle, X, Save, PackageCheck, Truck, QrCode, Receipt, Calculator, Settings, ImagePlus, GripVertical, Upload } from 'lucide-react'
import { categories as categoriasBase } from '../data/products.js'
import { useCart } from '../context/CartContext.jsx'

const productoVacio = {
  nombre: '',
  precio: '',
  stock: '',
  descripcion: '',
  imagenes: [''],
  categoria: categoriasBase[1] || 'Tecnología',
}

const ADMIN_HASH = '5f40b917ec740ceebe592e690af551f06865ac76726dcbcbe433ac08aa907f8c'
const SESSION_KEY = 'nexo_admin_auth'

async function hashPassword(password) {
  const encoder = new TextEncoder()
  const data = encoder.encode(password)
  const hashBuffer = await crypto.subtle.digest('SHA-256', data)
  const hashArray = Array.from(new Uint8Array(hashBuffer))
  return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('')
}

const etiquetaPago = {
  tarjeta: 'Tarjeta de Crédito/Débito',
  transferencia: 'Transferencia Bancaria',
  efectivo: 'Efectivo',
}

const etiquetaEstado = {
  pendiente: { label: 'Pendiente', class: 'bg-amber-100 text-amber-700' },
  observacion: { label: 'En observación', class: 'bg-sky-100 text-sky-700' },
  entregado: { label: 'Entregado', class: 'bg-mint-light text-mint' },
}

function TarjetaOrden({ o, acciones }) {
  return (
    <div className="bg-white rounded-2xl shadow-card p-5 space-y-3">
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="font-display font-800 text-lg text-ink">{o.numero}</span>
            <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full ${etiquetaEstado[o.estado]?.class || 'bg-gray-100 text-gray-600'}`}>
              {etiquetaEstado[o.estado]?.label || o.estado}
            </span>
          </div>
          <p className="text-ink/50 text-xs mt-0.5">{o.fecha}</p>
        </div>
        <span className="font-display font-800 text-lg text-ink whitespace-nowrap">
          ${o.total.toLocaleString('es-AR')}
        </span>
      </div>

      <div className="bg-canvas rounded-xl p-3 space-y-1.5">
        {o.items.map((item) => (
          <div key={item.id} className="flex justify-between text-sm">
            <span className="text-ink/70">{item.cantidad}x {item.nombre}</span>
            <span className="font-medium text-ink/80">${(item.precio * item.cantidad).toLocaleString('es-AR')}</span>
          </div>
        ))}
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3 text-sm text-ink/60">
        <div className="space-y-0.5">
          <p><strong className="text-ink/80">Entrega:</strong> {o.entrega === 'domicilio' ? `Envío a ${o.direccion}` : 'Retiro en sucursal'}</p>
          <p><strong className="text-ink/80">Pago:</strong> {etiquetaPago[o.pago]}</p>
        </div>
        <div className="flex gap-2">{acciones}</div>
      </div>
    </div>
  )
}

function VentasPanel() {
  const { obtenerOrdenes, actualizarEstadoOrden } = useCart()
  const [filtro, setFiltro] = useState('pendientes')
  const [ordenes, setOrdenes] = useState([])

  const cargar = useCallback(() => setOrdenes(obtenerOrdenes()), [obtenerOrdenes])

  useEffect(() => {
    cargar()
    const id = setInterval(cargar, 3000)
    return () => clearInterval(id)
  }, [cargar])

  const filtradas = ordenes.filter((o) => {
    if (filtro === 'pendientes') return o.estado === 'pendiente'
    if (filtro === 'observacion') return o.estado === 'observacion'
    if (filtro === 'entregados') return o.estado === 'entregado'
    return true
  })

  const cambiarEstado = (num, estado) => setOrdenes(actualizarEstadoOrden(num, estado))

  const contadores = {
    todas: ordenes.length,
    pendientes: ordenes.filter((o) => o.estado === 'pendiente').length,
    observacion: ordenes.filter((o) => o.estado === 'observacion').length,
    entregados: ordenes.filter((o) => o.estado === 'entregado').length,
  }

  if (ordenes.length === 0) {
    return (
      <div className="bg-white rounded-2xl shadow-card p-12 text-center">
        <PackageCheck size={48} className="mx-auto text-ink/20 mb-4" />
        <p className="text-ink/40 text-sm">No hay ventas registradas aún.</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        {[
          { id: 'todas', label: `Todas (${contadores.todas})` },
          { id: 'pendientes', label: `Pendientes (${contadores.pendientes})` },
          { id: 'observacion', label: `En observación (${contadores.observacion})` },
          { id: 'entregados', label: `Entregados (${contadores.entregados})` },
        ].map(({ id, label }) => (
          <button key={id} onClick={() => setFiltro(id)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition ${filtro === id ? 'bg-brand text-white' : 'bg-canvas text-ink/60 hover:bg-ink/10'}`}>
            {label}
          </button>
        ))}
      </div>

      <div className="space-y-3">
        {filtradas.map((o) => (
          <TarjetaOrden key={o.numero} o={o} acciones={
            o.estado === 'pendiente' ? (
              <button onClick={() => cambiarEstado(o.numero, 'observacion')}
                className="flex items-center gap-1.5 bg-mint text-white text-sm font-semibold px-4 py-2 rounded-xl hover:bg-emerald-600 transition">
                <Truck size={15} /> Despachar
              </button>
            ) : o.estado === 'observacion' ? (
              <button onClick={() => cambiarEstado(o.numero, 'entregado')}
                className="flex items-center gap-1.5 bg-brand text-white text-sm font-semibold px-4 py-2 rounded-xl hover:bg-ink transition">
                <PackageCheck size={15} /> Marcar entregado
              </button>
            ) : null
          } />
        ))}
      </div>
    </div>
  )
}

function FacturacionPanel() {
  const { obtenerOrdenes } = useCart()
  const [ordenes, setOrdenes] = useState([])
  const cargar = useCallback(() => setOrdenes(obtenerOrdenes().filter((o) => o.estado === 'entregado')), [obtenerOrdenes])
  useEffect(() => { cargar(); const id = setInterval(cargar, 3000); return () => clearInterval(id) }, [cargar])

  if (ordenes.length === 0) {
    return <div className="bg-white rounded-2xl shadow-card p-12 text-center"><Receipt size={48} className="mx-auto text-ink/20 mb-4" /><p className="text-ink/40 text-sm">No hay órdenes facturadas aún.</p></div>
  }

  const totalGeneral = ordenes.reduce((s, o) => s + o.total, 0)

  return (
    <div className="space-y-3">
      <div className="bg-mint-light/50 rounded-2xl p-4 flex items-center justify-between">
        <span className="text-sm font-semibold text-ink/70">Total facturado</span>
        <span className="font-display font-800 text-xl text-mint">${totalGeneral.toLocaleString('es-AR')}</span>
      </div>
      {ordenes.map((o) => (
        <TarjetaOrden key={o.numero} o={o} acciones={
          <span className="text-xs text-mint font-semibold bg-mint-light px-3 py-1.5 rounded-full">Facturado</span>
        } />
      ))}
    </div>
  )
}

function ContabilidadPanel() {
  const { obtenerOrdenes } = useCart()
  const [ordenes, setOrdenes] = useState([])
  const cargar = useCallback(() => setOrdenes(obtenerOrdenes().filter((o) => o.estado === 'entregado')), [obtenerOrdenes])
  useEffect(() => { cargar(); const id = setInterval(cargar, 3000); return () => clearInterval(id) }, [cargar])

  if (ordenes.length === 0) {
    return <div className="bg-white rounded-2xl shadow-card p-12 text-center"><Calculator size={48} className="mx-auto text-ink/20 mb-4" /><p className="text-ink/40 text-sm">No hay órdenes contabilizadas aún.</p></div>
  }

  const totalGeneral = ordenes.reduce((s, o) => s + o.total, 0)
  const porPago = ordenes.reduce((acc, o) => {
    acc[o.pago] = (acc[o.pago] || 0) + o.total
    return acc
  }, {})

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="bg-white rounded-2xl shadow-card p-4 text-center">
          <p className="text-xs text-ink/50 font-medium">Total ingresos</p>
          <p className="font-display font-800 text-xl text-ink">${totalGeneral.toLocaleString('es-AR')}</p>
        </div>
        <div className="bg-white rounded-2xl shadow-card p-4 text-center">
          <p className="text-xs text-ink/50 font-medium">Órdenes</p>
          <p className="font-display font-800 text-xl text-ink">{ordenes.length}</p>
        </div>
        <div className="bg-white rounded-2xl shadow-card p-4 text-center">
          <p className="text-xs text-ink/50 font-medium">Transferencia</p>
          <p className="font-display font-800 text-lg text-ink">${(porPago.transferencia || 0).toLocaleString('es-AR')}</p>
        </div>
      </div>
      <div className="text-xs text-ink/40 text-center">
        Efectivo: ${(porPago.efectivo || 0).toLocaleString('es-AR')} &nbsp;|&nbsp; Tarjeta: ${(porPago.tarjeta || 0).toLocaleString('es-AR')}
      </div>
      {ordenes.map((o) => (
        <TarjetaOrden key={o.numero} o={o} acciones={
          <span className="text-xs text-brand font-semibold bg-brand/10 px-3 py-1.5 rounded-full">Contabilizado</span>
        } />
      ))}
    </div>
  )
}

function ConfigPanel() {
  const { obtenerDatosBanco, guardarDatosBanco } = useCart()
  const [datos, setDatos] = useState({ nombre: '', telefono: '', numero: '', cbu: '', alias: '' })
  const [guardado, setGuardado] = useState(false)

  useEffect(() => setDatos(obtenerDatosBanco()), [obtenerDatosBanco])

  const handleChange = (campo, valor) => setDatos((prev) => ({ ...prev, [campo]: valor }))

  const handleSubmit = (e) => {
    e.preventDefault()
    guardarDatosBanco(datos)
    setGuardado(true)
    setTimeout(() => setGuardado(false), 2000)
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-card p-6 max-w-lg space-y-4">
      <div className="flex items-center gap-3">
        <QrCode size={20} className="text-ink/40" />
        <h3 className="font-display font-800 text-lg">Datos de transferencia bancaria</h3>
      </div>
      <p className="text-sm text-ink/50">Estos datos aparecerán en el QR que ve el cliente al pagar con transferencia.</p>

      {[
        { id: 'nombre', label: 'Nombre completo', placeholder: 'Ej: Juan Pérez' },
        { id: 'telefono', label: 'Teléfono de contacto', placeholder: 'Ej: 11 1234-5678' },
        { id: 'numero', label: 'Número de cuenta', placeholder: 'Ej: 123456789' },
        { id: 'cbu', label: 'CBU / CUIT', placeholder: 'Ej: 1234567890123456789012' },
        { id: 'alias', label: 'Alias', placeholder: 'Ej: juan.perez.mp' },
      ].map(({ id, label, placeholder }) => (
        <div key={id}>
          <label className="text-sm font-medium text-ink/70">{label}</label>
          <input required value={datos[id]} onChange={(e) => handleChange(id, e.target.value)}
            placeholder={placeholder}
            className="w-full mt-1 px-3 py-2.5 rounded-xl bg-canvas border border-transparent focus:border-accent outline-none" />
        </div>
      ))}

      <button type="submit"
        className="w-full flex items-center justify-center gap-2 bg-brand text-white font-semibold py-3 rounded-xl hover:bg-ink transition">
        <Save size={18} /> {guardado ? '¡Guardado!' : 'Guardar datos bancarios'}
      </button>
    </form>
  )
}

export default function AdminForm({ products, setProducts, onAdd, onEdit, onRemove }) {
  const [autenticado, setAutenticado] = useState(false)
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [cargando, setCargando] = useState(true)
  const [pestana, setPestana] = useState('productos')
  const [formVisible, setFormVisible] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [form, setForm] = useState(productoVacio)

  useEffect(() => {
    if (sessionStorage.getItem(SESSION_KEY) === '1') setAutenticado(true)
    setCargando(false)
  }, [])

  useEffect(() => {
    if (editingId !== null) {
      const producto = products.find((p) => p.id === editingId)
      if (producto) {
        const imgs = producto.imagenes || (producto.imagen ? [producto.imagen] : [''])
        setForm({ ...producto, imagenes: imgs })
      }
    }
  }, [editingId, products])

  const handleLogin = async (e) => {
    e.preventDefault()
    setError('')
    const hash = await hashPassword(password)
    if (hash === ADMIN_HASH) {
      sessionStorage.setItem(SESSION_KEY, '1')
      setAutenticado(true)
    } else {
      setError('Clave incorrecta')
    }
  }

  const abrirNuevo = () => { setEditingId(null); setForm(productoVacio); setFormVisible(true) }
  const abrirEdicion = (id) => { setEditingId(id); setFormVisible(true) }
  const cerrarForm = () => { setFormVisible(false); setEditingId(null); setForm(productoVacio) }
  const handleChange = (campo, valor) => setForm((prev) => ({ ...prev, [campo]: valor }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    const imgsFiltradas = form.imagenes.filter(Boolean)
    const p = { ...form, imagenes: imgsFiltradas, precio: Number(form.precio), stock: Number(form.stock) }
    delete p.imagen
    if (editingId !== null) {
      await onEdit(editingId, p)
    } else {
      await onAdd(p)
    }
    cerrarForm()
  }

  const eliminarProducto = async (id) => { await onRemove(id) }

  const tabs = [
    { id: 'productos', label: 'Productos', icon: PackageCheck },
    { id: 'ventas', label: 'Ventas y Despachos', icon: Truck },
    { id: 'facturacion', label: 'Facturación', icon: Receipt },
    { id: 'contabilidad', label: 'Contabilidad', icon: Calculator },
    { id: 'config', label: 'Configuración', icon: Settings },
  ]

  if (cargando) return null

  if (!autenticado) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <form onSubmit={handleLogin} className="bg-white rounded-2xl shadow-card p-8 w-full max-w-sm space-y-5">
          <div className="text-center">
            <div className="w-14 h-14 mx-auto rounded-xl flex items-center justify-center mb-3" style={{ background: 'linear-gradient(135deg, #D946A8, #E879C8)' }}>
              <span className="font-display font-800 text-2xl text-white">AM</span>
            </div>
            <h2 className="font-display font-800 text-xl text-ink">Acceso restringido</h2>
            <p className="text-ink/50 text-sm mt-1">Ingresá la clave de administración</p>
          </div>
          <div>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)}
              placeholder="Clave de acceso" autoFocus
              className="w-full px-4 py-3 rounded-xl bg-canvas border border-transparent focus:border-accent outline-none text-center text-lg tracking-widest" />
          </div>
          {error && <p className="text-red-500 text-sm text-center font-medium">{error}</p>}
          <button type="submit" className="w-full py-3 rounded-xl bg-brand text-white font-semibold hover:bg-ink transition">
            Ingresar
          </button>
        </form>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-display font-800 text-2xl text-ink">Panel de administración</h2>
          <p className="text-ink/50 text-sm">Gestioná tu tienda</p>
        </div>
      </div>

      <div className="flex flex-wrap gap-1 border-b border-ink/10">
        {tabs.map(({ id, label, icon: Icon }) => (
          <button key={id} onClick={() => setPestana(id)}
            className={`flex items-center gap-2 px-4 py-3 rounded-t-xl text-sm font-medium transition ${
              pestana === id
                ? 'bg-white text-ink shadow-sm border border-b-0 border-ink/10'
                : 'text-ink/40 hover:text-ink/70'
            }`}>
            <Icon size={16} /> {label}
          </button>
        ))}
      </div>

      {pestana === 'ventas' && <VentasPanel />}
      {pestana === 'facturacion' && <FacturacionPanel />}
      {pestana === 'contabilidad' && <ContabilidadPanel />}
      {pestana === 'config' && <ConfigPanel />}

      {pestana === 'productos' && (
        <>
          <div className="flex justify-end">
            <button onClick={abrirNuevo} className="flex items-center gap-2 bg-accent text-white font-semibold px-4 py-2.5 rounded-xl hover:bg-accent-dark transition">
              <PlusCircle size={18} /> Nuevo producto
            </button>
          </div>
          <div className="bg-white rounded-2xl shadow-card overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-canvas text-ink/50 text-left">
                <tr>
                  <th className="p-4 font-medium">Producto</th>
                  <th className="p-4 font-medium">Categoría</th>
                  <th className="p-4 font-medium">Precio</th>
                  <th className="p-4 font-medium">Stock</th>
                  <th className="p-4 font-medium text-right">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {products.map((p) => (
                  <tr key={p.id} className="border-t border-ink/5 hover:bg-canvas/60 transition">
                    <td className="p-4 flex items-center gap-3">
                      <img src={p.imagenes?.[0] || p.imagen} alt={p.nombre} className="w-10 h-10 rounded-lg object-cover" />
                      <span className="font-medium text-ink line-clamp-1">{p.nombre}</span>
                    </td>
                    <td className="p-4 text-ink/60">{p.categoria}</td>
                    <td className="p-4 font-display font-700">${p.precio.toLocaleString('es-AR')}</td>
                    <td className="p-4">
                      <span className={p.stock === 0 ? 'text-red-500 font-medium' : 'text-mint font-medium'}>{p.stock}</span>
                    </td>
                    <td className="p-4">
                      <div className="flex justify-end gap-2">
                        <button onClick={() => abrirEdicion(p.id)} className="p-2 rounded-lg bg-canvas hover:bg-ink/10 transition"><Pencil size={15} /></button>
                        <button onClick={() => eliminarProducto(p.id)} className="p-2 rounded-lg bg-canvas hover:bg-red-100 hover:text-red-500 transition"><Trash2 size={15} /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}

      {formVisible && (
        <div className="fixed inset-0 bg-ink/50 z-50 flex items-center justify-center p-4">
          <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-2xl w-full max-w-lg p-6 space-y-4 max-h-[90vh] overflow-y-auto thin-scrollbar">
            <div className="flex items-center justify-between">
              <h3 className="font-display font-800 text-lg">{editingId !== null ? 'Editar producto' : 'Nuevo producto'}</h3>
              <button type="button" onClick={cerrarForm} className="p-1.5 hover:bg-canvas rounded-full"><X size={18} /></button>
            </div>
            <div>
              <label className="text-sm font-medium text-ink/70">Nombre</label>
              <input required value={form.nombre} onChange={(e) => handleChange('nombre', e.target.value)}
                className="w-full mt-1 px-3 py-2.5 rounded-xl bg-canvas border border-transparent focus:border-accent outline-none" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-ink/70">Precio ($)</label>
                <input required type="number" min="0" value={form.precio} onChange={(e) => handleChange('precio', e.target.value)}
                  className="w-full mt-1 px-3 py-2.5 rounded-xl bg-canvas border border-transparent focus:border-accent outline-none" />
              </div>
              <div>
                <label className="text-sm font-medium text-ink/70">Stock</label>
                <input required type="number" min="0" value={form.stock} onChange={(e) => handleChange('stock', e.target.value)}
                  className="w-full mt-1 px-3 py-2.5 rounded-xl bg-canvas border border-transparent focus:border-accent outline-none" />
              </div>
            </div>
            <div>
              <label className="text-sm font-medium text-ink/70">Categoría</label>
              <input required list="categorias-sugeridas" value={form.categoria} onChange={(e) => handleChange('categoria', e.target.value)}
                className="w-full mt-1 px-3 py-2.5 rounded-xl bg-canvas border border-transparent focus:border-accent outline-none" />
              <datalist id="categorias-sugeridas">
                {categoriasBase.filter((c) => c !== 'Todas').map((c) => <option key={c} value={c} />)}
              </datalist>
            </div>
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-sm font-medium text-ink/70 flex items-center gap-1.5"><ImagePlus size={14} /> Imágenes del producto</label>
              </div>

              <input type="file" accept="image/*" multiple className="hidden" id="fileInput"
                onChange={(e) => {
                  const archivos = Array.from(e.target.files)
                  archivos.forEach((file) => {
                    const reader = new FileReader()
                    reader.onload = (ev) => {
                      setForm((prev) => ({ ...prev, imagenes: [...prev.imagenes, ev.target.result] }))
                    }
                    reader.readAsDataURL(file)
                  })
                  e.target.value = ''
                }} />

              <div className="flex gap-2 mb-3">
                <button type="button" onClick={() => document.getElementById('fileInput').click()}
                  className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl border-2 border-dashed border-ink/20 text-ink/50 hover:border-accent hover:text-accent transition text-sm font-medium">
                  <Upload size={16} /> Subir desde tu computadora
                </button>
                <button type="button" onClick={() => setForm((prev) => ({ ...prev, imagenes: [...prev.imagenes, ''] }))}
                  className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl border-2 border-dashed border-ink/20 text-ink/50 hover:border-accent hover:text-accent transition text-sm font-medium">
                  <ImagePlus size={16} /> Agregar por URL
                </button>
              </div>

              <div className="space-y-2">
                {form.imagenes.map((url, idx) => (
                  <div key={idx} className="flex gap-2 items-center">
                    <GripVertical size={14} className="text-ink/20 flex-shrink-0" />
                    {url.startsWith('data:') ? (
                      <div className="flex-1 flex items-center gap-2 px-2 py-1.5 rounded-xl bg-canvas">
                        <img src={url} alt="" className="w-12 h-12 rounded-lg object-cover flex-shrink-0" />
                        <span className="text-xs text-ink/50 truncate flex-1">Imagen local</span>
                      </div>
                    ) : (
                      <input
                        type="url"
                        value={url}
                        onChange={(e) => {
                          const nuevas = [...form.imagenes]
                          nuevas[idx] = e.target.value
                          setForm((prev) => ({ ...prev, imagenes: nuevas }))
                        }}
                        placeholder={`Imagen ${idx + 1} (https://...)`}
                        className="flex-1 px-3 py-2 rounded-xl bg-canvas border border-transparent focus:border-accent outline-none text-sm"
                      />
                    )}
                    <button type="button" onClick={() => {
                      const nuevas = form.imagenes.filter((_, i) => i !== idx)
                      setForm((prev) => ({ ...prev, imagenes: nuevas.length ? nuevas : [''] }))
                    }} className="p-1.5 rounded-lg bg-canvas hover:bg-red-100 hover:text-red-500 transition flex-shrink-0">
                      <X size={14} />
                    </button>
                  </div>
                ))}
              </div>

              {form.imagenes.filter(Boolean).length > 0 && (
                <div className="flex gap-1.5 mt-2 overflow-x-auto thin-scrollbar">
                  {form.imagenes.filter(Boolean).map((url, i) => (
                    <img key={i} src={url} alt={`Preview ${i}`} className="w-16 h-16 rounded-lg object-cover border-2 border-ink/10 flex-shrink-0" />
                  ))}
                </div>
              )}
            </div>
            <div>
              <label className="text-sm font-medium text-ink/70">Descripción</label>
              <textarea required rows={3} value={form.descripcion} onChange={(e) => handleChange('descripcion', e.target.value)}
                className="w-full mt-1 px-3 py-2.5 rounded-xl bg-canvas border border-transparent focus:border-accent outline-none resize-none" />
            </div>
            <button type="submit" className="w-full flex items-center justify-center gap-2 bg-ink text-white font-semibold py-3 rounded-xl hover:bg-ink/90 transition">
              <Save size={18} /> Guardar producto
            </button>
          </form>
        </div>
      )}
    </div>
  )
}
