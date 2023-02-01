import { Schema, model, Types } from 'mongoose'

interface Car {
  //   basic
  name: string
  headLine: string
  price: number
  // end basic

  // description
  make: string
  model: string
  year: number
  registrationDate: string
  mileage: number
  condition: string
  exteriorColor: string
  interiorColor: string
  transmition: string
  engine: string
  // end description

  // images
  images: Array<string>
  // end images

  // tabs
  tabs: Array<object>
  // end tabs

  // extraFeatures
  extraFeatures: Array<string>
  //

  // essentials
  isFeatured: boolean
  createdBy: Types.ObjectId
  updatedBy: Types.ObjectId
  redirectUrl: string
  slug: string
  isDeleted: boolean
}

const imageSchema = new Schema<object>({
  path: { type: String },
})
const tabSchema = new Schema<object>({
  heading: { type: String },
  description: { type: String },
})
const carSchema = new Schema<Car>(
  {
    name: { type: String },
    headLine: { type: String },
    price: { type: Number, default: null },
    make: { type: String, default: '' },
    model: { type: String, default: '' },
    redirectUrl:{type:String, required:true},
    slug:{type:String,required:true},
    registrationDate: { type: Date },
    mileage: { type: Number, default: null },
    year: { type: Number, default: null },
    condition: { type: String, default: '' },
    exteriorColor: { type: String, default: '' },
    interiorColor: { type: String, default: '' },
    transmition: { type: String, default: '' },
    engine: { type: String, default: '' },
    images: { type: [imageSchema], default: [] },
    tabs: { type: [tabSchema], default: [] },
    extraFeatures: { type: Array, default: [] },
    isFeatured: { type: Boolean },
    isDeleted: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  }
)

const Car = model<Car>('Car', carSchema)

export { Car }
