const Ventas = require('../model/Ventas')
const DetalleVentas = require('../model/DetalleVentas')
const Clientes = require('../model/Clientes')
const Productos = require('../model/Productos')
const db = require('../database/db')

//cargar pagina ventas
module.exports.cargar = (req, res)=>{
    console.log("==========================".yellow)
    console.log("   METODO CARGAR VENTAS"   .red)
    console.log("==========================".yellow)
    usuario = req.user
    const txtCedula = ""
    const txtCodigo = ""
    const txtCantidad = ""
    var totalfinal = 0
    var totalparcial = 0
    var totaliva = 0
    var totalparcial = 0
    var incrementoiva = 0
    var totalparcialconiva = 0
    var txtNombreCliente = ""
    var txtNombreProducto = ""
    var txtValorProducto = 0
    var txtIVAProducto = 0
    var txtConsecutivo = 0 
    var valoriva = 0

    Ventas.find({},(error, ventas)=>{
        if(error){
            return res.status(500).json({
            message: 'Error al buscar las ventas'
            })
        }
 
    ventas.forEach((venta) => {
        if (txtConsecutivo < venta.codigo_venta_ventas )
        {
            txtConsecutivo = venta.codigo_venta_ventas       
        }
    })
    txtConsecutivo += 1
        DetalleVentas.find({},(error, detalles)=>{
            if(error){
                return res.status(500).json({
                message: 'Error mostrando los detalle ventas'
                })
            }

            return res.render('ventas',{detalles: detalles, txtCedula, txtNombreCliente, totalfinal, txtConsecutivo, totalparcial, totaliva, usuario})
        })                               
    })                                     
}

module.exports.nuevaventa = (req, res) => {
    DetalleVentas.remove({},(error)=>{
        if(error){
            return res.status(500).json({
            message: 'error al eliminar los detalle ventas'
            })
        }
        console.log("==========================".yellow)
        console.log("    METODO NUEVA VENTA".red)
        console.log("==========================".yellow)
        res.redirect('/ventas')
    }) 
}


module.exports.cedulacliente = (req, res) => {
    console.log("==========================".yellow)
    console.log("METODO REGISTRAR PRODUCTO".red)
    console.log("==========================".yellow)
    const txtCedula = req.body.txtcedula_cliente_ventas
    const txtCodigo = req.body.txtcodigo_producto_detalle_ventas
    const txtCantidad = req.body.txtcantidad_producto_detalle_ventas
    var totalfinal = 0
    var totalparcial = 0
    var totaliva = 0
    var incrementoiva = 0
    var totalparcialconiva = 0
    var txtNombreCliente = "CLIENTE NO REGISTRADO"
    var txtNombreProducto = "PRODUCTO NO EXISTE"
    var txtValorProducto = 0
    var txtIVAProducto = 0
    var txtConsecutivo = 0 
    var valoriva = 0
   
    //saca la lista de loc clientes para sacar el nombre
    Clientes.find({},(error, clientes)=>{
        if(error){
            return res.status(500).json({
                message: 'Error al buscar el cliente'
            })
        }

        clientes.forEach((cliente) => {
            if (cliente._id === txtCedula)
            {
                txtNombreCliente = cliente.nombre_clientes        
            }
        })
        
            //calcula el consecutivo
            Ventas.find({},(error, ventas)=>{
                if(error){
                    return res.status(500).json({
                    message: 'Error al buscar las ventas'
                    })
                }
 
                ventas.forEach((venta) => {
                    if (txtConsecutivo < venta.codigo_venta_ventas )
                    {
                        txtConsecutivo = venta.codigo_venta_ventas       
                    }
                })
                txtConsecutivo += 1

                    //Saca la lista de los productos para sacar el valor, nombre, IVA
                    Productos.find({},(error, productos)=>{
                        if(error){
                            return res.status(500).json({
                            message: 'Error mostrando los productos'
                            })
                        }
   
                        productos.forEach((producto) => {
                            if (txtCodigo  === producto._id)
                            {
                                txtNombreProducto = producto.nombre_productos
                                txtValorProducto = producto.precio_venta_productos
                                txtIVAProducto = producto.ivacompra_productos
                            }
                        })

                
                        totalparcial = txtCantidad * txtValorProducto
                        incrementoiva = Math.round(totalparcial * (txtIVAProducto / 100))
                        totalparcialconiva = totalparcial + incrementoiva
                        valoriva = totalparcialconiva - totalparcial
                        totalfinal += totalparcialconiva

                        const detalleventa = new DetalleVentas({
                            codigo_venta_ventas:txtConsecutivo,
                            cantidad_producto_detalle_ventas:txtCantidad,
                            codigo_producto_detalle_ventas:txtCodigo,
                            nombre_producto_detalle_ventas: txtNombreProducto,
                            valor_producto_detalle_ventas: txtValorProducto,
                            valor_total_detalle_ventas:totalparcialconiva,
                            valor_venta_detalle_ventas:totalparcial,
                            valoriva_detalle_ventas:valoriva
                        })

                        const collectionName = 'db_detalleventas'
                        var collection = db.collection(collectionName)
                        collection.insertOne(detalleventa, (err, result) => {
                        if (err) console.log(err)
                            if(result){

                            }
                        })
                       
                        totalparcial = 0
                        totaliva = 0
                        totalfinal = 0
                        DetalleVentas.find({},(error, detalles)=>{
                            if(error){
                                return res.status(500).json({
                                message: 'Error mostrando los detalle ventas'
                                })
                            }
                            detalles.forEach((detalle) => {
                                totalparcial += detalle.valor_venta_detalle_ventas
                                totaliva += detalle.valoriva_detalle_ventas
                                totalfinal += detalle.valor_total_detalle_ventas
                            })
                           
                            
                            return res.render('ventas',{detalles: detalles, txtCedula, txtNombreCliente, totalfinal, txtConsecutivo, totalparcial, totaliva })
                        })    
                    })
            })
    }) 
}

