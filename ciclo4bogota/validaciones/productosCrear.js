const {check} = require('express-validator')
const {validateResult} = require('../helpers/validateHelper')

const validateCrear = [
    check ('txtCodigo')
        .exists()
        .not()
        .isEmpty()
        .isNumeric()
        .isLength({max:50}),
    check ('txtNombre') 
        .exists()
        .not()
        .isEmpty()
        .isLength({max:50}),
    check ('txtIVA')
        .exists()
        .not()
        .isEmpty()
        .isNumeric()
        .isLength({max:50}),
    check ('txtCompra')
        .exists()
        .not()
        .isEmpty()
        .isNumeric()
        .isLength({max:50}),
    check ('txtNIT')
        .exists()
        .not()
        .isEmpty()
        .isNumeric()
        .isLength({max:50}),
    check('txtVenta')
        .exists()
        .not()
        .isEmpty()
        .isNumeric()
        .isLength({max:50}),
        (req, res, next) => {
            validateResult(req, res, next)
        }
]

module.exports = {validateCrear}