import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class Admin {
  public async handle({ session, response }: HttpContextContract, next: () => Promise<void>) {
    // code for middleware goes here. ABOVE THE NEXT CALL
    const user =  session.get('user');
    if (!user) {
      console.log("Failed here.............")
      return response.redirect().toRoute('/')
    }
    await next()
  }
}
