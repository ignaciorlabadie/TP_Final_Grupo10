const { generarToken } = require('../middleware/auth.middleware.js')
const { UserModel } = require('../models/user.model')

const postRegister = async (req, res, next) => {
  try {
    console.log('Datos del Body:', req.body)
    const { nombre, email, password } = req.body

    // Verificar que no exista un usuario con ese email
    const existente = await UserModel.findByEmail(email)
    if (existente) {
      return res.status(400).json({ error: 'El email ya está registrado' })
    }

    // TODO: Crear el usuario en la base de datos usando User.create()
    // Pista: pasar { nombre, email, password }
    const user = await UserModel.createUser({ nombre, email, password })

    // TODO: Generar un token para el usuario recién creado usando generarToken()
    const token = generarToken(user)

    res.status(201).json({
      message: 'Usuario registrado exitosamente',
      user,
      token
    })
  } catch (error) {
    console.error('Error en register:', error)
    next(error)
  }
}

const postLogin = async (req, res, next) => {
  try {
    const { email, password } = req.body

    // TODO: Buscar el usuario por email usando User.findOne()
    const user = await UserModel.findByEmail(email)

    if (!user) {
      return res.status(401).json({ error: 'Credenciales inválidas' })
    }

    // TODO: Validar la contraseña usando el método user.validarPassword()
    const passwordValida = await user.validatePassword(password)

    if (!passwordValida) {
      return res.status(401).json({ error: 'Credenciales inválidas' })
    }

    const token = generarToken(user)

    res.json({
      message: 'Login exitoso',
      user,
      token
    })
  } catch (error) {
    console.error('Error en login:', error)
    next(error)
  }
}

const getPerfil = async (req, res, next) => {
  try {
    // TODO: Obtener el usuario desde la base de datos usando el id de req.user
    // Pista: req.user fue seteado por el middleware verificarToken
    const user = await UserModel.findById(req.user.id)

    if (!user) {
      return res.status(404).json({ error: 'Usuario no encontrado' })
    }

    res.json({ user })
  } catch (error) {
    console.error('Error en perfil:', error)
    next(error)
  }
}

const getAllUsers = async (req, res, next) => {
  try {
    const users = await UserModel.findAllUsers()
    return res.status(200).json(users)
  } catch (error) {
    console.log(error)
    next(error)
  }
}

module.exports = { postRegister, postLogin, getPerfil, getAllUsers }