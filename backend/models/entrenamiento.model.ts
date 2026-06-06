import { DataTypes, Sequelize } from 'sequelize';
import { EntrenamientoInstance, EntrenamientoCreationAttributes } from './interfaces/entrenamiento.interface';

export default (sequelize: Sequelize) => {
  const Entrenamiento = sequelize.define<EntrenamientoInstance, EntrenamientoCreationAttributes>(
    'Entrenamiento',
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
      tableName: 'entrenamientos',
      timestamps: true,
    }
  );

  return Entrenamiento;
};
