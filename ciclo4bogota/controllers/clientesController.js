const Clientes = require('../model/Clientes')
const ClientesRid = require('../model/ClientesRid')
const Ventas = require('../model/Ventas')
const csvtojson = require('csvtojson')
const db1 = require('../database/db')
const db2 = require('../database/db')

//mostrar metodos de la api
module.exports.mostrar = (req, res)=>{
    console.log("==========================".yellow)
    console.log("  METODO BUSCAR CLIENTES  ".red)
    console.log("==========================".yellow)
    usuario = req.user
    Clientes.find({},(error, clientes)=>{
        if(error){
            return res.status(500).json({
                message: 'Error mostrando los clientes'
            })
        }
        ClientesRid.find({},(error, clientesrids)=>{
            if(error){
                return res.status(500).json({
                message: 'Error mostrando los clientes rechazados'
                })
            }   
            return res.render('clientes',{clientes: clientes, clientesrids: clientesrids, usuario})
        })
    })
}

//cargar archivo
module.exports.cargar = (req, res)=>{
    console.log("===================".yellow)
    console.log(" METODO CARGAR CSV ".red)
    console.log("===================".yellow)
    const archivo = __dirname + "\\archivos\\clientes.csv"
    const clientesCorrectos = []
    const clientesrid = []
    bandera_cedula = 0
    
    var fecha = ""
    var fechaTemp = new Date()
    options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour:'numeric', minute: 'numeric',
                second:'numeric'}
    fecha = fechaTemp.toLocaleDateString("es-CO",options)

    csvtojson().fromFile(archivo).then(source => {
    Clientes.find({},(error, clientes)=>{
        if(error){
            return res.status(500).json({
            message: 'Error al buscar los clientes'
        })
    }

    for (var i = 0; i < source.length; i++) {
        var oneRow = {
            _id: source[i]['cedula_clientes'],
            direccion_clientes: source[i]['direccion_clientes'],
            email_clientes: source[i]['email_clientes'],
            nombre_clientes: source[i]['nombre_clientes'],
            telefono_clientes: source[i]['telefono_clientes']
        }
        bandera_cedula = 0
        clientes.forEach((cliente) => {
            if (oneRow._id == cliente._id )
            {
                var clir = {
                cedula_clientesrids: oneRow._id,
                nombre_clienterids: oneRow.nombre_clientes,
                falla_clientesrids: "El cliente con cedula "+ oneRow._id +" ya existe en el sistema",
                fecha_clientesrids: fecha
            }
            bandera_cedula= 1
            clientesrid.push(clir);
            }
        })

        if (bandera_cedula == 0 )
        {
            clientesCorrectos.push(oneRow);
        }
        
        } //aqui termina la verificacion de los datos del archivo CSV para empezar a grabar
        
        const collectionName1 = 'db_clientes'
        var collection1 = db1.collection(collectionName1)
        collection1.insertMany(clientesCorrectos, (err, result) => {
            if (err) console.log(err)
            if(result){
                console.log('grabo lo datos de forma existosa')
            }
        }) //aqui se graban los dato que no tuvieron error

        const collectionName2 = 'db_clientesrids'
        var collection2 = db2.collection(collectionName2)
        collection2.insertMany(clientesrid, (err, result) => {
            if (err) console.log(err)
            if(result){
                console.log('grabo lo datos de forma existosa')
            }
        }) //aqui se graban los datos que tuvieron error en una tabla aparte para mostrarlos al usuario
    })
})
res.redirect('/clientes')
} 

//crear
module.exports.crear = (req, res)=>{
    console.log("==========================".yellow)
    console.log("  METODO CREAR CLIENTE ".red)
    console.log("==========================".yellow)
    var bandera = 0;

    var fecha = ""
    var fechaTemp = new Date()
    options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour:'numeric', minute: 'numeric',
                second:'numeric'}
    fecha = fechaTemp.toLocaleDateString("es-CO",options)

    const clientetemp = new Clientes({
        _id: req.body.txtCedula,
        direccion_clientes: req.body.txtDireccion,
        email_clientes: req.body.txtCorreo,
        nombre_clientes: req.body.txtNombre,
        telefono_clientes: req.body.txtTelefono
    })

    Clientes.find({},(error, clientes)=>{
        if(error){
            return res.status(500).json({
                message: 'Error mostrando los clientes'
            })
        }
    clientes.forEach((cliente) => {
        if (clientetemp._id == cliente._id){
            bandera = 1
            res.redirect('/clientes')
        }
    })

    if (bandera == 1) {
        var clir = new ClientesRid({
            cedula_clientesrids: req.body.txtCedula,
            nombre_clienterids: req.body.txtNombre,
            falla_clientesrids: "El cliente con cedula " + req.body.txtCedula +" ya existe en el sistema", 
            fecha_clientesrids: fecha
        })

        clir.save(function(error,usur){
            if(error){
                return res.status(500).json({
                    message: 'Error al crear el cliente rechazado'
                })
            }        
        })
    }
    
    if (bandera == 0){
        clientetemp.save(function(error,clientetemp){
            if(error){
                return res.status(500).json({
                    message: 'Error al crear el Cliente'
                })
            }
            res.redirect('/clientes')  
        }) // cierra la funcion de grabar el cliente
    }
    })// cierra la funcion de traer toda la lista de clientes
}

//modificar
module.exports.modificar = (req, res)=>{
    console.log("==========================".yellow)
    console.log(" METODO MODIFICAR CLIENTE ".red)
    console.log("==========================".yellow)
    const _id = req.body.txtCedula_editar
    const direccion_clientes = req.body.txtDireccion_editar
    const email_clientes = req.body.txtCorreo_editar
    const nombre_clientes = req.body.txtNombre_editar   
    const telefono_clientes =  req.body.txtTelefono_editar
    Clientes.findByIdAndUpdate(_id, {direccion_clientes,email_clientes,nombre_clientes,telefono_clientes}, (error, cliente)=>{
        if(error){
            return res.status(500).json({
                message: 'Error al modificar el Cliente'
            })
        }
    })
    res.redirect('/clientes')
}

//eliminar
module.exports.eliminar = (req, res) => {
    console.log("==========================".yellow)
    console.log("  METODO ELIMINAR CLIENTE ".red)
    console.log("==========================".yellow)
    const _id = req.params._id
    var bandera = 0

    Ventas.find({},(error,ventas)=>{
        if(error){
            return res.status(500).json({
                message: 'Error mostrando las ventas'
            })
        }
        
        ventas.forEach((venta) => {
            if (_id == venta.cedula_cliente_ventas) {
                bandera = 1
            }  
        })

        if (bandera == 0) {
            Clientes.findByIdAndRemove(_id, (error,cliente)=>{
                if(error){
                    return res.status(500).json({
                        message: 'Error al eliminar el Cliente'
                    })
                }
            })
        }   
    res.redirect('/clientes')
    })
}

module.exports.limpiar = (req, res) => {
    console.log("===================================".yellow)
    console.log("METODO LIMPIAR CLIENTES RECHAZADOS".red)
    console.log("===================================".yellow)
    ClientesRid.remove({},(error)=>{
        if(error){
            return res.status(500).json({
            message: 'error al limpiar los clientes rechazados'
            })
        }
        res.redirect('/clientes')
    }) 
}

