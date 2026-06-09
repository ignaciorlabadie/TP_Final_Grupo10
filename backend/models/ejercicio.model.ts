import { DataTypes, Model, Optional, Sequelize } from 'sequelize';
import { InterfaceEjercicio, EjercicioCreationAttributes } from './interfaces/ejercicio.interface';

class Ejercicio
  extends Model<InterfaceEjercicio, EjercicioCreationAttributes>
  implements InterfaceEjercicio
{
  public id!: number;
  public nombre!: string;
  public tipo!: string;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

export default (sequelize: Sequelize) => {
  Ejercicio.init(
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      nombre: {
        type: DataTypes.STRING(100),
        allowNull: false,
        validate: {
          notEmpty: true,
          len: [2, 100],
        },
      },
      tipo: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: true,
        },
      },
    },
    {
      sequelize,
      tableName: 'ejercicios',
      modelName: 'Ejercicio',
      timestamps: true,
    }
  );

  return Ejercicio;
};
