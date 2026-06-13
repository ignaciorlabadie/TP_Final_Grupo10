import { sequelize } from '.';
import { EjercicioModel } from './ejercicio.model'
import { RutinaModel } from './rutina.model'
import { RutinaEjercicioModel } from './rutina_ejercicio.model'
import { EntrenamientoModel } from './entrenamiento.model'
import { EntrenamientoEjercicioModel } from './entrenamiento_ejercicio.model'

// const UserModel = require('./User');
// const User = UserModel(sequelize);

export const establecerCardinalidad = (): void => {
  RutinaModel.belongsToMany(EjercicioModel, {
    through: {
      model: RutinaEjercicioModel,
      as: 'detalle',
    },
    foreignKey: 'rutina_id',
    otherKey: 'ejercicio_id',
    as: 'ejercicios',
  });
  
  EjercicioModel.belongsToMany(RutinaModel, {
    through: RutinaEjercicioModel,
    foreignKey: 'ejercicio_id',
    otherKey: 'rutina_id',
  });
  
  RutinaModel.hasMany(RutinaEjercicioModel, { foreignKey: 'rutina_id' });
  RutinaEjercicioModel.belongsTo(RutinaModel, { foreignKey: 'rutina_id' });
  
  RutinaEjercicioModel.belongsTo(EjercicioModel, { foreignKey: 'ejercicio_id' });
  
  EntrenamientoModel.belongsTo(RutinaModel, { foreignKey: 'rutina_id' });
  RutinaModel.hasMany(EntrenamientoModel, { foreignKey: 'rutina_id' });
  
  EntrenamientoModel.hasMany(EntrenamientoEjercicioModel, { foreignKey: 'entrenamiento_id' });
  EntrenamientoEjercicioModel.belongsTo(EntrenamientoModel, { foreignKey: 'entrenamiento_id' });
  
  EntrenamientoEjercicioModel.belongsTo(EjercicioModel, { foreignKey: 'ejercicio_id' });
  EjercicioModel.hasMany(EntrenamientoEjercicioModel, { foreignKey: 'ejercicio_id' });

  EntrenamientoModel.belongsToMany(EjercicioModel, {
    through: {
      model: EntrenamientoEjercicioModel,
      as: 'detalle',
    },
    foreignKey: 'entrenamiento_id',
    otherKey: 'ejercicio_id',
    as: 'ejercicios',
  });

  EjercicioModel.belongsToMany(EntrenamientoModel, {
    through: EntrenamientoEjercicioModel,
    foreignKey: 'ejercicio_id',
    otherKey: 'entrenamiento_id',
  });
}