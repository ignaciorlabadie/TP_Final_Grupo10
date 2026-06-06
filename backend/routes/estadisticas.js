const express = require('express');
const router = express.Router();
const { getEstadisticas } = require('../controllers/estadisticas.controller');

router.get('/', getEstadisticas);

module.exports = router;
