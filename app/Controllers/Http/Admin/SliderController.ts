import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import MediaUploader from 'App/Controllers/helpers/MediaUploader'
import TimingController from 'App/Controllers/helpers/TimingController'
import { Slider } from 'App/Models/Slider'

export default class QouteController {
  private elements = [
    { title: 'All Sliders', redirectUrl: 'slider-list' },
    { title: 'Add new', redirectUrl: 'slider-view' },
  ]
  public async view({ request, view, params }: HttpContextContract) {
    if (request.url().includes('/slider-list')) {
      const sliders = await Slider.find().lean()
      return view.render('admin/slider/view', {
        sliders: sliders.map((el) => {
          const date = new Date(el.createdAt)
          let timePassed = TimingController.calculateTimePassed(date)
          return { ...el, createdAt: date.toDateString(), timePassed }
        }),
        elements: this.elements,
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
          elements: this.elements,
        })
      }
      return view.render('admin/slider/form', {
        pageTitle: 'Create New Slider',
        buttonText: 'Create',
        elements: this.elements,
        active: 'Add new',
      })
    }
  }

  public async updateSlider({ request, params, response }: HttpContextContract) {
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
    return response.redirect().toRoute('slider-list')
  }
}