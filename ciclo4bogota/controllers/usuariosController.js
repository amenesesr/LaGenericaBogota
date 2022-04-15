const Usuarios = require('../model/Usuarios')
const bcryptjs = require('bcryptjs')
const {promisify} = require('util')
const UsuariosRid = require('../model/UsuariosRid')
const csvtojson = require('csvtojson')
const db1 = require('../database/db')
const db2 = require('../database/db')

//mostrar - metodos de la api
module.exports.mostrar = (req, res)=>{
    console.log("==========================".yellow)
    console.log("  METODO BUSCAR USUARIOS ".red)
    console.log("==========================".yellow)
    usuario = req.user
    Usuarios.find({},(error, usuarios)=>{
        if(error){
            return res.status(500).json({
                message: 'Error mostrando los usuarioss'
            })
        }

        UsuariosRid.find({},(error, usuariosrids)=>{
            if(error){
                return res.status(500).json({
                message: 'Error mostrando los usuarios rechazados'
                })
            }
          
  
        return res.render('usuarios',{usuarios: usuarios, usuariosrids: usuariosrids, usuario})
    })
    })
}

//cargar archivo
module.exports.cargar = async (req, res)=>{
    console.log("===================".yellow)
    console.log(" METODO CARGAR CSV ".red)
    console.log("===================".yellow)
    const archivo = __dirname + "\\archivos\\usuarios.csv"
    const usuariosCorrectos = []
    const usuariosrid = []
    bandera_cedula = 0
    bandera_usuarios = 0


    var fecha = ""
    var fechaTemp = new Date()
    options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour:'numeric', minute: 'numeric',
                second:'numeric'}
    fecha = fechaTemp.toLocaleDateString("es-CO",options)

    csvtojson().fromFile(archivo).then(source => {
    Usuarios.find({},(error, usuarios)=>{
        if(error){
            return res.status(500).json({
            message: 'Error al buscar los usuarios'
        })
    }

    for (var i = 0; i < source.length; i++) {
        var passhash = bcryptjs.hashSync(source[i]['password_usuarios'],10)
        var oneRow = {
            _id: source[i]['cedula_usuarios'],
            nombre_usuarios: source[i]['nombre_usuarios'],
            email_usuarios: source[i]['email_usuarios'],
            usuario_usuarios: source[i]['usuario_usuarios'],
            password_usuarios: passhash
        }

        bandera_cedula = 0
        usuarios.forEach((usuario) => {
        if (oneRow._id == usuario._id )
        {
            var usur = {
                cedula_usuariosrids: usuario._id,
                nombre_usuariosrids: oneRow.nombre_usuarios,
                usuario_usuariosrids: oneRow.usuario_usuarios,
                falla_usuariosrids: "El usuario con cedula "+ usuario._id +" ya existe",
                fecha_usuariosrids: fecha
            }
            bandera_cedula= 1
            usuariosrid.push(usur);
        }
        })

        bandera_usuario = 0
        usuarios.forEach((usuario) => {
        if (oneRow.usuario == usuario._id )
        {
            var usur = {
                cedula_usuariosrids: usuario._id,
                nombre_usuariosrids: oneRow.nombre_usuarios,
                usuario_usuariosrids: oneRow.usuario_usuarios,
                falla_usuariosrids: "Ya existe una persona con el usuario "+ oneRow.usuario_usuarios,
                fecha_usuariosrids: fecha
            }
            bandera_usuario = 1
            usuariosrid.push(usur);
        }
        })

        if (bandera_cedula == 0 && bandera_usuario == 0)
        {
            usuariosCorrectos.push(oneRow);
        }
    
    } //aqui termina la verificacion de los datos del archivo CSV para empezar a grabar
        
    const collectionName1 = 'db_usuarios'
    var collection1 = db1.collection(collectionName1)
    collection1.insertMany(usuariosCorrectos, (err, result) => {
        if (err) console.log(err)
        if(result){

        }
    }) //aqui se graban los dato que no tuvieron error

    const collectionName2 = 'db_usuariosrids'
    var collection2 = db2.collection(collectionName2)
    collection2.insertMany(usuariosrid, (err, result) => {
        if (err) console.log(err)
        if(result){

        }
    }) //aqui se graban los datos que tuvieron error en una tabla aparte para mostrarlos al usuario
})
})

res.redirect('/usuarios')
} 

