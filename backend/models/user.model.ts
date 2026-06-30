import { sequelize } from './index'
import { DataTypes, Model, Optional } from 'sequelize'
import { InterfaceUser } from './interfaces/user.interface'
import bcrypt from 'bcryptjs'

interface UserCreationAttributes extends Optional<InterfaceUser, 'id'> {}

export class UserModel
  extends Model<InterfaceUser, UserCreationAttributes>
  implements InterfaceUser
{
  declare id: number
  declare nombre: string
  declare email: string
  declare password: string
  declare readonly createdAt: Date
  declare readonly updatedAt: Date

  static async createUser(userInput: UserCreationAttributes): Promise<UserModel> {
    return await UserModel.create(userInput)
  }

  static async findById(id: number): Promise<UserModel | null> {
    return await UserModel.findByPk(id)
  }

  static async findByEmail(email: string): Promise<UserModel | null> {
    return await UserModel.findOne({
      where: { email }
    })
  }

  async validatePassword(passwordInput: string): Promise<boolean> {
    return await bcrypt.compare(passwordInput, this.password)
  }

  static async findAllUsers(): Promise<UserModel[]> {
    return await UserModel.findAll()
  }

  toJSON() {
    const values = { ...this.get() } as Record<string, unknown>
    delete values.password
    return values
  }
}

UserModel.init(
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
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true
      }
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: [6, 255]
      }
    }
  },
  {
    sequelize,
    tableName: 'users',
    timestamps: true,
    hooks: {
      beforeCreate: async (user) => {
        // TODO: Hashear la contraseña antes de guardar el usuario.
        // Pista: usar bcrypt.hash() con 10 rondas de salt.
        if (user.password) {
          const salt = await bcrypt.genSalt(10)
          user.password = await bcrypt.hash(user.password, salt)
        }
      }
    }
  }
)