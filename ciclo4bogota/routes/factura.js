const express = require('express')
const router = express.Router()
const morgan = require('morgan')

const loginController = require('../controllers/loginController')
const facturaController = require('../controllers/facturaController')

//mapping cargar factura
router.post('/factura', loginController.autenticado, morgan('tiny'), facturaController.mostrar)

//salir del aplicativo
router.get('/logout', loginController.autenticado, morgan('tiny'), loginController.logout)

module.exports = router