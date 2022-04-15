const express = require('express')
const router = express.Router()
const morgan = require('morgan')

const loginController = require('../controllers/loginController')
const ventasController = require('../controllers/ventasController')

//mapping cargar ventas
router.get('/ventas', loginController.autenticado, morgan('tiny'), ventasController.cargar)

router.post('/ventas', loginController.autenticado, morgan('tiny'), ventasController.cedulacliente)

//mapping cancelar e inicar una nueva venta
router.get('/ventas/nuevaventa', loginController.autenticado, morgan('tiny'), ventasController.nuevaventa)

//mapping registrar ventas
//router.post('/ventas/registrar', ventasController.registrar)
router.post('/factura', loginController.autenticado, morgan('tiny'), ventasController.registrar)

//mapping eliminar ventas
router.get('/ventas/eliminar/:_id', morgan('tiny'), ventasController.eliminar)

//salir del aplicativo
router.get('/logout', loginController.autenticado, morgan('tiny'), loginController.logout)

module.exports = router