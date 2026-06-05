import { DataTypes, Sequelize } from 'sequelize';
import { RutinaInstance, RutinaCreationAttributes } from './interfaces/rutina.interface';

export default (sequelize: Sequelize) => {
  const Rutina = sequelize.define<RutinaInstance, RutinaCreationAttributes>(
    'Rutina',
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
      tableName: 'rutinas',
      timestamps: true,
    }
  );

  return Rutina;
};
