import { Schema, model } from 'mongoose'

interface Module {
  title: string
  key: string
  includeAccess: Array<string>
  isDeleted: boolean
}

const moduleSchema = new Schema<Module>(
  {
    title: { type: String },
    key: { type: String },
    includeAccess: { type: Array, default: [] },
    isDeleted: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  }
)

const Module = model<Module>('Module', moduleSchema)

export { Module }
