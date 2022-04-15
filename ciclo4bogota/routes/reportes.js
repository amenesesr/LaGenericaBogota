const express = require('express')
const router = express.Router()
const morgan = require('morgan')

const loginController = require('../controllers/loginController')
const reportesController = require('../controllers/reportesController')

//mapping cargar reportes
router.get('/reportes/', loginController.autenticado, morgan('tiny'),reportesController.cargar)

//salir del aplicativo
router.get('/logout/', loginController.autenticado,morgan('tiny'), loginController.logout)

module.exports = router