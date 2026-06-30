const express = require('express');
const router = express.Router();
const { postRegister, postLogin, getPerfil, getAllUsers } = require('../controllers/auth.controller');
const { verificarToken } = require('../middleware/auth.middleware');

// POST /api/auth/register - Registro de usuario (pública)
router.post('/register', postRegister);

// POST /api/auth/login - Inicio de sesión (pública)
router.post('/login', postLogin);

// GET /api/auth/perfil - Obtener perfil (protegida)
router.get('/perfil', verificarToken, getPerfil);

// GET /api/auth/usuarios - Listar todos los usuarios
router.get('/usuarios', getAllUsers);

module.exports = router;
