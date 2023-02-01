import Route from '@ioc:Adonis/Core/Route'
const namespace = 'App/Controllers/Http/Admin'
Route.group(() => {

  // slider start
  Route.get('/slider-view/:id?', 'SliderController.view').as('slider-view')
  Route.get('/slider-list', 'SliderController.view').as('slider-list')
  Route.post('/slider-create/:id?', 'SliderController.updateSlider').as('slider-update')
  Route.get('/slider-delete/:id?', 'SliderController.deleteSlider').as('slider-delete')
  // slider end

  // Roles start
  Route.get('/role-view/:id?', 'RoleController.view').as('role-view')
  Route.get('/role-list', 'RoleController.view').as('role-list')
  Route.post('/role-create/:id?', 'RoleController.updateRole').as('role-update')
  Route.get('/role-delete/:id?', 'RoleController.deleteRole').as('role-delete')

  // Roles End

  // Users start
  Route.get('/user-view/:id?', 'UserController.view').as('user-view')
  Route.get('/user-list', 'UserController.view').as('user-list')
  Route.post('/user-create/:id?', 'UserController.updateUser').as('user-update')
  Route.get('/user-delete/:id?', 'UserController.deleteUser').as('user-delete')

  // Users End

  // Cars start
  Route.get('/car-view/:id?', 'CarController.view').as('car-view')
  Route.get('/car-list', 'CarController.view').as('car-list')
  Route.post('/car-create/:id?', 'CarController.updateCar').as('car-update')
  Route.get('/car-delete/:id?', 'CarController.deleteCar').as('car-delete')
  Route.get('/car-delete-image/:carId/:imageId', 'CarController.deleteImage').as('car-delete-image')
  Route.post('/create-tab/:id?', 'CarController.createTab').as('car-detail-tab')



  // Cars End

  // General 
  Route.get('/dashboard', 'GeneralController.viewDashboard').as('dashboard')
 
  // General End



  // Auth 
  Route.get('/logout', 'AuthController.logout').as('logout')
 
  // Auth End

})
  .prefix('/admin')
  .namespace(namespace).middleware('admin')

Route.post('/auth', 'AuthController.login').as('get-auth').namespace(namespace)