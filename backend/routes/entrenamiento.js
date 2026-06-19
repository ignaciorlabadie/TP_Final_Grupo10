const express = require('express');
const router = express.Router();
const { getAllEntrenamientos, getEntrenamientoById, postNewEntrenamiento, deleteEntrenamiento } = require('../controllers/entrenamiento.controller');
const { validateInputEntrenamiento } = require('../middleware/entrenamiento-validator.middleware');

router.get('/', getAllEntrenamientos);
router.get('/:id', getEntrenamientoById);
router.post('/', validateInputEntrenamiento, postNewEntrenamiento);
router.delete('/:id', deleteEntrenamiento);

module.exports = router;
