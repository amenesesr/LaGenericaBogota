const express = require('express')
const router = express.Router()
const multer = require('multer')
const mimeTypes = require('mime-types')
const morgan = require('morgan')
const { validateCrear } =require ('../validaciones/proveedoresCrear')
const { validateModificar } =require ('../validaciones/proveedoresModificar')
const { validateEliminar } =require ('../validaciones/Eliminar')

const loginController = require('../controllers/loginController')
const proveedoresController = require('../controllers/proveedoresController')

const storage = multer.diskStorage({
    destination:'controllers/archivos/',
    filename:(req,file,cb)=>{
        cb("","proveedores.csv")
    }
})

const cargar = multer({
    storage: storage
})


//mapping mostrar proveedores
router.get('/proveedores/', loginController.autenticado, morgan('tiny'),proveedoresController.mostrar)

//mapping cargar archivo productos
router.post('/proveedores/cargar', loginController.autenticado, morgan('tiny'),cargar.single('archivo'), proveedoresController.cargar)

//mapping crear proveedores
router.post('/proveedores/crear/', validateCrear, loginController.autenticado, morgan('tiny'), proveedoresController.crear)

//mapping modificar proveedores
router.post('/proveedores/modificar/', validateModificar, loginController.autenticado, morgan('tiny'), proveedoresController.modificar)

//mapping eliminar clientes
router.get('/proveedores/eliminar/:_id', validateEliminar, loginController.autenticado, morgan('tiny'), proveedoresController.eliminar)

//mapping limpiar tabla de proveedores rechazados
router.get('/proveedores/limpiar', loginController.autenticado, morgan('tiny'), proveedoresController.limpiar)

//salir del aplicativo
router.get('/logout/', loginController.autenticado,morgan('tiny'), loginController.logout)

module.exports = router