//crear
module.exports.crear = async (req, res) =>{

    try {
        console.log("==========================".yellow)
        console.log("  METODO CREAR USUARIO ".red)
        console.log("==========================".yellow)
        var passhash = await bcryptjs.hash(req.body.txtPassword,10)
        var bandera_cedula = 0
        var bandera_usuario = 0
        var falla_usuario_cedula = ""
        var falla_usuario_usuario = ""

        var fecha = ""
        var fechaTemp = new Date()
        options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour:'numeric', minute: 'numeric',
                    second:'numeric'}
        fecha = fechaTemp.toLocaleDateString("es-CO",options)

        const usuario = new Usuarios({
            _id: req.body.txtCedula,
            nombre_usuarios: req.body.txtNombre,
            email_usuarios: req.body.txtCorreo,
            usuario_usuarios: req.body.txtUsuario,
            password_usuarios: passhash
        })
    
        Usuarios.find({},(error, usuarios)=>{
            if(error){
                return res.status(500).json({
                    message: 'Error mostrando los usuarioss'
                })
            }
        usuarios.forEach((usuario2) => {
            if (usuario._id == usuario2._id){
                bandera_cedula = 1
                falla_usuario_cedula = "La cedula ya se encuentra registrada en el sistema"
            }

            if (usuario.usuario_usuarios == usuario2.usuario_usuarios){
                bandera_usuario = 1
                falla_usuario_usuario = "Ya existe el usuario " + usuario2.usuario_usuarios +  " registrado en el sistema" 
            }
        })

        if(bandera_cedula == 1){
            var usur = new UsuariosRid({
                cedula_usuariosrids: req.body.txtCedula,
                nombre_usuariosrids: req.body.txtNombre,
                usuario_usuariosrids: req.body.txtUsuario,
                falla_usuariosrids: falla_usuario_cedula, 
                fecha_usuariosrids: fecha
            })

            usur.save(function(error,usur){
                if(error){
                    return res.status(500).json({
                        message: 'Error al crear el usuario rechazado cedula'
                    })
                }
             
                
            })
        }

        if(bandera_usuario == 1){
            const usur = new UsuariosRid({
                cedula_usuariosrids: req.body.txtCedula,
                nombre_usuariosrids: req.body.txtNombre,
                usuario_usuariosrids: req.body.txtUsuario,
                falla_usuariosrids: falla_usuario_usuario, 
                fecha_usuariosrids: fecha
            })

            usur.save(function(error,usur){
                if(error){
                    return res.status(500).json({
                        message: 'Error al crear el usuario rechazado usuario'
                    })
                }
               
                
            })
        }

        if(bandera_cedula == 0 && bandera_usuario == 0){
            usuario.save(function(error,usuario){
                if(error){
                    return res.status(500).json({
                        message: 'Error al crear el usuario'
                    })
                }
             
               
            })
        }
        res.redirect('/usuarios')
    })  
        
    } catch (error) {
        console.log(error)
    }

   
}

//modificar
module.exports.modificar = async (req, res)=>{

    try {

        console.log("==========================".yellow)
        console.log("  METODO MODIFICAR USUARIO ".red)
        console.log("==========================".yellow)
        const _id = req.body.txtCedula_editar
        const nombre_usuarios = req.body.txtNombre_editar
        const email_usuarios = req.body.txtCorreo_editar
        const usuario_usuarios = req.body.txtUsuario_editar   
        const password_usuarios = await bcryptjs.hash(req.body.txtPassword_editar,10)
        var bandera = 0

        var fecha = ""
        var fechaTemp = new Date()
        options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour:'numeric', minute: 'numeric',
                    second:'numeric'}
        fecha = fechaTemp.toLocaleDateString("es-CO",options)

        Usuarios.find({},(error, usuarios)=>{
            if(error){
                return res.status(500).json({
                    message: 'Error mostrando los usuarioss'
                })
            }
            usuarios.forEach((usuario2) => {
                if (usuario_usuarios == usuario2.usuario_usuarios){
                    bandera = 1
                    falla_usuario_usuario = "Ya existe el usuario " + usuario2.usuario_usuarios +  " registrado en el sistema" 
                }
            })

            if(bandera == 1){
                const usur = new UsuariosRid({
                    cedula_usuariosrids: _id,
                    nombre_usuariosrids: nombre_usuarios,
                    usuario_usuariosrids: usuario_usuarios,
                    falla_usuariosrids: falla_usuario_usuario, 
                    fecha_usuariosrids: fecha
                })
    
                usur.save(function(error,usur){
                    if(error){
                        return res.status(500).json({
                            message: 'Error al crear el usuario rechazado usuario'
                        })
                    }
                })
            }

            if(bandera == 0 ){
                Usuarios.findByIdAndUpdate(_id, {nombre_usuarios, email_usuarios, usuario_usuarios, password_usuarios}, (error, usuario)=>{
                    if(error){
                        return res.status(500).json({
                            message: 'Error al modificar el Usuario'
                        })
                    } 
                })
            }
        }) 
        res.redirect('/usuarios')
        
    } catch (error) {
      console.log(error)  
    }
}

//eliminar
module.exports.eliminar = (req, res) => {
    console.log("==========================".yellow)
    console.log("  METODO ELIMINAR USUARIO ".red)
    console.log("==========================".yellow)
    const _id = req.params._id
    Usuarios.findByIdAndRemove(_id, (error,usuario)=>{
        if(error){
            return res.status(500).json({
                message: 'Error al eliminar el usuario'
            })
        }
    })
    res.redirect('/usuarios')
}

module.exports.limpiar = (req, res) => {
    console.log("===================================".yellow)
    console.log("METODO LIMPIAR USUARIOS RECHAZADOS".red)
    console.log("===================================".yellow)
    UsuariosRid.remove({},(error)=>{
        if(error){
            return res.status(500).json({
            message: 'error al limpiar los usuarios rechazados'
            })
        }
        res.redirect('/usuarios')
    }) 
}
