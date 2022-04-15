const express = require('express')
const router = express.Router()
const morgan = require ('morgan')

const pruebasController = require('../controllers/pruebasController')

//mapping mostrar pruebas
router.get('/pruebas', morgan('tiny'), pruebasController.mostrar)

module.exports = router