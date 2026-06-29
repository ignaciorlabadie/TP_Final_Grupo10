const express = require('express');
const router = express.Router();
const { getAllRutinas, getRutinaById, postNewRutina, updateRutina, deleteRutina } = require('../controllers/rutina.controller');
const { validateInputRutinas } = require('../middleware/rutina_validator.middleware');
const { verificarToken } = require('../middleware/auth.middleware');

router.get('/', verificarToken, getAllRutinas);
router.get('/:id', verificarToken, getRutinaById);
router.post('/', verificarToken, validateInputRutinas, postNewRutina);
router.put('/:id', verificarToken, validateInputRutinas, updateRutina);
router.delete('/:id', verificarToken, deleteRutina);

module.exports = router;
