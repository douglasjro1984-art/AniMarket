# Nexo — Marketplace (React + Vite + Tailwind)

Aplicación de e-commerce estilo Mercado Libre, 100% funcional en el frontend
(sin backend), con estado simulando una base de datos vía React (`useState` + `useContext`).

## Cómo correrlo

```bash
npm install
npm run dev
```

Abrí el link que te muestra Vite (por defecto http://localhost:5173).

## Estructura

```
src/
  data/products.js          -> Datos iniciales (mock) del catálogo
  context/CartContext.jsx   -> Estado global del carrito (useContext)
  components/
    Navbar.jsx               -> Barra superior (tienda / admin / carrito)
    SearchFilters.jsx         -> Buscador + filtros de categoría y precio
    ProductCard.jsx           -> Tarjeta individual de producto
    ProductGrid.jsx           -> Grilla de productos + lógica de filtrado
    CartSidebar.jsx           -> Panel lateral del carrito
    AdminForm.jsx              -> Panel de administración (alta/edición/baja)
    Checkout.jsx                -> Entrega + pago + confirmación de pedido
  App.jsx                    -> Composición general y estado raíz (products)
  main.jsx                   -> Punto de entrada, envuelve todo en CartProvider
```

## Flujo de datos (resumen)

- `App.jsx` guarda `products` (el "catálogo") con `useState` y lo pasa a
  `ProductGrid` (solo lectura) y a `AdminForm` / `Checkout` (lectura + escritura).
- El carrito vive en `CartContext` (useContext) para que `Navbar`, `ProductCard`,
  `CartSidebar` y `Checkout` puedan leerlo/modificarlo sin pasar props manualmente.
- Al confirmar un pedido en `Checkout`, se descuenta el stock comprado del
  arreglo `products` global y se vacía el carrito.
