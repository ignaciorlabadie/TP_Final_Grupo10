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
  declare readonly createdAt: Date
  declare readonly updatedAt: Date

  static async findAllRutinas(): Promise<RutinaModel[]> {
    // agrego include de EjercicioModel para traer los ejercicios asociados a cada rutina
    return await RutinaModel.findAll({ 
      include: [{
        model: EjercicioModel,
        as: 'ejercicios',
        through: { attributes: ['orden', 'series', 'repeticiones', 'descanso_segundos'] },
      },
      ],
      order: [['createdAt', 'DESC']]
    })
  }

  static async findById(id: number): Promise<RutinaModel | null> {
    // agrego include de EjercicioModel para traer los ejercicios asociados a la rutina
    return await RutinaModel.findByPk(id, {
      include: [{
        model: EjercicioModel,
        as: 'ejercicios',
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
  
  static async updateRutina(id: number, data: Partial<RutinaCreationAttributes>): Promise<RutinaModel | null> {
    const rutina = await this.findByPk(id)
    if (!rutina) return null
    return await rutina.update(data)
  }

  static async deleteRutina(id: number): Promise<boolean> {
    const rutina = await this.findByPk(id)
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
    }
  },
  {
    sequelize,
    tableName: 'rutinas',
    timestamps: true
  }
)
