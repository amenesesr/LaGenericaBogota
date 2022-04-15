const Productos = require('../model/Productos')
const ProductosRid = require('../model/ProductosRid')
const Proveedores = require('../model/Proveedores')
const csvtojson = require('csvtojson')
const db1 = require('../database/db')
const db2 = require('../database/db')
const Ventas = require('../model/Ventas')

//mostrar metodos de la api
module.exports.mostrar = (req, res)=>{
    console.log("==========================".yellow)
    console.log(" METODO MOSTRAR PRODUCTOS ".red)
    console.log("==========================".yellow)
    usuario = req.user
    Productos.find({},(error, productos)=>{
    if(error){
        return res.status(500).json({
        message: 'Error mostrando los productos'
        })
    }  
        ProductosRid.find({},(error, productosrid)=>{
            if(error){
                return res.status(500).json({
                message: 'Error mostrando los productos'
                })
            }
            console.log(productos)
            return res.render('productos',{productos: productos, productosrid: productosrid, usuario}) 
        })  
    })
}

//cargar archivo
module.exports.cargar = (req, res)=>{
    console.log("==========================".yellow)
    console.log("     METODO CARGAR CSV ".red)
    console.log("==========================".yellow)
    const archivo = __dirname + "\\archivos\\productos.csv"
    const productosCorrectos = []
    const productosrid = []
    bandera_producto = 0
    bandera_proveedor = 0

    var fecha = ""
    var fechaTemp = new Date()
    options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour:'numeric', minute: 'numeric',
                second:'numeric'}
    fecha = fechaTemp.toLocaleDateString("es-CO",options)

    csvtojson().fromFile(archivo).then(source => {
    Productos.find({},(error, productos)=>{
        if(error){
            return res.status(500).json({
            message: 'Error al buscar los productos'
        })
    }
    Proveedores.find({},(error, proveedores)=>{
        if(error){
            return res.status(500).json({
                message: 'Error mostrando los proveedores'
            })
        }

    for (var i = 0; i < source.length; i++) {
        var oneRow = {
            _id: source[i]['codigo_productos'],
            ivacompra_productos: source[i]['ivacompra_productos'],
            nitproveedor_productos: source[i]['nitproveedor_productos'],
            nombre_productos: source[i]['nombre_productos'],
            precio_compra_productos: source[i]['precio_compra_productos'],
            precio_venta_productos: source[i]['precio_venta_productos']
        }

        bandera_producto = 0
        productos.forEach((producto) => {
        if (oneRow._id == producto._id )
        {
            var prodr = {
                codigo_productosrids: producto._id,
                nombre_productosrids: oneRow.nombre_productos,
                nitproveedor_productosrids: oneRow.nitproveedor_productos,
                falla_productosrids: "Codigo del producto "+ producto._id+" ya existe",
                fecha_productosrids: fecha
            }
            bandera_producto = 1
            productosrid.push(prodr);
        }
        })

        bandera_proveedor = 0
        proveedores.forEach((proveedor) => {
        if (oneRow.nitproveedor_productos == proveedor._id )
        {
            bandera_proveedor = 1
        }
        })

        if (bandera_proveedor == 0)
        {
            var prodr = {
                codigo_productosrids: oneRow._id,
                nombre_productosrids: oneRow.nombre_productos,
                nitproveedor_productosrids: oneRow.nitproveedor_productos,
                falla_productosrids: "Proveedor con NIT "+oneRow.nitproveedor_productos+" no existe", 
                fecha_productosrids: fecha 
            }
            productosrid.push(prodr);
        }

        if (bandera_producto == 0 && bandera_proveedor == 1)
        {
            productosCorrectos.push(oneRow);
        }
    
    } //aqui termina la verificacion de los datos del archivo CSV para empezar a grabar
        
    const collectionName1 = 'db_productos'
    var collection1 = db1.collection(collectionName1)
    collection1.insertMany(productosCorrectos, (err, result) => {
        if (err) console.log(err)
        if(result){
        }
    }) //aqui se graban los dato que no tuvieron error

    const collectionName2 = 'db_productosrids'
    var collection2 = db2.collection(collectionName2)
    collection2.insertMany(productosrid, (err, result) => {
        if (err) console.log(err)
        if(result){
        }
    }) //aqui se graban los datos que tuvieron error en una tabla aparte para mostrarlos al usuario
})
})
})
res.redirect('/productos')
} 

