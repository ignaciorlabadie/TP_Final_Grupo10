import { DataTypes, Model, Sequelize } from 'sequelize';
import { InterfaceRutina, RutinaCreationAttributes } from './interfaces/rutina.interface';

class Rutina
  extends Model<InterfaceRutina, RutinaCreationAttributes>
  implements InterfaceRutina
{
  public id!: number;
  public nombre!: string;
  public descripcion?: string;
  public duracion_minutos?: number;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

export default (sequelize: Sequelize) => {
  Rutina.init(
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      nombre: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: true,
          len: [2, 100],
        },
      },
      descripcion: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      duracion_minutos: {
        type: DataTypes.INTEGER,
        allowNull: true,
        validate: {
          min: 1,
        },
      },
    },
    {
      sequelize,
      tableName: 'rutinas',
      modelName: 'Rutina',
      timestamps: true,
    }
  );

  return Rutina;
};
