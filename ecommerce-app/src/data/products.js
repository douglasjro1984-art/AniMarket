// Datos iniciales que simulan una base de datos de productos.
// Cada producto tiene: id, nombre, descripcion, precio, imagen, stock, categoria.
export const initialProducts = [
  {
    id: 1,
    nombre: 'Auriculares Inalámbricos Pro',
    descripcion: 'Cancelación de ruido activa, 30 horas de batería y sonido Hi-Fi.',
    precio: 89999,
    imagenes: [
      'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&q=80',
      'https://images.unsplash.com/photo-1583394838336-acd977736f90?w=600&q=80',
    ],
    stock: 14,
    categoria: 'Tecnología',
  },
  {
    id: 2,
    nombre: 'Smartwatch Serie X',
    descripcion: 'Monitoreo de salud 24/7, GPS integrado y resistencia al agua 5ATM.',
    precio: 149999,
    imagenes: [
      'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&q=80',
      'https://images.unsplash.com/photo-1546868871-af0de0ae72be?w=600&q=80',
    ],
    stock: 8,
    categoria: 'Tecnología',
  },
  {
    id: 3,
    nombre: 'Zapatillas Urban Runner',
    descripcion: 'Amortiguación responsiva ideal para running y uso diario.',
    precio: 64999,
    imagenes: [
      'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&q=80',
      'https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=600&q=80',
    ],
    stock: 0,
    categoria: 'Moda',
  },
  {
    id: 4,
    nombre: 'Cámara Mirrorless 4K',
    descripcion: 'Sensor de 24MP, grabación 4K60 y estabilización de imagen.',
    precio: 459999,
    imagenes: [
      'https://images.unsplash.com/photo-1512499617640-c74ae3a79d37?w=600&q=80',
      'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=600&q=80',
    ],
    stock: 5,
    categoria: 'Tecnología',
  },
  {
    id: 5,
    nombre: 'Set de Perfumería Bloom',
    descripcion: 'Fragancia floral de larga duración, edición limitada.',
    precio: 34999,
    imagenes: [
      'https://images.unsplash.com/photo-1585386959984-a4155224a1ad?w=600&q=80',
      'https://images.unsplash.com/photo-1541643600914-78b084683601?w=600&q=80',
    ],
    stock: 22,
    categoria: 'Belleza',
  },
  {
    id: 6,
    nombre: 'Batidora de Cocina Multifunción',
    descripcion: '6 velocidades, jarra de acero inoxidable y accesorios incluidos.',
    precio: 78999,
    imagenes: [
      'https://images.unsplash.com/photo-1583394838336-acd977736f90?w=600&q=80',
      'https://images.unsplash.com/photo-1594631252845-29fc4cc8cde9?w=600&q=80',
    ],
    stock: 3,
    categoria: 'Hogar',
  },
  {
    id: 7,
    nombre: 'Sillón Escandinavo',
    descripcion: 'Madera maciza y tapizado premium para tu living.',
    precio: 219999,
    imagenes: [
      'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=600&q=80',
      'https://images.unsplash.com/photo-1555041469-a586c1bad5db?w=600&q=80',
    ],
    stock: 0,
    categoria: 'Hogar',
  },
  {
    id: 8,
    nombre: 'Colección de Libros Clásicos',
    descripcion: 'Pack de 5 títulos imprescindibles de la literatura universal.',
    precio: 27999,
    imagenes: [
      'https://images.unsplash.com/photo-1550009158-9ebf69173e03?w=600&q=80',
      'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=600&q=80',
    ],
    stock: 40,
    categoria: 'Librería',
  },
  {
    id: 9,
    nombre: 'Teclado y Mouse Gamer RGB',
    descripcion: 'Switches mecánicos, iluminación RGB personalizable.',
    precio: 55999,
    imagenes: [
      'https://images.unsplash.com/photo-1600185365483-26d7a4cc7519?w=600&q=80',
      'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=600&q=80',
    ],
    stock: 17,
    categoria: 'Tecnología',
  },
  {
    id: 10,
    nombre: 'Zapatillas Retro Court',
    descripcion: 'Diseño clásico en cuero con suela de goma antideslizante.',
    precio: 71999,
    imagenes: [
      'https://images.unsplash.com/photo-1560343090-f0409e92791a?w=600&q=80',
      'https://images.unsplash.com/photo-1491553895911-0055eca6402d?w=600&q=80',
    ],
    stock: 11,
    categoria: 'Moda',
  },
  {
    id: 11,
    nombre: 'Mochila Urbana Antirrobo',
    descripcion: 'Compartimento acolchado para notebook y puerto USB externo.',
    precio: 42999,
    imagenes: [
      'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600&q=80',
      'https://images.unsplash.com/photo-1622560480654-996b80f18a5d?w=600&q=80',
    ],
    stock: 9,
    categoria: 'Moda',
  },
  {
    id: 12,
    nombre: 'Set de Pesas Ajustables',
    descripcion: 'De 2 a 20kg por mancuerna, ideal para entrenar en casa.',
    precio: 98999,
    imagenes: [
      'https://images.unsplash.com/photo-1517344884509-a0c97ec11bcc?w=600&q=80',
      'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=600&q=80',
    ],
    stock: 6,
    categoria: 'Deportes',
  },
]

export const categories = [
  'Todas',
  ...Array.from(new Set(initialProducts.map((p) => p.categoria))),
]
