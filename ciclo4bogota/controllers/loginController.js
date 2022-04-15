const Usuarios = require('../model/Usuarios')
const CookieJWTBogota = require('jsonwebtoken')
const bcryptjs = require('bcryptjs')
const {promisify} = require('util')


//cargar pagina login
module.exports.cargar = (req, res)=>{  
    const error = 0 
    res.render('login',{error})
}

//valida el usuario y contraseña y redirige a la paginas
module.exports.login = async (req, res)=>{
    try {
        console.log("==========================".yellow)
        console.log("        METODO LOGIN      ".red)
        console.log("==========================".yellow)
        const user = req.body.txtUsuario
        const password = req.body.txtPassword
        var error = 1
        var bandera = 0

        Usuarios.find({},(error, usuarios)=>{
            if(error){
                return res.status(500).json({
                    message: 'Error buscando los usuarios'
                })
            }

            usuarios.forEach((usuario) =>  {

                if(usuario.usuario_usuarios == user && bcryptjs.compareSync(password,usuario.password_usuarios))
                {
                    console.log("==========================".yellow)
                    console.log("  METODO LOGIN VALIDO     ".red)
                    console.log("==========================".yellow)
                    bandera = 1
                    const id = usuario.usuario_usuarios
                    const token = CookieJWTBogota.sign({id:id},process.env.JWT_SECRET,{
                        expiresIn: process.env.JWT_TIEMPO_EXT
                    })
                    console.log('Token: '.magenta + token)
                    const cookiesOptions = {
                        expiresIn : new Date (Date.now() + process.env.JWT_TIEMPO_EXC * 24 * 60 * 60 * 1000),
                        httpOnly: true
                    }
                    res.cookie('CookieJWTBogota',token, cookiesOptions)
                } 
            })
            if (bandera != 0)
            {
                res.redirect('/productos')
            }
            else
            {
                error = 1
                res.render('login',{error}) 
            }
        })        
    } catch (error) {
        console.log(error)
    }
}

module.exports.autenticado = async (req, res, next) => {
    console.log("==========================".yellow)
    console.log("    METODO AUTENTICADO    ".red)
    console.log("==========================".yellow)
    var bandera = 0
    var userval = 0
    if(req.cookies.CookieJWTBogota){
        try {
            const decodificada = await promisify(CookieJWTBogota.verify)(req.cookies.CookieJWTBogota, process.env.JWT_SECRET)
            Usuarios.find({},(error, usuarios)=>{
                if(error){
                    return res.status(500).json({
                        message: 'Error buscando los usuarios'
                    })
                }
                usuarios.forEach((usuario) =>  {
                    if(usuario.usuario_usuarios == decodificada.id)
                    {
                        bandera = 1
                        userval = usuario
                        //req.user = usuario.usuario_usuarios
                        //return next()
                    }
                })
                if (bandera != 0)
                {
                    req.user = userval.usuario_usuarios

                    return next()
                }
                else
                {
                     res.redirect('/login')
                }
            })
            
        } catch (error) {
            console.log(error)
            return next()
        }
    }
    else
    {
        res.redirect('/login')
    }
}

module.exports.logout = (req, res) => {
    res.clearCookie('CookieJWTBogota')
    return res.redirect('/login')
}