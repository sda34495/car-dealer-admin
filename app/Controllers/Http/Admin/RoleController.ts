import TimingController from 'App/Controllers/helpers/TimingController'
import { Role } from 'App/Models/Role'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { Module } from 'App/Models/Module'
import BaseController from 'App/Controllers/BaseController'

export default class RoleController {
  private static elements = [
    { title: 'All Roles', redirectUrl: 'role-list' },
    { title: 'add new', redirectUrl: 'role-view' },
  ]
  public async view({ request, view, params }: HttpContextContract) {
    if (request.url().includes('/role-list')) {
      const roles = await Role.find({ isDeleted: false }).lean()
      return view.render('admin/role/view', {
        roles: roles.map((el) => {
          const date = new Date(el.createdAt)
          let timePassed = TimingController.calculateTimePassed(date)
          return { ...el, createdAt: date.toDateString(), timePassed }
        }),
        elements: RoleController.elements,
        active: 'All Roles',
      })
    }
    if (request.url().includes('/role-view')) {
      if (params?.id?.length) {
        const roleToEdit = await Role.findOne({ _id: params.id })
        const modules = await Module.find().lean()
        return view.render('admin/role/form', {
          role: roleToEdit,
          pageTitle: 'Edit Role',
          buttonText: 'Update',
          elements: RoleController.elements,
          modules,
        })
      }

      const modules = await Module.find().lean()
      return view.render('admin/role/form', {
        pageTitle: 'Create New Role',
        buttonText: 'Create',
        modules,
        elements: RoleController.elements,
        active: 'Add new',
      })
    }
  }
  public async updateRole({ request, params, response, session }: HttpContextContract) {
    if (params?.id?.length) {
      await Role.findOneAndUpdate(
        {
          _id: params.id,
        },
        {
          $set: {
            ...request.body(),
          },
        }
      )
      BaseController.sendSuccessSession(session, 'Role Upadted Successfully')
      return response.redirect().back()
    }

    const role = new Role({
      ...request.body(),
    })
    await role.save()
    BaseController.sendSuccessSession(session, 'Role Created Successfully')
    return response.redirect().toRoute('role-view', {
      id: role._id,
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
}
