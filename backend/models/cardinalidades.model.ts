import { sequelize } from '.';
import { EjercicioModel } from './ejercicio.model'
import { RutinaModel } from './rutina.model'
import { RutinaEjercicioModel } from './rutina_ejercicio.model'
import { EntrenamientoModel } from './entrenamiento.model'
import { EntrenamientoEjercicioModel } from './entrenamiento_ejercicio.model'

export const establecerCardinalidad = (): void => {
  RutinaModel.belongsToMany(EjercicioModel, {
    through: RutinaEjercicioModel,
    foreignKey: 'rutina_id',
    otherKey: 'ejercicio_id',
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
    through: EntrenamientoEjercicioModel,
    foreignKey: 'entrenamiento_id',
    otherKey: 'ejercicio_id',
  });

  EjercicioModel.belongsToMany(EntrenamientoModel, {
    through: EntrenamientoEjercicioModel,
    foreignKey: 'ejercicio_id',
    otherKey: 'entrenamiento_id',
  });
}