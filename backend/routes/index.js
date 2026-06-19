const express = require('express');
const router = express.Router();
// const authRoutes = require('./auth.routes');
const ejercicioRoutes = require('./ejercicio.routes');
const rutinaRoutes = require('./rutina.routes');
const entrenamientoRoutes = require('./entrenamiento.routes');
const estadisticasRoutes = require('./estadisticas.routes');

// Ruta de prueba
router.get('/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    message: 'API funcionando correctamente',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// Rutas de autenticación
// router.use('/auth', authRoutes);

// Rutas de ejercicios
router.use('/ejercicios', ejercicioRoutes);

// Rutas de rutinas
router.use('/rutinas', rutinaRoutes);

// Rutas de entrenamientos
router.use('/entrenamientos', entrenamientoRoutes);

// Rutas de estadísticas
router.use('/estadisticas', estadisticasRoutes);

// Ruta de ejemplo
router.get('/test', (req, res) => {
  res.json({
    message: 'Endpoint de prueba',
    data: {
      backend: 'Express',
      database: 'PostgreSQL',
      orm: 'Sequelize'
    }
  });
});

module.exports = router;
