# AniMarket

Plataforma de comercio electrónico (app de ventas) con backend en Node.js y un frontend separado, preparada para publicarse en Render junto con su base de datos.

## Estructura

```
├── backend/          # Servidor Node.js (server.js) y conexión a la base de datos
├── ecommerce-app/    # Aplicación frontend de la tienda
├── package.json      # Scripts para compilar e iniciar todo el proyecto
└── render.yaml       # Configuración de despliegue en Render
```

## Tecnologías

- Node.js (backend)
- Aplicación frontend en `ecommerce-app`, que se compila con `npm run build`
- Base de datos relacional configurada por variables de entorno
- Render (servicio web y base de datos)

## Cómo ejecutarlo en tu computadora

1. Cloná el repositorio:

   ```bash
   git clone https://github.com/douglasjro1984-art/AniMarket.git
   cd AniMarket
   ```

2. Instalá las dependencias del backend y compilá el frontend:

   ```bash
   cd backend && npm install && cd ..
   npm run build
   ```

3. Configurá la conexión a la base de datos con estas variables de entorno:

   | Variable | Descripción |
   |---|---|
   | `DB_HOST` | Servidor de la base de datos |
   | `DB_PORT` | Puerto |
   | `DB_USER` | Usuario |
   | `DB_PASSWORD` | Contraseña |
   | `DB_NAME` | Nombre de la base de datos |
   | `DB_SSL` | `true` si la conexión requiere SSL (como en Render) |

4. Iniciá el servidor:

   ```bash
   npm start
   ```

## Scripts

| Comando | Qué hace |
|---|---|
| `npm run build` | Instala y compila el frontend (`ecommerce-app`) |
| `npm start` | Inicia el servidor (`backend`) |
| `npm run dev` | Inicia el servidor en modo desarrollo |

## Despliegue en Render

El archivo `render.yaml` define un servicio web (`amarket`) que instala el backend, compila el frontend y ejecuta `node server.js`, más una base de datos (`amarket-db`) conectada por variables de entorno. Para publicarlo, creá un Blueprint en Render apuntando a este repositorio.

## Autor

**Douglas Romero**, desarrollador backend junior.
[GitHub](https://github.com/douglasjro1984-art) · [LinkedIn](https://www.linkedin.com/in/douglas-romero-574576384)
