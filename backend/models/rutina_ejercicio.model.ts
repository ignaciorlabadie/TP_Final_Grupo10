import { DataTypes, Model, Sequelize } from 'sequelize';
import { InterfaceRutinaEjercicio, RutinaEjercicioCreationAttributes } from './interfaces/rutina_ejercicio.interface';

class RutinaEjercicio
  extends Model<InterfaceRutinaEjercicio, RutinaEjercicioCreationAttributes>
  implements InterfaceRutinaEjercicio
{
  public id!: number;
  public rutina_id!: number;
  public ejercicio_id!: number;
  public orden?: number;
  public series?: number;
  public repeticiones?: number;
  public descanso_segundos?: number;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

export default (sequelize: Sequelize) => {
  RutinaEjercicio.init(
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
      sequelize,
      tableName: 'rutina_ejercicios',
      modelName: 'RutinaEjercicio',
      timestamps: true,
    }
  );

  return RutinaEjercicio;
};
