import { sequelize } from './index'
import { DataTypes, Model, Optional } from 'sequelize'
import { InterfaceRutinaEjercicio } from './interfaces/rutina_ejercicio.interface'

interface RutinaEjercicioCreationAttributes extends Optional<InterfaceRutinaEjercicio, 'id'> {}

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

  static async findById(id: number): Promise<RutinaEjercicioModel | null> {
    return await RutinaEjercicioModel.findByPk(id)
  }

  static async createRutinaEjercicio(rutinaEjercicioInput: RutinaEjercicioCreationAttributes): Promise<RutinaEjercicioModel> {
    return await RutinaEjercicioModel.create(rutinaEjercicioInput)
  }

  static async findLastRutinaEjercicio(): Promise<RutinaEjercicioModel | null> {
    return await RutinaEjercicioModel.findOne({
      order: [['id', 'DESC']]
    })
  }

  static async updateRutinaEjercicio(id: number, data: Partial<RutinaEjercicioCreationAttributes>): Promise<RutinaEjercicioModel | null> {
    const rutinaEjercicio = await this.findByPk(id)
    if (!rutinaEjercicio) return null
    return await rutinaEjercicio.update(data)
  }

  static async deleteRutinaEjercicio(id: number): Promise<boolean> {
    const rutinaEjercicio = await this.findByPk(id)
    if (!rutinaEjercicio) return false
    await rutinaEjercicio.destroy()
    return true
  }

  static async findByRutinaId(rutina_id: number): Promise<RutinaEjercicioModel[]> {
    return await this.findAll({ where: { rutina_id } })
  }

  static async countRutinaEjercicios(): Promise<number> {
    return await this.count()
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
