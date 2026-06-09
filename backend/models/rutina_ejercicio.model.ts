import { sequelize } from './index'
import { DataTypes, Model } from 'sequelize'
import {
  InterfaceRutinaEjercicio,
  RutinaEjercicioCreationAttributes
} from './interfaces/rutina_ejercicio.interface'

type InputRutinaEjercicio = Omit<InterfaceRutinaEjercicio, 'id'>

export class RutinaEjercicioModel
  extends Model<InterfaceRutinaEjercicio, RutinaEjercicioCreationAttributes>
  implements InterfaceRutinaEjercicio
{
  declare id: number
  declare rutina_id: number
  declare ejercicio_id: number
  declare orden: number | undefined
  declare series: number | undefined
  declare repeticiones: number | undefined
  declare descanso_segundos: number | undefined
  declare readonly createdAt: Date
  declare readonly updatedAt: Date

  static async findAllRutinaEjercicios(): Promise<RutinaEjercicioModel[]> {
    return await RutinaEjercicioModel.findAll()
  }

  static async findById(id: string): Promise<RutinaEjercicioModel | null> {
    return await RutinaEjercicioModel.findByPk(id)
  }

  static async createRutinaEjercicio(input: InputRutinaEjercicio): Promise<RutinaEjercicioModel> {
    return await RutinaEjercicioModel.create(input)
  }

  static async findLastRutinaEjercicio(): Promise<RutinaEjercicioModel | null> {
    return await RutinaEjercicioModel.findOne({
      order: [['id', 'DESC']]
    })
  }
}

RutinaEjercicioModel.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    rutina_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    ejercicio_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    orden: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    },
    series: {
      type: DataTypes.INTEGER,
      defaultValue: 1,
      validate: { min: 1 }
    },
    repeticiones: {
      type: DataTypes.INTEGER,
      defaultValue: 1,
      validate: { min: 1 }
    },
    descanso_segundos: {
      type: DataTypes.INTEGER,
      defaultValue: 60,
      validate: { min: 0 }
    }
  },
  {
    sequelize,
    tableName: 'rutina_ejercicios',
    timestamps: true
  }
)
