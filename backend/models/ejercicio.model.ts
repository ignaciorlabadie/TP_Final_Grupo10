import { sequelize } from './index'
import { DataTypes, Model, Optional } from 'sequelize'
import { InterfaceEjercicio } from './interfaces/ejercicio.interface'

interface EjercicioCreationAttributes extends Optional<InterfaceEjercicio, 'id'> {}

export class EjercicioModel
  extends Model<InterfaceEjercicio, EjercicioCreationAttributes>
  implements InterfaceEjercicio
{
  declare id: number
  declare nombre: string
  declare tipo: string
  declare readonly createdAt: Date
  declare readonly updatedAt: Date

  static async findAllEjercicios(): Promise<EjercicioModel[]> {
    return await EjercicioModel.findAll()
  }

  static async findById(id: number): Promise<EjercicioModel | null> {
    return await EjercicioModel.findByPk(id)
  }

  static async createEjercicio(ejercicioInput: EjercicioCreationAttributes): Promise<EjercicioModel> {
    return await EjercicioModel.create(ejercicioInput)
  }

  static async findLastEjercicio(): Promise<EjercicioModel | null> {
    return await EjercicioModel.findOne({
      order: [['id', 'DESC']]
    })
  }

  static async updateEjercicio(id: number, data: Partial<EjercicioCreationAttributes>): Promise<EjercicioModel | null> {
    const ejercicio = await this.findByPk(id)
    if (!ejercicio) return null
    return await ejercicio.update(data)
  }

  static async deleteEjercicio(id: number): Promise<boolean> {
    const ejercicio = await this.findByPk(id)
    if (!ejercicio) return false
    await ejercicio.destroy()
    return true
  }

  static async findByTipo(tipo: string): Promise<EjercicioModel[]> {
    return await this.findAll({ where: { tipo } })
  }

  static async countEjercicios(): Promise<number> {
    return await this.count()
  }
}

EjercicioModel.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    nombre: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true,
        len: [2, 100]
      }
    },
    tipo: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true
      }
    }
  },
  {
    sequelize,
    tableName: 'ejercicios',
    timestamps: true
  }
)
