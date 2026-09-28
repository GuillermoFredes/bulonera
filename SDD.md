# Software Design Document (SDD)

**Proyecto:** Sitio Web Institucional & Gestión Interna  
**Cliente:** Bulonera Amyso — Lavalle, Mendoza  
**Versión:** 1.0  
**Fecha:** Septiembre 2026  
**Equipo:** Desarrollo Web  

---

## 1. Objetivo del Proyecto

Desarrollar una Landing Page de alto impacto comercial para Bulonera Amyso, negocio familiar de venta de bulonería, herramientas y fijaciones ubicado en Lavalle, Mendoza. El sistema incluye un panel de administración interno para control de stock y precios, con arquitectura preparada para incorporar e-commerce en una segunda fase.

---

## 2. Alcance

### Fase 1 — Entregable actual
- Landing Page pública responsive (mobile-first)
- Catálogo de productos consultable (sin carrito)
- Contacto directo vía WhatsApp
- Accesos a redes sociales
- Mapa de ubicación (Google Maps / OpenStreetMap)
- Widget de reseñas Google
- Panel de administración con autenticación
- CRUD de productos (nombre, SKU, precio, stock, foto, categoría)
- Gestión de banners y promociones

### Fase 2 — Proyectada (E-commerce)
- Carrito de compras
- Pasarela de pagos (Mercado Pago)
- Módulo de pedidos y envíos
- Gestión de órdenes en panel admin

---

## 3. Arquitectura General

```
┌─────────────────────────────────────────┐
│            CLIENTE / PÚBLICO            │
└────────────────────┬────────────────────┘
                     │
     ┌───────────────┴───────────────┐
     ▼                               ▼
┌─────────────────┐         ┌─────────────────┐
│  Landing Page   │         │  Panel de Admin  │
│   (Pública)     │         │  /admin          │
├─────────────────┤         ├─────────────────┤
│ - Hero Banner   │         │ - Login          │
│ - Catálogo      │         │ - CRUD Productos │
│ - WhatsApp BTN  │         │ - Stock/Precios  │
│ - Redes & Mapa  │         │ - Banners        │
│ - Reseñas       │         │ - Subida Fotos   │
└────────┬────────┘         └────────┬────────┘
         └──────────────┬────────────┘
                        ▼
         ┌──────────────────────────────┐
         │   API REST — Node.js/Express │
         │   src/routes/*.js            │
         └──────────────┬───────────────┘
                        ▼
         ┌──────────────────────────────┐
         │   Base de Datos MySQL        │
         │   (Ready for E-commerce)     │
         └──────────────────────────────┘
```

---

## 4. Stack Tecnológico

| Capa | Tecnología | Justificación |
|------|-----------|---------------|
| Front-End | HTML5, CSS3, JavaScript ES6 | Sin dependencias de frameworks pesados, máxima compatibilidad |
| Estilos | Bootstrap 5 | Responsive mobile-first, rápido de implementar |
| Back-End | Node.js + Express | Ligero, ideal para APIs REST, fácil deploy |
| Base de Datos | MySQL / MariaDB | 100% compatible con hostings compartidos (DonWeb, Hostinger) |
| Autenticación | JWT + bcryptjs | Seguro, stateless, estándar de la industria |
| Upload de imágenes | Multer | Middleware Express para manejo de archivos |
| Despliegue | FTP / Git deploy | Compatible con hosting compartido convencional |

---

## 5. Estructura de Carpetas

```
proyecto-bulonera/
├── public/                  # Assets estáticos servidos al cliente
│   ├── css/
│   │   └── styles.css       # Estilos personalizados de la landing
│   ├── js/
│   │   └── main.js          # Lógica front-end de la landing
│   └── img/                 # Imágenes estáticas (logo, íconos)
├── admin/                   # Panel de administración
│   ├── index.html           # Login del admin
│   └── dashboard.html       # Panel principal (CRUD)
├── src/                     # Código back-end
│   ├── routes/
│   │   ├── auth.js          # Rutas de autenticación
│   │   ├── productos.js     # CRUD de productos
│   │   ├── categorias.js    # CRUD de categorías
│   │   └── promociones.js   # CRUD de banners/promociones
│   ├── middleware/
│   │   └── authMiddleware.js # Verificación de JWT
│   └── controllers/
│       ├── authController.js
│       ├── productosController.js
│       └── promocionesController.js
├── database/
│   └── schema.sql           # Esquema completo de la base de datos
├── uploads/                 # Archivos subidos por el admin
│   ├── products/            # Fotos de productos
│   └── banners/             # Imágenes de promociones
├── index.html               # Landing page pública (punto de entrada)
├── server.js                # Servidor Express principal
├── package.json
├── .env.example             # Variables de entorno requeridas
└── .gitignore
```

