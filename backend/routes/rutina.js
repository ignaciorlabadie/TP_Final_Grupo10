const express = require('express');
const router = express.Router();
const { getAllRutinas, getRutinaById, postNewRutina, updateRutina, deleteRutina } = require('../controllers/rutina.controller');
const { validateInputRutinas } = require('../middleware/rutina-validator.middleware');

router.get('/', getAllRutinas);
router.get('/:id', getRutinaById);
router.post('/', validateInputRutinas, postNewRutina);
router.put('/:id', validateInputRutinas, updateRutina);
router.delete('/:id', deleteRutina);

module.exports = router;
