const Proveedores = require('../model/Proveedores')
const ProveedoresRid = require('../model/ProveedoresRid')
const csvtojson = require('csvtojson')
const db1 = require('../database/db')
const db2 = require('../database/db')
const Productos = require('../model/Productos')

//mostrar metodos de la api
module.exports.mostrar = (req, res)=>{
    console.log("==========================".yellow)
    console.log(" METODO BUSCAR PROVEEDOR ".red)
    console.log("==========================".yellow)
    usuario = req.user
    Proveedores.find({},(error, proveedores)=>{
        if(error){
            return res.status(500).json({
                message: 'Error mostrando los proveedores'
            })
        }
    
    ProveedoresRid.find({},(error, proveedoresrids)=>{
        if(error){
            return res.status(500).json({
                message: 'Error mostrando los proveedores rechazados'
            })
        }
        return res.render('proveedores',{proveedores: proveedores, proveedoresrids: proveedoresrids,usuario})
    })
    
})
}

//cargar archivo
module.exports.cargar = (req, res)=>{
    console.log("==========================".yellow)
    console.log("     METODO CARGAR CSV ".red)
    console.log("==========================".yellow)
    const archivo = __dirname + "\\archivos\\proveedores.csv"
    const proveedoresCorrectos = []
    const proveedoresrid = []
    bandera_proveedor = 0

    var fecha = ""
    var fechaTemp = new Date()
    options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour:'numeric', minute: 'numeric',
                second:'numeric'}
    fecha = fechaTemp.toLocaleDateString("es-CO",options)

    csvtojson().fromFile(archivo).then(source => {
    Proveedores.find({},(error, proveedores)=>{
        if(error){
            return res.status(500).json({
                message: 'Error mostrando los proveedores'
            })
        }

    for (var i = 0; i < source.length; i++) {
        var oneRow = {
            _id: source[i]['nit_proveedores'],
            nombre_proveedores: source[i]['nombre_proveedores'],
            ciudad_proveedores: source[i]['ciudad_proveedores'],
            direccion_proveedores: source[i]['direccion_proveedores'],
            telefono_proveedores: source[i]['telefono_proveedores']
        }

        bandera_proveedor = 0
        proveedores.forEach((proveedor) => {
            if (oneRow._id == proveedor._id )
            {
                bandera_proveedor = 1
            }
        })

        if (bandera_proveedor == 0)
        {
            proveedoresCorrectos.push(oneRow);
        }

        if (bandera_proveedor == 1)
        {
            var provr = {
                nit_proveedoresrids: oneRow._id,
                nombre_proveedoresrids: oneRow.nombre_proveedores,
                falla_proveedoresrids: "El NIT "+oneRow.nombre_proveedores+" ya existe en la base de datos", 
                fecha_proveedoresrids: fecha 
            }
            proveedoresrid.push(provr);
        }
    
    } //aqui termina la verificacion de los datos del archivo CSV para empezar a grabar
        
    const collectionName1 = 'db_proveedores'
    var collection1 = db1.collection(collectionName1)
    collection1.insertMany(proveedoresCorrectos, (err, result) => {
        if (err) console.log(err)
        if(result){
        }
    }) //aqui se graban los dato que no tuvieron error

    const collectionName2 = 'db_proveedoresrids'
    var collection2 = db2.collection(collectionName2)
    collection2.insertMany(proveedoresrid, (err, result) => {
        if (err) console.log(err)
        if(result){
        }
    }) //aqui se graban los datos que tuvieron error en una tabla aparte para mostrarlos al usuario
})

})
res.redirect('/proveedores')
} 

//crear
module.exports.crear = (req, res)=>{
    console.log("==========================".yellow)
    console.log("  METODO CREAR PROVEEDOR ".red)
    console.log("==========================".yellow)
    var bandera = 0
    var fecha = ""
    var fechaTemp = new Date()
    options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour:'numeric', minute: 'numeric',
                second:'numeric'}
    fecha = fechaTemp.toLocaleDateString("es-CO",options)
    const proveedortemp = new Proveedores({
        _id: req.body.txtNIT,
        nombre_proveedores: req.body.txtNombre,
        ciudad_proveedores: req.body.txtCiudad,
        direccion_proveedores: req.body.txtDireccion,
        telefono_proveedores: req.body.txtTelefono 
    })

    Proveedores.find({},(error, proveedores)=>{
        if(error){
            return res.status(500).json({
                message: 'Error mostrando los proveedores'
            })
        }
    proveedores.forEach((proveedor) => {
        if (proveedortemp._id == proveedor._id){
            bandera = 1
            res.redirect('/proveedores')
        }
    })
    
    if (bandera == 0){
        proveedortemp.save(function(error,proveedortemp){
            if(error){
                return res.status(500).json({
                    message: 'Error al crear el proveedor'
                })
            }
            res.redirect('/proveedores')
        }) // cierra la funcion de grabar el cliente
    }

    if (bandera == 1) {
        var provr = new ProveedoresRid({
            nit_proveedoresrids: proveedortemp._id,
            nombre_proveedoresrids: proveedortemp.nombre_proveedores,
            falla_proveedoresrids: "Ya existe un proveedor con NIT "+ proveedortemp._id +" en la base de datos.",
            fecha_proveedoresrids: fecha
        })
        provr.save(function(error,provr){ 
            if(error){
                return res.status(500).json({
                    message: 'Error al crear el proveedor rechazado'
                })
            }
        })
    }

    
    })// cierra la funcion de traer toda la lista de clientes
}

//modificar
module.exports.modificar = (req, res)=>{
    console.log("==========================".yellow)
    console.log("METODO MODIFICAR PROVEEDOR ".red)
    console.log("==========================".yellow)
    const _id = req.body.txtNIT_editar
    const direccion_proveedores = req.body.txtDireccion_editar
    const ciudad_proveedores = req.body.txtCiudad_editar
    const nombre_proveedores = req.body.txtNombre_editar   
    const telefono_proveedores =  req.body.txtTelefono_editar

    Proveedores.findByIdAndUpdate(_id, {nombre_proveedores, ciudad_proveedores, direccion_proveedores, telefono_proveedores}, (error, proveedor)=>{
        if(error){
            return res.status(500).json({
                message: 'Error al modificar el proveedor'
            })
        }
    })
    res.redirect('/proveedores')
}

//eliminar
module.exports.eliminar = (req, res) => {
    console.log("==========================".yellow)
    console.log("METODO ELIMINAR PROVEEDOR ".red)
    console.log("==========================".yellow)
    const _id = req.params._id
    var bandera = 0

    Productos.find({},(error,productos)=>{
        if(error){
            return res.status(500).json({
                message: 'Error mostrando los productos'
            })
        }

        productos.forEach((producto) => {
            if (_id == producto.nitproveedor_productos) {
                bandera = 1
            }  
        })
            
        if (bandera == 0) {
            Proveedores.findByIdAndRemove(_id, (error,proveedores)=>{
                if(error){
                    return res.status(500).json({
                        message: 'Error al eliminar el Proveedores'
                    })
                }
            })
        }
                
    res.redirect('/proveedores')
    })  
}

module.exports.limpiar = (req, res) => {
    console.log("===================================".yellow)
    console.log("METODO LIMPIAR PRODUCTOS RECHAZADOS".red)
    console.log("===================================".yellow)
    ProveedoresRid.remove({},(error)=>{
        if(error){
            return res.status(500).json({
            message: 'error al limpiar los proveedores rechazados'
            })
        }
       
        res.redirect('/proveedores')
    }) 
}