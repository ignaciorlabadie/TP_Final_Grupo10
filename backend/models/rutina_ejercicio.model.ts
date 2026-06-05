import { DataTypes, Sequelize } from 'sequelize';
import { RutinaEjercicioInstance, RutinaEjercicioCreationAttributes } from './interfaces/rutina_ejercicio.interface';

export default (sequelize: Sequelize) => {
  const RutinaEjercicio = sequelize.define<RutinaEjercicioInstance, RutinaEjercicioCreationAttributes>(
    'RutinaEjercicio',
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      rutina_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      ejercicio_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      orden: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
      },
      series: {
        type: DataTypes.INTEGER,
        defaultValue: 1,
        validate: {
          min: 1,
        },
      },
      repeticiones: {
        type: DataTypes.INTEGER,
        defaultValue: 1,
        validate: {
          min: 1,
        },
      },
      descanso_segundos: {
        type: DataTypes.INTEGER,
        defaultValue: 60,
        validate: {
          min: 0,
        },
      },
    },
    {
      tableName: 'rutina_ejercicios',
      timestamps: true,
    }
  );

  return RutinaEjercicio;
};
