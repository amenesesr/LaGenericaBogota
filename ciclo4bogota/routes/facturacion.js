const express = require('express')
const router = express.Router()
const morgan = require('morgan')

const loginController = require('../controllers/loginController')
const facturacionController = require('../controllers/facturacionController')

//mapping cargar factura
router.get('/facturacion', loginController.autenticado, morgan('tiny'), facturacionController.mostrar)

//mapping consultar factura
router.post('/facturacion', loginController.autenticado, morgan('tiny'), facturacionController.consultar)

//salir del aplicativo
router.get('/logout', loginController.autenticado, morgan('tiny'), loginController.logout)

module.exports = router