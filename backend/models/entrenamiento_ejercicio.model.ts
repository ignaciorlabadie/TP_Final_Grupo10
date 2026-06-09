import { sequelize } from './index'
import { DataTypes, Model } from 'sequelize'
import {
  InterfaceEntrenamientoEjercicio,
  EntrenamientoEjercicioCreationAttributes
} from './interfaces/entrenamiento_ejercicio.interface'

type InputEntrenamientoEjercicio = Omit<InterfaceEntrenamientoEjercicio, 'id'>

export class EntrenamientoEjercicioModel
  extends Model<InterfaceEntrenamientoEjercicio, EntrenamientoEjercicioCreationAttributes>
  implements InterfaceEntrenamientoEjercicio
{
  declare id: number
  declare entrenamiento_id: number
  declare ejercicio_id: number
  declare series_realizadas: number | undefined
  declare repeticiones_realizadas: number | undefined
  declare peso_usado: number | undefined
  declare readonly createdAt: Date
  declare readonly updatedAt: Date

  static async findAllEntrenamientoEjercicios(): Promise<EntrenamientoEjercicioModel[]> {
    return await EntrenamientoEjercicioModel.findAll()
  }

  static async findById(id: string): Promise<EntrenamientoEjercicioModel | null> {
    return await EntrenamientoEjercicioModel.findByPk(id)
  }

  static async createEntrenamientoEjercicio(
    input: InputEntrenamientoEjercicio
  ): Promise<EntrenamientoEjercicioModel> {
    return await EntrenamientoEjercicioModel.create(input)
  }

  static async findLastEntrenamientoEjercicio(): Promise<EntrenamientoEjercicioModel | null> {
    return await EntrenamientoEjercicioModel.findOne({
      order: [['id', 'DESC']]
    })
  }
}

EntrenamientoEjercicioModel.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    entrenamiento_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    ejercicio_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    series_realizadas: {
      type: DataTypes.INTEGER,
      defaultValue: 1,
      validate: { min: 1 }
    },
    repeticiones_realizadas: {
      type: DataTypes.INTEGER,
      defaultValue: 1,
      validate: { min: 1 }
    },
    peso_usado: {
      type: DataTypes.DECIMAL(8, 2),
      allowNull: true,
      validate: { min: 0 }
    }
  },
  {
    sequelize,
    tableName: 'entrenamiento_ejercicios',
    timestamps: true
  }
)
