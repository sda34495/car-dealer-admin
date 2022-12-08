import Route from '@ioc:Adonis/Core/Route'
const namespace = 'App/Controllers/Http/Admin'
Route.group(() => {
  // slider start
  Route.get('/slider-view/:id?', 'SliderController.view').as('slider-view')
  Route.get('/slider-list', 'SliderController.view').as('slider-list')
  Route.post('/slider-create/:id?', 'SliderController.updateSlider').as('slider-update')
  // slider end
})
  .prefix('/admin')
  .namespace(namespace)
