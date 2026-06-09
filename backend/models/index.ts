import { Sequelize } from "sequelize";
const config = require('../config/config');

const env = process.env.NODE_ENV || 'development'
const dbConfig = config[env]


const sequelize = new Sequelize (
  dbConfig.database,
  dbConfig.username,
  dbConfig.password,
  {
    host: dbConfig.host,
    port: dbConfig.port,
    dialect: dbConfig.dialect,
    logging: dbConfig.logging,
    pool: dbConfig.pool,
    dialectOptions: dbConfig.dialectOptions
  }
)

const verificarConexion = async (): Promise<void> => {
  try {
    await sequelize.authenticate()
    console.log(`Conectado con éxito a las tablas en: ${dbConfig.host}`)
  } catch (error: any) {
    console.error('Error en la base de datos: ', error.message)
  }
}

verificarConexion()

export { sequelize, Sequelize }