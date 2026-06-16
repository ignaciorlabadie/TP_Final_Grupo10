const express = require('express')
const cors = require('cors')
require('dotenv').config()
const errorHandler = require('../middleware/error-handler.middleware')
const { sequelize } = require('../models')
const { establecerCardinalidad } = require('../models/cardinalidades.model')

class Server {
  constructor() {
    this.app = express()
    this.port = process.env.PORT || 3000
    this.connectToDataBase()
    this.middleware()
    this.rutas()
    this.errorHandlerGlobal()
  }

  middleware() {
    this.app.use(cors())
    this.app.use(express.json())
  }

  rutas() {
    this.app.get('/', (req, res) => {
      res.json({ message: 'API del TP Final del Grupo 10' })
    })
    this.app.use('/api', require('../routes/index.js'))
  }

  async connectToDataBase() {
    try {
      establecerCardinalidad()
      console.log(
        'Cardinalidad y relaciones entre tablas establecidas correctamente'
      )

      console.log('ejecutar: npx sequelize-cli db:migrate && npx sequelize-cli db:seed:all')
    } catch (error) {
      console.error('Error en la conexión a la DB: ', error.message)
    }
  }

  errorHandlerGlobal() {
    this.app.use(errorHandler)
  }

  listen() {
    this.app.listen(this.port, () => {
      console.log(`La API esta escuchando el el puerto: ${this.port}`)
    })
  }
}

module.exports = Server