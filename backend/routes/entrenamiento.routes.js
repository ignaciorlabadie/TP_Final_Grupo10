const express = require('express');
const router = express.Router();
const { getAllEntrenamientos, getEntrenamientoById, postNewEntrenamiento, deleteEntrenamiento } = require('../controllers/entrenamiento.controller');
const { validateInputEntrenamiento } = require('../middleware/entrenamiento_validator.middleware');
const { verificarToken } = require('../middleware/auth.middleware');

router.get('/', verificarToken, getAllEntrenamientos);
router.get('/:id', verificarToken, getEntrenamientoById);
router.post('/', verificarToken, validateInputEntrenamiento, postNewEntrenamiento);
router.delete('/:id', verificarToken, deleteEntrenamiento);

module.exports = router;
