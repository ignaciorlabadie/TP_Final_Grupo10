const express = require('express');
const router = express.Router();
const { getAllEjercicios, getEjercicioById, postNewEjercicio, updateEjercicio, deleteEjercicio, getProgresoEjercicio } = require('../controllers/ejercicio.controller');
const { validateInputEjercicios } = require('../middleware/ejercicio-validator.middleware');

router.get('/', getAllEjercicios);
router.get('/:id', getEjercicioById);
router.post('/', validateInputEjercicios, postNewEjercicio);
router.put('/:id', validateInputEjercicios, updateEjercicio);
router.delete('/:id', deleteEjercicio);
router.get('/:id/progreso', getProgresoEjercicio);

module.exports = router;
