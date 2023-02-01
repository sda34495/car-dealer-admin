import Env from '@ioc:Adonis/Core/Env'

import type { ApplicationContract } from '@ioc:Adonis/Core/Application'
const mongoose = require('mongoose')
/*
|--------------------------------------------------------------------------
| Provider
|--------------------------------------------------------------------------
|
| Your application is not ready when this file is loaded by the framework.
| Hence, the top level imports relying on the IoC container will not work.
| You must import them inside the life-cycle methods defined inside
| the provider class.
|
| @example:
|
| public async ready () {
|   const Database = this.app.container.resolveBinding('Adonis/Lucid/Database')
|   const Event = this.app.container.resolveBinding('Adonis/Core/Event')
|   Event.on('db:query', Database.prettyPrint)
| }
|
*/
export default class MongoProvider {
  constructor(protected app: ApplicationContract) { }

  public async register() {
    // Register your own bindings
    try {
      
      let connectionString = await Env.get('MONGO_CONNECTION_STRING',{ useUnifiedTopology: true }) 
      await mongoose.connect(
        connectionString
      )
    } catch (error) {
      console.log(error.message)
    }

    this.app.container.singleton('Mongoose', () => mongoose)
  }

  public async boot() {
    // All bindings are ready, feel free to use them
  }

  public async ready() {
    // App is ready
  }

  public async shutdown() {
    await this.app.container.use('Mongoose').disconnect()
    // Cleanup, since app is going down
  }
}
