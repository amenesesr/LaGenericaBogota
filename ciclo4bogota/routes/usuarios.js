const express = require('express')
const router = express.Router()
const multer = require('multer')
const mimeTypes = require('mime-types')
const morgan = require('morgan')
const { validateCrear } =require ('../validaciones/usuariosCrear')
const { validateModificar } =require ('../validaciones/usuariosModificar')
const { validateEliminar } =require ('../validaciones/Eliminar')

const loginController = require('../controllers/loginController')
const usuariosController = require('../controllers/usuariosController')

const storage = multer.diskStorage({
    destination:'controllers/archivos/',
    filename:(req,file,cb)=>{
        cb("","usuarios.csv")
    }
})

const cargar = multer({
    storage: storage
})

//mapping cargar archivo usuarios
router.post('/usuarios/cargar', loginController.autenticado, morgan('tiny'),cargar.single('archivo'), usuariosController.cargar)

//mapping mostrar usuarios
router.get('/usuarios/', loginController.autenticado, morgan('tiny'),usuariosController.mostrar)

//mapping crear usuarios
router.post('/usuarios/crear/', validateCrear, loginController.autenticado, morgan('tiny'), usuariosController.crear)

//mapping modificar usuarios
router.post('/usuarios/modificar/',validateModificar, loginController.autenticado, morgan('tiny'), usuariosController.modificar)

//mapping eliminar usuarios
router.get('/usuarios/eliminar/:_id', validateEliminar, loginController.autenticado, morgan('tiny'), usuariosController.eliminar)

//mapping limpiar tabla de usuarios rechazados
router.get('/usuarios/limpiar', loginController.autenticado, morgan('tiny'), usuariosController.limpiar)

//salir del aplicativo
router.get('/logout/',morgan('tiny'), loginController.autenticado, loginController.logout)

module.exports = router