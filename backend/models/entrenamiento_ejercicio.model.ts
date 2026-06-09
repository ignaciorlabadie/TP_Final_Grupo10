import { DataTypes, Model, Sequelize } from 'sequelize';
import { InterfaceEntrenamientoEjercicio, EntrenamientoEjercicioCreationAttributes } from './interfaces/entrenamiento_ejercicio.interface';

class EntrenamientoEjercicio
  extends Model<InterfaceEntrenamientoEjercicio, EntrenamientoEjercicioCreationAttributes>
  implements InterfaceEntrenamientoEjercicio
{
  public id!: number;
  public entrenamiento_id!: number;
  public ejercicio_id!: number;
  public series_realizadas?: number;
  public repeticiones_realizadas?: number;
  public peso_usado?: number;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

export default (sequelize: Sequelize) => {
  EntrenamientoEjercicio.init(
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
      sequelize,
      tableName: 'entrenamiento_ejercicios',
      modelName: 'EntrenamientoEjercicio',
      timestamps: true,
    }
  );

  return EntrenamientoEjercicio;
};
