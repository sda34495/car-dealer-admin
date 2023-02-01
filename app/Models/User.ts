import { Schema, model, Types } from 'mongoose'
import Hash from '@ioc:Adonis/Core/Hash'
import { Role } from './Role'
interface User {
  userName: string
  email: string
  password: string
  lastLogin: string
  roleId: string
  image: string
  isDeleted: boolean
  status: boolean
  validatePassword:(password)=>{}
}
const userSchema = new Schema<User>(
  {
    userName: { type: String },
    email: { type: String, unique: true },
    password: { type: String },
    lastLogin: { type: Date },
    roleId: { type: Types.ObjectId, ref: Role },
    image: { type: String },
    status: { type: Boolean, default: true },
    isDeleted: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  }
)

userSchema.methods.validatePassword = async function (password) {
  const isValid = await Hash.verify(this.password, password);
  return isValid;
}
userSchema.pre('save', async function () {
  this.password = await Hash.make(this.password)
})

const User = model<User>('User', userSchema)

export { User }
