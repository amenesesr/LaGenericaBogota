const {check} = require('express-validator')
const {validateResult} = require('../helpers/validateHelper')

const validateModificar = [
    check ('txtCodigo_editar')
        .exists()
        .not()
        .isEmpty()
        .isNumeric()
        .isLength({max:50}),
    check ('txtNombre_editar') 
        .exists()
        .not()
        .isEmpty()
        .isLength({max:50}),
    check ('txtIVA_editar')
        .exists()
        .not()
        .isEmpty()
        .isNumeric()
        .isLength({max:50}),
    check ('txtPrecioCompra_editar')
        .exists()
        .not()
        .isEmpty()
        .isNumeric()
        .isLength({max:50}),
    check ('txtNIT_editar')
        .exists()
        .not()
        .isEmpty()
        .isNumeric()
        .isLength({max:50}),
    check('txtPrecioVenta_editar')
        .exists()
        .not()
        .isEmpty()
        .isNumeric()
        .isLength({max:50}),
        (req, res, next) => {
            validateResult(req, res, next)
        }
]

module.exports = {validateModificar}