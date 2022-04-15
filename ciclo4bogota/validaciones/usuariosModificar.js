const {check} = require('express-validator')
const {validateResult} = require('../helpers/validateHelper')

const validateModificar = [
    check ('txtNombre_editar') 
        .exists()
        .not()
        .isEmpty()
        .isLength({max:50}),
    check ('txtCorreo_editar')
        .exists()
        .not()
        .isEmpty()
        .isLength({max:50}),
    check ('txtUsuario_editar')
        .exists()
        .not()
        .isEmpty()
        .isLength({max:50}),
    check ('txtPassword_editar')
        .exists()
        .not()
        .isEmpty(),
    (req, res, next) => {
        validateResult(req, res, next)
    }
]

module.exports = {validateModificar}