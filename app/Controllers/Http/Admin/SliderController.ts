import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import BaseController from 'App/Controllers/BaseController'
import MediaUploader from 'App/Controllers/helpers/MediaUploader'
import TimingController from 'App/Controllers/helpers/TimingController'
import { Slider } from 'App/Models/Slider'

export default class SliderController {
  private static elements = [
    { title: 'All Sliders', redirectUrl: 'slider-list' },
    { title: 'Add new', redirectUrl: 'slider-view' },
  ]
  public async view({ request, view, params }: HttpContextContract) {
          
    if (request.url().includes('/slider-list')) {
      const sliders = await Slider.find({ isDeleted: false }).lean()
      return view.render('admin/slider/view', {
        sliders: sliders.map((el) => {
          const date = new Date(el.createdAt)
          let timePassed = TimingController.calculateTimePassed(date)
          return { ...el, createdAt: date.toDateString(), timePassed }
        }),
        elements: SliderController.elements,
        active: 'All Sliders',
      })
    }
    if (request.url().includes('/slider-view')) {
      if (params?.id?.length) {
        const sliderToEdit = await Slider.findOne({ _id: params.id })

        return view.render('admin/slider/form', {
          slider: sliderToEdit,
          pageTitle: 'Edit Slider',
          buttonText: 'Upadate',
          elements: SliderController.elements,
        })
      }
      return view.render('admin/slider/form', {
        pageTitle: 'Create New Slider',
        buttonText: 'Create',
        elements: SliderController.elements,
        active: 'Add new',
      })
    }
  }

  public async updateSlider({ request, params, response, session }: HttpContextContract) {
    const { preHeading, postHeading } = request.body()
    const image = request.file('image')
    let updatedPath = ''
    let optionalPropeties = {}
    if (params?.id?.length) {
      if (request.file('image')) {
        updatedPath = await MediaUploader.uploadImage(image, 'sliders')
      }

      if (updatedPath.length > 0) {
        optionalPropeties['image'] = updatedPath
      }
      await Slider.findOneAndUpdate(
        {
          _id: params.id,
        },
        {
          $set: {
            ...request.body(),
            ...optionalPropeties,
          },
        }
      )
      BaseController.sendSuccessSession(session, 'Slider Upadted Successfully')
      return response.redirect().toRoute('slider-list')
    }

    let path = ''
    if (image) {
      path = await MediaUploader.uploadImage(image, 'sliders')
    }
    const slider = new Slider({
      preHeading: preHeading ? preHeading : '',
      postHeading: postHeading ? postHeading : '',
      image: path?.length ? path : '',
    })

    await slider.save()
    BaseController.sendSuccessSession(session, 'Slider Created Successfully')

    return response.redirect().toRoute('slider-list')
  }

  public async deleteSlider({ params, session, response }: HttpContextContract) {
    if (params?.id) {
      await Slider.findOneAndUpdate(
        {
          _id: params.id,
        },
        {
          $set: {
            isDeleted: true,
          },
        }
      )
     
      BaseController.sendSuccessSession(session, 'Slider Deleted Successfully')
      return response.redirect().back()
    }
  }
}
