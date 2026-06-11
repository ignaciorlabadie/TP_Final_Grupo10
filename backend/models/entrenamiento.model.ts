import { sequelize } from './index'
import { DataTypes, Model } from 'sequelize'
import {
  InterfaceEntrenamiento,
  EntrenamientoCreationAttributes
} from './interfaces/entrenamiento.interface'

interface InputEntrenamiento extends Omit<InterfaceEntrenamiento, 'id' | 'fecha'> {}
interface EntrenamientoUpdateData extends Partial<InputEntrenamiento> {}

export class EntrenamientoModel
  extends Model<InterfaceEntrenamiento, EntrenamientoCreationAttributes>
  implements InterfaceEntrenamiento
{
  declare id: number
  declare rutina_id: number
  declare fecha: Date
  declare duracion_real: number | undefined
  declare notas: string | undefined
  declare readonly createdAt: Date
  declare readonly updatedAt: Date

  static async findAllEntrenamientos(options?: any): Promise<EntrenamientoModel[]> {
    return await EntrenamientoModel.findAll(options)
  }

  static async findById(id: number, options?: any): Promise<EntrenamientoModel | null> {
    return await EntrenamientoModel.findByPk(id, options)
  }

  static async createEntrenamiento(input: InputEntrenamiento): Promise<EntrenamientoModel> {
    return await EntrenamientoModel.create(input)
  }

  static async updateEntrenamiento(id: number, data: EntrenamientoUpdateData): Promise<EntrenamientoModel | null> {
    const entrenamiento = await this.findByPk(id)
    if (!entrenamiento) return null
    return await entrenamiento.update(data)
  }

  static async deleteEntrenamiento(id: number): Promise<boolean> {
    const entrenamiento = await this.findByPk(id)
    if (!entrenamiento) return false
    await entrenamiento.destroy()
    return true
  }

  static async countEntrenamientos(): Promise<number> {
    return await this.count()
  }

  static async findLastEntrenamiento(): Promise<EntrenamientoModel | null> {
    return await EntrenamientoModel.findOne({
      order: [['id', 'DESC']]
    })
  }
}

EntrenamientoModel.init(
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
    fecha: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW
    },
    duracion_real: {
      type: DataTypes.INTEGER,
      allowNull: true,
      validate: { min: 1 }
    },
    notas: {
      type: DataTypes.TEXT,
      allowNull: true
    }
  },
  {
    sequelize,
    tableName: 'entrenamientos',
    timestamps: true
  }
)