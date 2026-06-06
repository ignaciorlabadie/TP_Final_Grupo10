import { DataTypes, Sequelize } from 'sequelize';
import { EntrenamientoEjercicioInstance, EntrenamientoEjercicioCreationAttributes } from './interfaces/entrenamiento_ejercicio.interface';

export default (sequelize: Sequelize) => {
  const EntrenamientoEjercicio = sequelize.define<EntrenamientoEjercicioInstance, EntrenamientoEjercicioCreationAttributes>(
    'EntrenamientoEjercicio',
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      entrenamiento_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      ejercicio_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      series_realizadas: {
        type: DataTypes.INTEGER,
        defaultValue: 1,
        validate: {
          min: 1,
        },
      },
      repeticiones_realizadas: {
        type: DataTypes.INTEGER,
        defaultValue: 1,
        validate: {
          min: 1,
        },
      },
      peso_usado: {
        type: DataTypes.DECIMAL(8, 2),
        allowNull: true,
        validate: {
          min: 0,
        },
      },
    },
    {
      tableName: 'entrenamiento_ejercicios',
      timestamps: true,
    }
  );

  return EntrenamientoEjercicio;
};
