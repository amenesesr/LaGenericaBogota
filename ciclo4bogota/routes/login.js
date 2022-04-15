const express = require('express')
const router = express.Router()
const morgan = require('morgan')
const { validateLogin } =require ('../validaciones/Login')

const loginController = require('../controllers/loginController')

//mapping cargar login
router.get('/login',morgan('tiny'), loginController.cargar)

router.post('/login',morgan('tiny'), validateLogin, loginController.login)

router.get('logout',morgan('tiny'), loginController.logout)

module.exports = router