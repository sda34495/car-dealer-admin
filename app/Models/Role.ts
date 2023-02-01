import { Schema, model } from 'mongoose'

interface Role {
  title: string
  access: Array<string>
  isDeleted: boolean
}

const roleSchema = new Schema<Role>(
  {
    title: { type: String },
    access: { type: Array, default: [] },
    isDeleted: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  }
)

const Role = model<Role>('Role', roleSchema)

export { Role }
