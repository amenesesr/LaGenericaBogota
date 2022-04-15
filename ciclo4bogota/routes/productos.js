const express = require('express')
const router = express.Router()
const multer = require('multer')
const mimeTypes = require('mime-types')
const morgan = require ('morgan')
const { validateCrear } =require ('../validaciones/productosCrear')
const { validateModificar } =require ('../validaciones/productosModificar')
const { validateEliminar } =require ('../validaciones/Eliminar')

const loginController = require('../controllers/loginController')
const productosController = require('../controllers/productosController')

const storage = multer.diskStorage({
    destination:'controllers/archivos/',
    filename:(req,file,cb)=>{
        cb("","productos.csv")
    }
})

const cargar = multer({
    storage: storage
})

//mapping mostrar productos
router.get('/productos', loginController.autenticado, morgan('tiny'), productosController.mostrar)

//mapping cargar archivo productos
router.post('/productos/cargar', loginController.autenticado, morgan('tiny'),cargar.single('archivo'), productosController.cargar)

//mapping crear productos
router.post('/productos/crear', validateCrear, loginController.autenticado, morgan('tiny'),productosController.crear)

//mapping modificar productos
router.post('/productos/modificar', validateModificar, loginController.autenticado, morgan('tiny'),productosController.modificar)

//mapping eliminar productos
router.get('/productos/eliminar/:_id', validateEliminar, loginController.autenticado, morgan('tiny'),productosController.eliminar)

//mapping limpiar tabla de productos rechazados
router.get('/productos/limpiar', loginController.autenticado, morgan('tiny'), productosController.limpiar)

//salir del aplicativo
router.get('/logout', loginController.autenticado, morgan('tiny'), loginController.logout)

module.exports = router