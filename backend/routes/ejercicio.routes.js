const express = require('express');
const router = express.Router();
const { getAllEjercicios, getEjercicioById, postNewEjercicio, updateEjercicio, deleteEjercicio, getProgresoEjercicio, getEjerciciosByTipo, getCountEjercicios } = require('../controllers/ejercicio.controller');
const { validateInputEjercicios } = require('../middleware/ejercicio_validator.middleware');
const { verificarToken } = require('../middleware/auth.middleware');

router.get('/', verificarToken, getAllEjercicios);
router.get('/count', verificarToken, getCountEjercicios);
router.get('/tipo/:tipo', verificarToken, getEjerciciosByTipo);
router.get('/:id', verificarToken, getEjercicioById);
router.post('/', verificarToken, validateInputEjercicios, postNewEjercicio);
router.put('/:id', verificarToken, validateInputEjercicios, updateEjercicio);
router.delete('/:id', verificarToken, deleteEjercicio);
router.get('/:id/progreso', verificarToken, getProgresoEjercicio);

module.exports = router;
