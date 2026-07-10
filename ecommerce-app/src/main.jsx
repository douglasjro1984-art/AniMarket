import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import { CartProvider } from './context/CartContext.jsx'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    {/* CartProvider envuelve toda la app para que cualquier componente
        pueda leer/modificar el carrito sin pasar props manualmente (useContext) */}
    <CartProvider>
      <App />
    </CartProvider>
  </React.StrictMode>,
)
