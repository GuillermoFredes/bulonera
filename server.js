/**
 * BULONERA AMYSO — server.js
 * Punto de entrada del servidor Express.
 * Sirve la landing page estática y monta la API REST.
 */

'use strict';

require('dotenv').config();

const express  = require('express');
const path     = require('path');
const cors     = require('cors');
const helmet   = require('helmet');
const morgan   = require('morgan');

// Rutas de la API
const authRoutes       = require('./src/routes/auth');
const productosRoutes  = require('./src/routes/productos');
const categoriasRoutes = require('./src/routes/categorias');
const promocionesRoutes= require('./src/routes/promociones');

const app  = express();
const PORT = process.env.PORT || 3000;

/* ============================================================
   MIDDLEWARES GLOBALES
============================================================ */

// Seguridad HTTP headers
app.use(helmet({
  contentSecurityPolicy: false, // Desactivar para permitir CDN de Bootstrap/Fonts
  crossOriginEmbedderPolicy: false
}));

// CORS — en producción ajustar al dominio real
app.use(cors({
  origin: process.env.CORS_ORIGIN || '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Logger de requests (solo en desarrollo)
if (process.env.NODE_ENV !== 'production') {
  app.use(morgan('dev'));
}

// Parser de JSON y formularios
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

/* ============================================================
   ARCHIVOS ESTÁTICOS
============================================================ */

// Landing page y assets públicos (raíz del proyecto)
app.use(express.static(path.join(__dirname), {
  index: 'index.html'
}));

// Carpeta de uploads (fotos de productos y banners)
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

/* ============================================================
   RUTAS DE LA API
============================================================ */
app.use('/api/auth',       authRoutes);
app.use('/api/productos',  productosRoutes);
app.use('/api/categorias', categoriasRoutes);
app.use('/api/promociones',promocionesRoutes);

/* ============================================================
   FALLBACK: SPA / Landing
   Cualquier ruta no reconocida sirve index.html
============================================================ */
app.get('*', (req, res) => {
  // Las rutas /admin/* sirven el panel
  if (req.path.startsWith('/admin')) {
    const file = path.basename(req.path) || 'index.html';
    return res.sendFile(path.join(__dirname, 'admin', file));
  }
  res.sendFile(path.join(__dirname, 'index.html'));
});

/* ============================================================
   MANEJADOR DE ERRORES GLOBAL
============================================================ */
// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  console.error('[ERROR]', err.message);
  res.status(err.status || 500).json({
    ok:      false,
    message: process.env.NODE_ENV === 'production'
      ? 'Error interno del servidor.'
      : err.message
  });
});

/* ============================================================
   INICIO DEL SERVIDOR
============================================================ */
app.listen(PORT, () => {
  console.log(`\n🔩 Bulonera Amyso — Servidor corriendo`);
  console.log(`   Local:   http://localhost:${PORT}`);
  console.log(`   Admin:   http://localhost:${PORT}/admin`);
  console.log(`   API:     http://localhost:${PORT}/api`);
  console.log(`   Env:     ${process.env.NODE_ENV || 'development'}\n`);
});

module.exports = app;
