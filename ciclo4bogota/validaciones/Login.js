const {check} = require('express-validator')
const {validateResult} = require('../helpers/validateHelper')

const validateLogin = [
    check ('txtUsuario')
        .exists()
        .not()
        .isEmpty()
        .isLength({max:50}),
    check ('txtPassword') 
        .exists()
        .not()
        .isEmpty()
        .isLength({max:50}),
        (req, res, next) => {
            validateResult(req, res, next)
        }
]

module.exports = {validateLogin}