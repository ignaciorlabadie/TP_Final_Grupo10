import { sequelize } from './index'
import { DataTypes, Model } from 'sequelize'
import {
  InterfaceRutina,
  RutinaCreationAttributes
} from './interfaces/rutina.interface'

type InputRutina = Omit<InterfaceRutina, 'id'>

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
    return await RutinaModel.findAll()
  }

  static async findById(id: string): Promise<RutinaModel | null> {
    return await RutinaModel.findByPk(id)
  }

  static async createRutina(input: InputRutina): Promise<RutinaModel> {
    return await RutinaModel.create(input)
  }

  static async findLastRutina(): Promise<RutinaModel | null> {
    return await RutinaModel.findOne({
      order: [['id', 'DESC']]
    })
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
