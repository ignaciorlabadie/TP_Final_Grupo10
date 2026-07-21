import { sequelize } from './index'
import { DataTypes, Model, Optional } from 'sequelize'
import { InterfaceEntrenamiento } from './interfaces/entrenamiento.interface'
import { EjercicioModel } from './ejercicio.model'

interface EntrenamientoCreationAttributes extends Optional<InterfaceEntrenamiento, 'id' | 'fecha'> {}

export class EntrenamientoModel
  extends Model<InterfaceEntrenamiento, EntrenamientoCreationAttributes>
  implements InterfaceEntrenamiento
{
  declare id: number
  declare rutina_id: number
  declare user_id: number
  declare fecha: Date
  declare duracion_real: number | undefined
  declare notas: string | undefined
  declare readonly createdAt: Date
  declare readonly updatedAt: Date

  static async findAllEntrenamientos(userId?: number): Promise<EntrenamientoModel[]> {
    const where: any = {}
    if (userId) where.user_id = userId
    return await EntrenamientoModel.findAll({
      where,
      include: [{
        model: EjercicioModel,
        through: { attributes: ['series_realizadas', 'repeticiones_realizadas', 'peso_usado'] },
      }],
      order: [['fecha', 'DESC']]
    })
  }

  static async findById(id: number, userId?: number): Promise<EntrenamientoModel | null> {
    const where: any = { id }
    if (userId) where.user_id = userId
    return await EntrenamientoModel.findOne({
      where,
      include: [{
        model: EjercicioModel,
        through: { attributes: ['series_realizadas', 'repeticiones_realizadas', 'peso_usado'] },
      }]
    })
  }

  static async createEntrenamiento(input: EntrenamientoCreationAttributes): Promise<EntrenamientoModel> {
    return await EntrenamientoModel.create(input)
  }

  static async updateEntrenamiento(id: number, data: Partial<EntrenamientoCreationAttributes>, userId?: number): Promise<EntrenamientoModel | null> {
    const where: any = { id }
    if (userId) where.user_id = userId
    const entrenamiento = await EntrenamientoModel.findOne({ where })
    if (!entrenamiento) return null
    return await entrenamiento.update(data)
  }

  static async deleteEntrenamiento(id: number, userId?: number): Promise<boolean> {
    const where: any = { id }
    if (userId) where.user_id = userId
    const entrenamiento = await EntrenamientoModel.findOne({ where })
    if (!entrenamiento) return false
    await entrenamiento.destroy()
    return true
  }

  static async countEntrenamientos(userId?: number): Promise<number> {
    const where: any = {}
    if (userId) where.user_id = userId
    return await this.count({ where })
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
    user_id: {
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