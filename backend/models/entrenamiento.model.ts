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
  declare fecha: Date
  declare duracion_real: number | undefined
  declare notas: string | undefined
  declare readonly createdAt: Date
  declare readonly updatedAt: Date

  static async findAllEntrenamientos(): Promise<EntrenamientoModel[]> {
    return await EntrenamientoModel.findAll({
      include: [{
        model: EjercicioModel,
        as: 'ejercicios',
        through: { attributes: ['series_realizadas', 'repeticiones_realizadas', 'peso_usado'] },
      }],
      order: [['fecha', 'DESC']]
    })
  }

  static async findById(id: number): Promise<EntrenamientoModel | null> {
    return await EntrenamientoModel.findByPk(id, {
      include: [{
        model: EjercicioModel,
        as: 'ejercicios',
        through: { attributes: ['series_realizadas', 'repeticiones_realizadas', 'peso_usado'] },
      }]
    })
  }

  static async createEntrenamiento(input: EntrenamientoCreationAttributes): Promise<EntrenamientoModel> {
    return await EntrenamientoModel.create(input)
  }

  static async updateEntrenamiento(id: number, data: Partial<EntrenamientoCreationAttributes>): Promise<EntrenamientoModel | null> {
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