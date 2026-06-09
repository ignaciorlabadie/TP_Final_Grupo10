import { DataTypes, Model, Sequelize } from 'sequelize';
import { InterfaceEntrenamiento, EntrenamientoCreationAttributes } from './interfaces/entrenamiento.interface';

class Entrenamiento
  extends Model<InterfaceEntrenamiento, EntrenamientoCreationAttributes>
  implements InterfaceEntrenamiento
{
  public id!: number;
  public rutina_id!: number;
  public fecha!: Date;
  public duracion_real?: number;
  public notas?: string;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

export default (sequelize: Sequelize) => {
  Entrenamiento.init(
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
      fecha: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
      },
      duracion_real: {
        type: DataTypes.INTEGER,
        allowNull: true,
        validate: {
          min: 1,
        },
      },
      notas: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
    },
    {
      sequelize,
      tableName: 'entrenamientos',
      modelName: 'Entrenamiento',
      timestamps: true,
    }
  );

  return Entrenamiento;
};
