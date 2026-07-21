const express = require('express');
const router = express.Router();
const { getEstadisticas } = require('../controllers/estadisticas.controller');
const { verificarToken } = require('../middleware/auth.middleware');

router.get('/', verificarToken, getEstadisticas);

module.exports = router;
