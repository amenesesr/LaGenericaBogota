const express = require('express')
const router = express.Router()
const multer = require('multer')
const mimeTypes = require('mime-types')
const morgan = require('morgan')
const { validateCrear } =require ('../validaciones/clientesCrear')
const { validateModificar } =require ('../validaciones/ClientesModificar')
const { validateEliminar } =require ('../validaciones/Eliminar')

const loginController = require('../controllers/loginController')
const clientesController = require('../controllers/clientesController')

const storage = multer.diskStorage({
    destination:'controllers/archivos/',
    filename:(req,file,cb)=>{
        cb("","clientes.csv")
    }
})

const cargar = multer({
    storage: storage
})

//mapping cargar archivo usuarios
router.post('/clientes/cargar', loginController.autenticado, morgan('tiny'),cargar.single('archivo'), clientesController.cargar)

//mapping mostrar clientes
router.get('/clientes/', loginController.autenticado, morgan('tiny'),clientesController.mostrar)

//mapping crear clientes
router.post('/clientes/crear/', validateCrear, loginController.autenticado, morgan('tiny'), clientesController.crear)

//mapping modificar clientes
router.post('/clientes/modificar/', validateModificar, loginController.autenticado, morgan('tiny'), clientesController.modificar)

//mapping eliminar clientes
router.get('/clientes/eliminar/:_id', validateEliminar, loginController.autenticado, morgan('tiny'), clientesController.eliminar)

//mapping limpiar tabla de usuarios rechazados
router.get('/clientes/limpiar', loginController.autenticado, morgan('tiny'), clientesController.limpiar)

//salir del aplicativo
router.get('/logout/', loginController.autenticado,morgan('tiny'), loginController.logout)

module.exports = router