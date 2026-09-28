# Bulonera Amyso — Sitio Web

Sitio web institucional con panel de gestión interna para **Bulonera Amyso**, Lavalle, Mendoza.

## Stack

- **Front-end:** HTML5, Bootstrap 5, JavaScript ES6
- **Back-end:** Node.js + Express
- **Base de datos:** MySQL / MariaDB
- **Autenticación:** JWT + bcryptjs
- **Upload:** Multer

---

## Instalación rápida

### 1. Prerequisitos
- Node.js 18+
- MySQL 5.7+ o MariaDB 10.3+

### 2. Clonar e instalar dependencias

```bash
npm install
```

### 3. Configurar variables de entorno

```bash
cp .env.example .env
# Editar .env con las credenciales reales de la BD y el JWT_SECRET
```

### 4. Crear la base de datos

```bash
mysql -u root -p < database/schema.sql
```

O desde el cliente MySQL:
```sql
SOURCE database/schema.sql;
```

### 5. Iniciar el servidor

```bash
# Desarrollo (con auto-reload)
npm run dev

# Producción
npm start
```

El servidor queda disponible en `http://localhost:3000`.

---

## Acceso al panel de administración

URL: `http://localhost:3000/admin`

Credenciales iniciales de demo:
- **Usuario:** `admin`
- **Contraseña:** `admin123`

> ⚠️ Cambiar la contraseña después del primer ingreso.

---

## Estructura del proyecto

```
├── index.html          # Landing page pública
├── server.js           # Servidor Express
├── package.json
├── .env.example        # Variables de entorno requeridas
├── public/
│   ├── css/styles.css
│   └── js/main.js
├── admin/
│   ├── index.html      # Login del panel
│   ├── dashboard.html  # Panel de control
│   ├── admin.css
│   └── dashboard.js
├── src/
│   ├── db.js           # Pool de conexión MySQL
│   ├── routes/         # Rutas de la API
│   └── middleware/     # Autenticación JWT
├── database/
│   └── schema.sql      # Esquema completo de la BD
└── uploads/            # Imágenes subidas por el admin
```

---

## API Endpoints

| Método | Ruta | Auth | Descripción |
|--------|------|------|-------------|
| POST | /api/auth/login | — | Login, retorna JWT |
| GET | /api/productos | — | Listar productos activos |
| GET | /api/productos/:id | — | Detalle de producto |
| POST | /api/productos | JWT | Crear producto |
| PUT | /api/productos/:id | JWT | Actualizar producto |
| DELETE | /api/productos/:id | JWT | Baja lógica |
| GET | /api/categorias | — | Listar categorías |
| POST | /api/categorias | JWT | Crear categoría |
| PUT | /api/categorias/:id | JWT | Actualizar categoría |
| GET | /api/promociones | — | Listar banners activos |
| POST | /api/promociones | JWT | Subir banner |
| PUT | /api/promociones/:id | JWT | Actualizar banner |
| DELETE | /api/promociones/:id | JWT | Eliminar banner |

---

## Deploy en hosting compartido (cPanel / DonWeb / Hostinger)

1. Subir todos los archivos por FTP (excepto `node_modules/` y `.env`).
2. Crear la BD MySQL desde el panel de control del hosting.
3. Importar `database/schema.sql`.
4. Crear el `.env` con las credenciales reales en el servidor.
5. Instalar dependencias: `npm install --production`
6. Iniciar con PM2: `pm2 start server.js --name bulonera-amyso`

---

## Fase 2 — E-commerce (pendiente)

El schema SQL ya incluye las tablas `pedidos` y `detalles_pedido` comentadas.
Para activar e-commerce: ver sección "FASE 2" en `database/schema.sql` y `SDD.md`.
