const {check} = require('express-validator')
const {validateResult} = require('../helpers/validateHelper')

const validateCrear = [
    check ('txtNIT')
        .exists()
        .not()
        .isEmpty()
        .isNumeric()
        .isLength({max:20}),
    check ('txtNombre') 
        .exists()
        .not()
        .isEmpty()
        .isLength({max:50}),
    check ('txtCiudad')
        .exists()
        .not()
        .isEmpty()
        .isLength({max:50}),
    check ('txtDireccion')
        .exists()
        .not()
        .isEmpty()
        .isLength({max:50}),
    check ('txtTelefono')
        .exists()
        .not()
        .isEmpty()
        .isNumeric()
        .isLength({max:20}),
    (req, res, next) => {
        validateResult(req, res, next)
    }
]

module.exports = {validateCrear}