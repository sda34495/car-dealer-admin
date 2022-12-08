import { Schema, model } from 'mongoose'

interface Slider {
  preHeading: string
  postHeading: string
  image: string
}

const sliderSchema = new Schema<Slider>(
  {
    preHeading: { type: String },
    postHeading: { type: String },
    image: { type: String },
  },
  {
    timestamps: true,
  }
)

const Slider = model<Slider>('Slider', sliderSchema)

export { Slider }
