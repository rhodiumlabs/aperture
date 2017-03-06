const nextRoutes = require('next-routes')
const routes = module.exports = nextRoutes()

routes.add('dashboard', '/c/:hash', 'dashboard')
routes.add('index', '/', 'index')