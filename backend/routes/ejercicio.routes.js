const express = require('express');
const router = express.Router();
const { getAllEjercicios, getEjercicioById, postNewEjercicio, updateEjercicio, deleteEjercicio, getProgresoEjercicio, getEjerciciosByTipo, getCountEjercicios } = require('../controllers/ejercicio.controller');
const { validateInputEjercicios } = require('../middleware/ejercicio_validator.middleware');

router.get('/', getAllEjercicios);
router.get('/count', getCountEjercicios);
router.get('/tipo/:tipo', getEjerciciosByTipo);
router.get('/:id', getEjercicioById);
router.post('/', validateInputEjercicios, postNewEjercicio);
router.put('/:id', validateInputEjercicios, updateEjercicio);
router.delete('/:id', deleteEjercicio);
router.get('/:id/progreso', getProgresoEjercicio);

module.exports = router;
