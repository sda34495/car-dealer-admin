import TimingController from 'App/Controllers/helpers/TimingController'
import { Role } from 'App/Models/Role'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import BaseController from 'App/Controllers/BaseController'
import { Car } from 'App/Models/Car'
import MediaUploader from 'App/Controllers/helpers/MediaUploader'
import converter from 'number-to-words'
export default class CarController {
  private static elements = [
    { title: 'All Cars', redirectUrl: 'car-list' },
    { title: 'add new', redirectUrl: 'car-view' },
  ]
  public async view({ request, view, params }: HttpContextContract) {
    if (request.url().includes('/car-list')) {
      const cars = await Car.find({ isDeleted: false }).lean()
      return view.render('admin/car/view', {
        cars: cars.map((el) => {
          const date = new Date(el.createdAt)
          let timePassed = TimingController.calculateTimePassed(date)
          return { ...el, createdAt: date.toDateString(), timePassed }
        }),
        elements: CarController.elements,
        active: 'All Cars',
      })
    }
    if (request.url().includes('/car-view')) {
      if (params?.id?.length) {
        const carToEdit = await Car.findOne({ _id: params.id })
        return view.render('admin/car/form', {
          car: carToEdit,
          pageTitle: 'Edit Car',
          buttonText: 'Save',
          elements: CarController.elements,
        })
      }

      return view.render('admin/car/form', {
        pageTitle: 'Create New Car',
        buttonText: 'Save',
        elements: CarController.elements,
        active: 'Add new',
      })
    }
  }
  public async updateCar({ request, params, response, session }: HttpContextContract) {
    const properties = {}

    if (params?.id?.length) {
      // shit

      if (request.body().price) {
        properties['price'] = parseInt(request.body().price)
      }
      if (request.body().mileage) {
        properties['mileage'] = parseInt(request.body().mileage)
      }
      if (request.body().registrationDate) {
        properties['registrationDate'] = new Date(request.body().registrationDate)
      }

      const images: object[] = []
      const requestedImages = request.files('images')
      if (requestedImages) {
        for (const image of requestedImages) {
          const path = await MediaUploader.uploadImage(image, 'cars')
          images.push({ path })
        }
      }
      const tabs: object[] = []
      if (request.body().heading && request.body().description) {
        tabs.push({ heading: request.body().heading, description: request.body().description })
      }
      await Car.findByIdAndUpdate(
        {
          _id: params.id,
        },
        {
          $set: {
            ...request.body(),
          },

          $push: {
            images: { $each: images },
            tabs: { $each: tabs },
          },
        }
      )
      BaseController.sendSuccessSession(session, 'Car Updated Successfully')
      return response.redirect().toRoute('car-view', {
        id: params.id,
      })
    }

    if (request.body().price) {
      properties['price'] = parseInt(request.body().price)
    }

    const slug = await CarController.getSlug(request.body().name)
    const car = new Car({
      ...request.body(),
      ...properties,
      slug: slug,
      redirectUrl: slug

    })
    await car.save()
    BaseController.sendSuccessSession(session, 'Car Created Successfully')
    return response.redirect().toRoute('car-view', {
      id: car._id,
    })
  }

  public async deleteRole({ params, session, response }: HttpContextContract) {
    if (params?.id) {
      await Role.findOneAndUpdate(
        {
          _id: params.id,
        },
        {
          $set: {
            isDeleted: true,
          },
        }
      )

      BaseController.sendSuccessSession(session, 'Role Deleted Successfully')
      return response.redirect().back()
    }
  }

  private static async getSlug(text: string) {
    
    

    let slug = text.toLowerCase()
      .replace(/\s+/g, '-')           // Replace spaces with -
      .replace(/[^\u0100-\uFFFF\w\-]/g, '-') // Remove all non-word chars ( fix for UTF-8 chars )
      .replace(/\-\-+/g, '-').
      trim()         // Replace multiple - with single -

    let cars = await Car.find({ slug: slug });
    if (cars.length) {
      const word = converter.toWords(cars.length).replace(/\s+/g, '-');
      slug += '-' + word;
    }
    return slug;
  }
  public async deleteImage({ params, response }: HttpContextContract) {
    if (params?.carId) {
      await Car.findOneAndUpdate(
        {
          _id: params.carId,
        },
        {
          $pull: {
            images: { _id: params.imageId },
          },
        }
      )
      return response.redirect().toRoute('car-view', {
        id: params.carId,
      })
    }
  }

  public async createTab({ request, params, response }: HttpContextContract) {
    // heading: { type: String },
    // description: { type: String },

    const { heading, description } = request.body()
    const { id } = params



    await Car.findOneAndUpdate({ id: id }, {
      $push: { tabs: { heading, description } }
    }

    )

    return response.redirect().back();
  }
}
