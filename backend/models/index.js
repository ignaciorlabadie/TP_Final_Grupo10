// backend/models/index.js
const { Sequelize } = require('sequelize');
const config = require('../config/database');

const env = process.env.NODE_ENV || 'development';
const dbConfig = config[env];

const sequelize = new Sequelize(
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
);

const UserModel = require('./User');
const User = UserModel(sequelize);

const EjercicioModel = require('./ejercicio.model');
const Ejercicio = EjercicioModel(sequelize);

const RutinaModel = require('./rutina.model');
const Rutina = RutinaModel(sequelize);

const RutinaEjercicioModel = require('./rutina_ejercicio.model');
const RutinaEjercicio = RutinaEjercicioModel(sequelize);

const EntrenamientoModel = require('./entrenamiento.model');
const Entrenamiento = EntrenamientoModel(sequelize);

const EntrenamientoEjercicioModel = require('./entrenamiento_ejercicio.model');
const EntrenamientoEjercicio = EntrenamientoEjercicioModel(sequelize);

// Asociaciones
Rutina.belongsToMany(Ejercicio, {
  through: RutinaEjercicio,
  foreignKey: 'rutina_id',
  otherKey: 'ejercicio_id',
});

Ejercicio.belongsToMany(Rutina, {
  through: RutinaEjercicio,
  foreignKey: 'ejercicio_id',
  otherKey: 'rutina_id',
});

Rutina.hasMany(RutinaEjercicio, { foreignKey: 'rutina_id' });
RutinaEjercicio.belongsTo(Rutina, { foreignKey: 'rutina_id' });

RutinaEjercicio.belongsTo(Ejercicio, { foreignKey: 'ejercicio_id' });

// Asociaciones de Entrenamiento
Entrenamiento.belongsTo(Rutina, { foreignKey: 'rutina_id' });
Rutina.hasMany(Entrenamiento, { foreignKey: 'rutina_id' });

Entrenamiento.hasMany(EntrenamientoEjercicio, { foreignKey: 'entrenamiento_id' });
EntrenamientoEjercicio.belongsTo(Entrenamiento, { foreignKey: 'entrenamiento_id' });

EntrenamientoEjercicio.belongsTo(Ejercicio, { foreignKey: 'ejercicio_id' });
Ejercicio.hasMany(EntrenamientoEjercicio, { foreignKey: 'ejercicio_id' });

module.exports = {
  sequelize,
  Sequelize,
  User,
  Ejercicio,
  Rutina,
  RutinaEjercicio,
  Entrenamiento,
  EntrenamientoEjercicio,
};