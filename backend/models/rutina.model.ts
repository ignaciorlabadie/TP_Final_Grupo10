import { sequelize } from './index'
import { DataTypes, Model, Optional } from 'sequelize'
import { InterfaceRutina } from './interfaces/rutina.interface'
import { EjercicioModel } from './ejercicio.model'

interface RutinaCreationAttributes extends Optional<InterfaceRutina, 'id'> {}

export class RutinaModel
  extends Model<InterfaceRutina, RutinaCreationAttributes>
  implements InterfaceRutina
{
  declare id: number
  declare nombre: string
  declare descripcion: string | undefined
  declare duracion_minutos: number | undefined
  declare user_id: number
  declare readonly createdAt: Date
  declare readonly updatedAt: Date

  static async findAllRutinas(userId?: number): Promise<RutinaModel[]> {
    const where: any = {}
    if (userId) where.user_id = userId
    return await RutinaModel.findAll({ 
      where,
      include: [{
        model: EjercicioModel,
        through: { attributes: ['orden', 'series', 'repeticiones', 'descanso_segundos'] },
      },
      ],
      order: [['createdAt', 'DESC']]
    })
  }

  static async findById(id: number, userId?: number): Promise<RutinaModel | null> {
    const where: any = { id }
    if (userId) where.user_id = userId
    return await RutinaModel.findOne({
      where,
      include: [{
        model: EjercicioModel,
        through: { attributes: ['orden', 'series', 'repeticiones', 'descanso_segundos'] },
      }]
    })
  }

  static async createRutina(rutinaInput: RutinaCreationAttributes): Promise<RutinaModel> {
    return await RutinaModel.create(rutinaInput)
  }

  static async findLastRutina(): Promise<RutinaModel | null> {
    return await RutinaModel.findOne({
      order: [['id', 'DESC']]
    })
  }
  
  static async updateRutina(id: number, data: Partial<RutinaCreationAttributes>, userId?: number): Promise<RutinaModel | null> {
    const where: any = { id }
    if (userId) where.user_id = userId
    const rutina = await RutinaModel.findOne({ where })
    if (!rutina) return null
    return await rutina.update(data)
  }

  static async deleteRutina(id: number, userId?: number): Promise<boolean> {
    const where: any = { id }
    if (userId) where.user_id = userId
    const rutina = await RutinaModel.findOne({ where })
    if (!rutina) return false
    await rutina.destroy()
    return true
  }

  static async findByNombre(nombre: string): Promise<RutinaModel[]> {
    return await this.findAll({ where: { nombre } })
  }

  static async countRutinas(): Promise<number> {
    return await this.count()
  }

}

RutinaModel.init(
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
    descripcion: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    duracion_minutos: {
      type: DataTypes.INTEGER,
      allowNull: true,
      validate: { min: 1 }
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  },
  {
    sequelize,
    tableName: 'rutinas',
    timestamps: true
  }
)
