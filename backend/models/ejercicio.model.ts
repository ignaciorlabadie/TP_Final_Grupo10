import { sequelize } from './index'
import { DataTypes, Model, Optional } from 'sequelize'
import { InterfaceEjercicio } from './interfaces/ejercicio.interface'

type InputEjercicio = Omit<InterfaceEjercicio, 'id'>
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

  static async findById(id: string): Promise<EjercicioModel | null> {
    return await EjercicioModel.findByPk(id)
  }

  static async createEjercicio(ejercicioInput: InputEjercicio): Promise<EjercicioModel> {
    return await EjercicioModel.create(ejercicioInput)
  }

  static async findLastEjercicio(): Promise<EjercicioModel | null> {
    return await EjercicioModel.findOne({
      order: [['id', 'DESC']]
    })
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