module.exports.registrar = (req, res)=>{
    console.log("==========================".yellow)
    console.log(" METODO REGISTRAR VENTA".red)
    console.log("==========================".yellow)

    var txtConsecutivo = 0
    var totalparcial = 0
    var totaliva = 0
    var totalfinal = 0

    var txtCedula = req.body.txtcedula

    var txtNombreCliente = "No Registrado" 
    var txtdireccionCliente = "No Registrado" 
    var txtTelefonoCliente = 0   
    var txtemailCliente = "No Registrado"   
    
    var fecha = new Date();
    options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour:'numeric', minute: 'numeric',
                second:'numeric'}
    fecha.toLocaleDateString("es-CO",options)

    Ventas.find({},(error, ventas)=>{
        if(error){
            return res.status(500).json({
            message: 'Error al buscar las ventas'
            })
        }
        ventas.forEach((venta) => {
            if (txtConsecutivo < venta.codigo_venta_ventas )
            {
                txtConsecutivo = venta.codigo_venta_ventas       
            }
        })
        txtConsecutivo += 1
        
    DetalleVentas.find({},(error, detalles)=>{
        if(error){
            return res.status(500).json({
            message: 'Error mostrando los detalle ventas'
            })
        }
        totalparcial = 0
        totaliva = 0
        totalfinal = 0
        detalles.forEach((detalle) => {
            totalparcial += detalle.valor_venta_detalle_ventas
            totaliva += detalle.valoriva_detalle_ventas
            totalfinal += detalle.valor_total_detalle_ventas
        })
    
        if(totalfinal == 0)
        {

        }
        else
        {
            const venta = new Ventas({
                codigo_venta_ventas: txtConsecutivo,
                cedula_cliente_ventas: req.body.txtcedula,
                detalle_ventas: detalles,
                ivaventas_ventas: totaliva,
                total_venta_ventas: totalfinal,
                valor_venta_ventas: totalparcial,
                fechahora_venta_ventas: fecha
            })

  
                const collectionName = 'db_ventas';
                var collection = db.collection(collectionName);
                collection.insertOne(venta, (err, result) => {
                if (err) console.log(err);
                    if(result){

                    }
                
                DetalleVentas.remove({},(error)=>{
                if(error){
                    return res.status(500).json({
                    message: 'error al eliminar los detalle ventas'
                    })
                }

                Clientes.find({},(error, clientes)=>{
                        if(error){
                            return res.status(500).json({
                                message: 'Error al buscar el cliente'
                            })
                        }
 
                        clientes.forEach((cliente) => {
                            if (cliente._id === txtCedula)
                            {
                                txtNombreCliente = cliente.nombre_clientes 
                                txtdireccionCliente = cliente.direccion_clientes 
                                txtTelefonoCliente = cliente.telefono_clientes   
                                txtemailCliente = cliente.email_clientes         
                            }
                        })
                    res.render('factura',{venta,detalles: detalles,txtNombreCliente, txtdireccionCliente, txtTelefonoCliente, txtemailCliente, fecha})
                    }) 
                }) 
            })              
        }
           
    })
})
}

module.exports.eliminar = (req, res) => {
    const _id = req.params._id
    DetalleVentas.findByIdAndRemove(_id, (error,detalle)=>{

        if(error){
            return res.status(500).json({
                message: 'Error al eliminar la venta'
            })
        }
        console.log("====================================".yellow)
        console.log(" METODO ELIMINAR PRODUCTO DE VENTAS ".red)
        console.log("====================================".yellow)
        res.redirect('/ventas')
    })
}
