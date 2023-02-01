import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import BaseController from 'App/Controllers/BaseController'
import MediaUploader from 'App/Controllers/helpers/MediaUploader'
import TimingController from 'App/Controllers/helpers/TimingController'
import { Role } from 'App/Models/Role'
import { User } from 'App/Models/User'

export default class UserController {
  private static elements = [
    { title: 'All Users', redirectUrl: 'user-list' },
    { title: 'Add new', redirectUrl: 'user-view' },
  ]
  public async view({ request, view, params }: HttpContextContract) {
    if (request.url().includes('/user-list')) {
      const users = await User.find({ isDeleted: false }).lean()
      return view.render('admin/user/view', {
        users: users.map((el) => {
          const date = new Date(el.createdAt)
          let timePassed = TimingController.calculateTimePassed(date)
          return { ...el, createdAt: date.toDateString(), timePassed }
        }),
        elements: UserController.elements,
        active: 'All Users',
      })
    }
    const roles = await Role.find().lean();
    if (request.url().includes('/user-view')) {
      if (params?.id?.length) {
        const userToEdit = await User.findOne({ _id: params.id })

        return view.render('admin/user/form', {
          user: userToEdit,
          pageTitle: 'Edit User',
          buttonText: 'Update',
          elements: UserController.elements,
          roles
        })
      }
      return view.render('admin/user/form', {
        pageTitle: 'Create New User',
        buttonText: 'Create',
        elements: UserController.elements,
        active: 'Add new',
        roles:roles
      })
    }
  }

  public async updateUser({ request, params, response, session }: HttpContextContract) {
    const { userName, role } = request.body()
    const image = request.file('image')
    let updatedPath = ''
    let optionalProperties = {}
    if (params?.id?.length) {
      if (request.file('image')) {
        updatedPath = await MediaUploader.uploadImage(image, 'sliders')
      }

      if (updatedPath.length > 0) {
        optionalProperties['image'] = updatedPath
      }
      await User.findOneAndUpdate(
        {
          _id: params.id,
        },
        {
          $set: {
            userName: userName,
            role: role,
            ...optionalProperties,
          },
        }
      )
      BaseController.sendSuccessSession(session, 'User Upadted Successfully')
      return response.redirect().toRoute('user-list')
    }

    let path = ''
    if (image) {
      path = await MediaUploader.uploadImage(image, 'sliders')
    }
    const user = new User({
      ...request.body(),
      image: path,
    })

    await user.save()
    BaseController.sendSuccessSession(session, 'Slider Created Successfully')

    return response.redirect().toRoute('user-list')
  }

  public async deleteUser({ params, session, response }: HttpContextContract) {
    if (params?.id) {
      await User.findOneAndUpdate(
        {
          _id: params.id,
        },
        {
          $set: {
            isDeleted: true,
          },
        }
      )

      BaseController.sendSuccessSession(session, 'User Deleted Successfully')
      return response.redirect().back()
    }
  }
}