---

## 6. Modelo de Datos

### Diagrama de Entidades

```
usuarios (1) ──── gestiona ───→ productos (N)
                                     │
categorias (1) ──────────────────────┘ categoria_id FK

productos (N) ──── (Fase 2) ───→ detalles_pedido (N)
                                     │
pedidos (1) ──────────────────────────┘ pedido_id FK

promociones ──── independiente (banners del carrusel)
```

### Tablas

**usuarios** — Administradores del panel  
**categorias** — Categorías de productos (Bulonería, Herramientas, etc.)  
**productos** — Catálogo con stock y precios  
**promociones** — Banners/ofertas del carrusel  
**pedidos** *(Fase 2)* — Órdenes de compra  
**detalles_pedido** *(Fase 2)* — Ítems por orden  

---

## 7. API REST — Endpoints

### Autenticación
| Método | Ruta | Descripción |
|--------|------|-------------|
| POST | /api/auth/login | Login admin, retorna JWT |

### Productos
| Método | Ruta | Descripción |
|--------|------|-------------|
| GET | /api/productos | Listar productos activos (público) |
| GET | /api/productos/:id | Detalle de producto |
| GET | /api/productos/search?q= | Búsqueda por nombre/categoría |
| POST | /api/productos | Crear producto (requiere JWT) |
| PUT | /api/productos/:id | Actualizar producto (requiere JWT) |
| DELETE | /api/productos/:id | Baja lógica (requiere JWT) |

### Categorías
| Método | Ruta | Descripción |
|--------|------|-------------|
| GET | /api/categorias | Listar categorías (público) |
| POST | /api/categorias | Crear categoría (requiere JWT) |

### Promociones
| Método | Ruta | Descripción |
|--------|------|-------------|
| GET | /api/promociones | Listar banners activos (público) |
| POST | /api/promociones | Subir banner (requiere JWT) |
| DELETE | /api/promociones/:id | Eliminar banner (requiere JWT) |

---

## 8. Seguridad

- Contraseñas hasheadas con **bcryptjs** (salt rounds: 12)
- Autenticación stateless mediante **JWT** (expiración: 8h)
- Middleware de autorización en todas las rutas de escritura
- Validación de tipos de archivo en uploads (solo JPG/PNG/WebP)
- Límite de tamaño de archivo: 5MB por imagen
- Variables sensibles (credenciales BD, JWT secret) en archivo `.env` — **nunca en repositorio**

---

## 9. Supuestos para la Demo

Los siguientes datos son temporales para la presentación al propietario:

| Campo | Valor de prueba |
|-------|----------------|
| Dirección | Lavalle, Mendoza (coordenadas por confirmar) |
| WhatsApp | +54 9 261 000-0000 |
| Email | contacto@buloneraamyso.com |
| Instagram | @buloneraamyso |
| Facebook | /BulonerAmyso |
| Google Maps | Embed por coordenadas, ajustable |

---

## 10. Hitos de Entrega

| Hito | Descripción | Estado |
|------|-------------|--------|
| 1 | Landing Page + integración WhatsApp, Mapas y Redes | ✅ En desarrollo |
| 2 | Panel Admin: CRUD productos, stock, precios, fotos | ✅ En desarrollo |
| 3 | QA, optimización de rendimiento y deploy a hosting | 🔜 Pendiente |
| 4 *(Fase 2)* | Carrito + Mercado Pago + módulo de pedidos | 🔜 Fase siguiente |

---

## 11. Consideraciones de Escalabilidad

La base de datos y la API están diseñadas desde el inicio con las tablas `pedidos` y `detalles_pedido` incluidas en el schema (comentadas/inactivas en Fase 1). Para activar e-commerce en Fase 2 se requiere:

1. Descomentar y migrar tablas de pedidos
2. Agregar lógica de carrito en front-end (localStorage → API)
3. Integrar SDK de **Mercado Pago Checkout API**
4. Agregar rutas `/api/pedidos` en el back-end
5. Sección de gestión de órdenes en panel admin

El costo estimado de migración a Fase 2 es bajo gracias a esta preparación arquitectónica previa.