//crear
module.exports.crear = (req, res)=>{
    console.log("==========================".yellow)
    console.log("  METODO CREAR PRODUCTO".red)
    console.log("==========================".yellow)
    var bandera_producto = 0
    var bandera_proveedor = 0

    var fecha = ""
    var fechaTemp = new Date()
    options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour:'numeric', minute: 'numeric',
                second:'numeric'}
    fecha = fechaTemp.toLocaleDateString("es-CO",options)

    const producto = new Productos({
        _id: req.body.txtCodigo,
        ivacompra_productos: req.body.txtIVA,
        nitproveedor_productos: req.body.txtNIT,
        nombre_productos: req.body.txtNombre,
        precio_compra_productos: req.body.txtCompra,
        precio_venta_productos: req.body.txtVenta 
    })

    Productos.find({},(error, productos)=>{
        if(error){
            return res.status(500).json({
            message: 'Error al buscar los productos'
        })
    }

    productos.forEach((producto2) => {
        if (producto2._id == producto._id )
        {
            bandera_producto = 1
        }
    })

    Proveedores.find({},(error, proveedores)=>{
        if(error){
            return res.status(500).json({
                message: 'Error mostrando los proveedores'
            })
        }
    
    proveedores.forEach((proveedor) => {
        if (producto.nitproveedor_productos == proveedor._id )
        {
            bandera_proveedor = 1
        }
    })

    if (bandera_producto == 1) {
        var prodr = new ProductosRid({
            codigo_productosrids: producto._id,
            nombre_productosrids: producto.nombre_productos,
            nitproveedor_productosrids: producto.nitproveedor_productos,
            falla_productosrids: "Codigo del producto "+ producto._id +" ya existe",
            fecha_productosrids: fecha
        })
        prodr.save(function(error,prodr){ 
            if(error){
                return res.status(500).json({
                    message: 'Error al crear el producto rechazado'
                })
            }
        })
    }

    if (bandera_proveedor == 0) {
        var prodr = new ProductosRid({
            codigo_productosrids: producto._id,
            nombre_productosrids: producto.nombre_productos,
            nitproveedor_productosrids: producto.nitproveedor_productos,
            falla_productosrids: "El proveedor "+ producto.nitproveedor_productos +" no existe en la base de datos",
            fecha_productosrids: fecha
        })
        prodr.save(function(error,prodr){ 
            if(error){
                return res.status(500).json({
                    message: 'Error al crear el producto rechazado'
                })
            }
        })
    }
   
    
    if (bandera_producto == 0 && bandera_proveedor == 1){
        producto.save(function(error,producto){ 
            if(error){
                return res.status(500).json({
                    message: 'Error al crear el producto'
                })
            }
           
        })//cierra la funcion que graba el producto    
    }
    })//cierra la funcion de la lista de proveedores
    res.redirect('/productos')
    })//cierrra la funcion de la lista de productos
   
} //cierra toda la funcion
  

//modificar
module.exports.modificar = (req, res)=>{
    console.log("==========================".yellow)
    console.log("METODO MODIFICAR PRODUCTO".red)
    console.log("==========================".yellow)
    const _id = req.body.txtCodigo_editar
    const ivacompra_productos = req.body.txtIVA_editar
    const nitproveedor_productos = req.body.txtNIT_editar
    const nombre_productos = req.body.txtNombre_editar
    const precio_compra_productos =  req.body.txtPrecioCompra_editar
    const precio_venta_productos =  req.body.txtPrecioVenta_editar

    var bandera_proveedor = 0

    var fecha = ""
    var fechaTemp = new Date()
    options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour:'numeric', minute: 'numeric',
                second:'numeric'}
    fecha = fechaTemp.toLocaleDateString("es-CO",options)

    Proveedores.find({},(error, proveedores)=>{
        if(error){
            return res.status(500).json({
                message: 'Error mostrando los proveedores'
            })
        }
    
        proveedores.forEach((proveedor) => {
            if (nitproveedor_productos == proveedor._id )
            {
                bandera_proveedor = 1
            }
        })

        if (bandera_proveedor == 0) {
            var prodr = new ProductosRid({
                codigo_productosrids: _id,
                nombre_productosrids: nombre_productos,
                nitproveedor_productosrids: nitproveedor_productos,
                falla_productosrids: "El proveedor "+ nitproveedor_productos +" no existe en la base de datos",
                fecha_productosrids: fecha
            })
            prodr.save(function(error,prodr){ 
                if(error){
                    return res.status(500).json({
                        message: 'Error al crear el producto rechazado'
                    })
                }
            })
        }

        if (bandera_proveedor == 1) {
            Productos.findByIdAndUpdate(_id, {ivacompra_productos, nitproveedor_productos, nombre_productos, precio_compra_productos, precio_venta_productos}, (error, producto)=>{
                if(error){
                    return res.status(500).json({
                        message: 'Error al modificar el Producto'
                    })
                }
            
            })
        }  
        res.redirect('/productos')
    })
   
}

//eliminar
module.exports.eliminar = (req, res) => {
    console.log("==========================".yellow)
    console.log("  METODO ELIMINAR PRODUCTO".red)
    console.log("==========================".yellow)
    const _id = req.params._id
    var bandera = 0
    productos_ventas = []
    prod = []

    Ventas.find({},(error, ventas)=>{
        if(error){
            return res.status(500).json({
                message: 'Error mostrando las ventas'
            })
        }
        ventas.forEach((venta) => {
            productos_ventas.push(venta.detalle_ventas)
        })
        productos_ventas.forEach((producto_venta) => {
            for (let i = 0; i < producto_venta.length; i++) {
                prod.push(producto_venta[i].codigo_producto_detalle_ventas)
            }
        })
        prod.forEach((pro) => {
           if (pro == _id) {
               bandera = 1
           }
        })
        if (bandera == 0) {
            Productos.findByIdAndRemove(_id, (error,producto)=>{
                if(error){
                    return res.status(500).json({
                        message: 'Error al eliminar el Producto'
                    })
                }
                    
            })
        }
        
    })
    res.redirect('/productos')
}

module.exports.limpiar = (req, res) => {
    console.log("===================================".yellow)
    console.log("METODO LIMPIAR PRODUCTOS RECHAZADOS".red)
    console.log("===================================".yellow)
    ProductosRid.remove({},(error)=>{
        if(error){
            return res.status(500).json({
            message: 'error al limpiar los productos rechazados'
            })
        }
        res.redirect('/productos')
    }) 
}


