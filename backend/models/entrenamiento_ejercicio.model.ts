import { sequelize } from './index'
import { DataTypes, Model, Optional } from 'sequelize'
import { InterfaceEntrenamientoEjercicio } from './interfaces/entrenamiento_ejercicio.interface'
import { EjercicioModel } from './ejercicio.model'

interface EntrenamientoEjercicioCreationAttributes extends Optional<InterfaceEntrenamientoEjercicio, 'id'> {}

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

  static async findById(id: number): Promise<EntrenamientoEjercicioModel | null> {
    return await EntrenamientoEjercicioModel.findByPk(id)
  }

  static async createEntrenamientoEjercicio(
    input: EntrenamientoEjercicioCreationAttributes
  ): Promise<EntrenamientoEjercicioModel> {
    return await EntrenamientoEjercicioModel.create(input)
  }

  static async findLastEntrenamientoEjercicio(): Promise<EntrenamientoEjercicioModel | null> {
    return await EntrenamientoEjercicioModel.findOne({
      order: [['id', 'DESC']]
    })
  }

  static async updateEntrenamientoEjercicio(
    id: number,
    data: Partial<EntrenamientoEjercicioCreationAttributes>
  ): Promise<EntrenamientoEjercicioModel | null> {
    const registro = await this.findByPk(id)
    if (!registro) return null
    return await registro.update(data)
  }

  static async deleteEntrenamientoEjercicio(id: number): Promise<boolean> {
    const registro = await this.findByPk(id)
    if (!registro) return false
    await registro.destroy()
    return true
  }

  static async countEntrenamientoEjercicios(): Promise<number> {
    return await this.count()
  }

  static async findEjercicioMasFrecuente(): Promise<{ ejercicio_id: number; total: number; nombre: string; tipo: string } | null> {
    const resultado = await this.findAll({
      attributes: [
        'ejercicio_id',
        [sequelize.fn('COUNT', sequelize.col('ejercicio_id')), 'total']
      ],
      include: [
        {
          model: EjercicioModel,
          attributes: ['nombre', 'tipo']
        }
      ],
      group: ['entrenamiento_ejercicio.ejercicio_id', 'EjercicioModel.id'],
      order: [[sequelize.fn('COUNT', sequelize.col('ejercicio_id')), 'DESC']],
      limit: 1,
      raw: true
    })
    if (resultado.length === 0) return null
    const item = resultado[0] as any
    return {
      ejercicio_id: item.ejercicio_id,
      total: Number(item.total),
      nombre: item['EjercicioModel.nombre'],
      tipo: item['EjercicioModel.tipo']
    }
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
