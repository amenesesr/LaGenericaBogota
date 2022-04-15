const express = require('express')
const router = express.Router()
const morgan = require ('morgan')

const loginController = require('../controllers/loginController')
const consolidadosController = require('../controllers/consolidadosController')

//mapping cargar ventas
router.get('/consolidados/', loginController.autenticado, morgan('tiny'), consolidadosController.cargar)

//salir del aplicativo
router.get('/logout/', loginController.autenticado, morgan('tiny'), loginController.logout)

module.exports = router