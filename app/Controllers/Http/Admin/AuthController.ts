import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { User } from 'App/Models/User'
import BaseController from 'App/Controllers/BaseController'

export default class RoleController extends BaseController {

    public async login({ request, session, response }: HttpContextContract) {
        const { email, password } = request.body();

        const user = await User.findOne({ email: email });
        if (!user) {
            return response.redirect().back();
        }

        const isValidPassword = await user.validatePassword(password)

        if (!isValidPassword) {

            return response.redirect().back();
        }

        // if (!user.roleId) {
        //     console.log('user. 1');
        //     return response.redirect().back();
        // }
        // const userRole = await Role.findOne({ _id: user.roleId });

        // if (!userRole) {
        //       console.log('user. 2');
        //       return response.redirect().back();
        // }





        const { userName, image } = user

        session.put('user', { userName, email, image });

        return response.redirect().toRoute('dashboard')
    }

    public async logout({ session, response }: HttpContextContract) {
        await session.pull('user');
        return response.redirect().toRoute('/')
    }
}