import { DataTypes, Sequelize } from 'sequelize';
import { EjercicioInstance, EjercicioCreationAttributes } from './interfaces/ejercicio.interface';

export default (sequelize: Sequelize) => {
  const Ejercicio = sequelize.define<EjercicioInstance, EjercicioCreationAttributes>(
    'Ejercicio',
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
      tipo: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: true,
        },
      },
    },
    {
      tableName: 'ejercicios',
      timestamps: true,
    }
  );

  return Ejercicio;
};
