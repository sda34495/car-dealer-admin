import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import { accessTypes } from 'App/Models/enums-and-constants/access'
import { Module } from 'App/Models/Module'

export default class extends BaseSeeder {
  public async run() {
    // Write your database queries inside the run method

    let key = 'slider'
    let module = 'slider-'
    const doc = new Module({
      title: 'Sliders',
      key,
      includeAccess: [
        module + accessTypes.CREATE,
        module + accessTypes.READ,
        module + accessTypes.update,
        module + accessTypes.destroy,
      ],
    })
    await doc.save()
  }
}
