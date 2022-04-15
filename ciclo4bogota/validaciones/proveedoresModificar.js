const {check} = require('express-validator')
const {validateResult} = require('../helpers/validateHelper')

const validateModificar = [
    check ('txtNIT_editar')
        .exists()
        .not()
        .isEmpty()
        .isNumeric()
        .isLength({max:20}),
    check ('txtNombre_editar') 
        .exists()
        .not()
        .isEmpty()
        .isLength({max:50}),
    check ('txtCiudad_editar')
        .exists()
        .not()
        .isEmpty()
        .isLength({max:50}),
    check ('txtDireccion_editar')
        .exists()
        .not()
        .isEmpty()
        .isLength({max:50}),
    check ('txtTelefono_editar')
        .exists()
        .not()
        .isEmpty()
        .isNumeric()
        .isLength({max:20}),
    (req, res, next) => {
        validateResult(req, res, next)
    }
]

module.exports = {validateModificar}