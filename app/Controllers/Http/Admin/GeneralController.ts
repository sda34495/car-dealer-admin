import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import BaseController from 'App/Controllers/BaseController'
export default class RoleController extends BaseController {

    public async viewDashboard({ view }: HttpContextContract) {
        return view.render('admin/general/dashboard');
    }
}