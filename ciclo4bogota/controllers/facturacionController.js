
const Ventas = require('../model/Ventas')
const Facturacion = require('../model/Facturacion')
const Clientes = require('../model/Clientes')

module.exports.mostrar = (req, res)=>{
    console.log("========================")
    console.log(" METODO MOSTRAR FACTURA ")
    console.log("========================")
    usuario = req.user

    var txtCedula = 0
    var totalparcial = 0
    var totaliva = 0
    var totalfinal = 0
    var atendidoPor = ""

    var nombre_producto = ""
    var valor_producto = 0

    var txtNombreCliente = ""
    var txtdireccionCliente = "" 
    var txtTelefonoCliente = 0   
    var txtemailCliente = ""         

    var facturas = []
    var error = 0
    var consecutivo = 0

    var venta= []
    var detalles= []

    var fecha = ""

    return res.render('facturacion',{usuario,consecutivo,txtCedula,totalparcial,venta,totaliva,txtTelefonoCliente, totalfinal, txtNombreCliente, txtdireccionCliente, txtemailCliente, detalles,fecha})
}

module.exports.consultar = (req, res)=>{
    console.log("========================")
    console.log(" METODO MOSTRAR FACTURA ")
    console.log("========================")
    usuario = req.user

    var txtCedula = 0
    var totalparcial = 0
    var totaliva = 0
    var totalfinal = 0

    var txtNombreCliente = ""
    var txtdireccionCliente = "" 
    var txtTelefonoCliente = 0   
    var txtemailCliente = ""         

    var detalles = []

    var consecutivo = req.body.txtConsecutivo

    Ventas.find({},(error, ventas)=>{
        if(error){
            return res.status(500).json({
                message: 'Error mostrando las ventas'
            })
        }
        ventas.forEach((venta) => {
            if (consecutivo == venta.codigo_venta_ventas){
                bandera = 1
                txtCedula = venta.cedula_cliente_ventas
                totalparcial = venta.valor_venta_ventas
                totaliva = venta.total_venta_ventas - venta.valor_venta_ventas 
                totalfinal = venta.total_venta_ventas
                fecha = venta.fechahora_venta_ventas
                
                venta.detalle_ventas.forEach((detalle_venta) => {
                    var prueba = new Facturacion({
                        codigo_venta_ventas: detalle_venta.codigo_venta_ventas,
                        cantidad_producto_detalle_ventas: detalle_venta.cantidad_producto_detalle_ventas,
                        codigo_producto_detalle_ventas: detalle_venta.codigo_producto_detalle_ventas,
                        nombre_producto_detalle_ventas:  detalle_venta.nombre_producto_detalle_ventas,
                        valor_producto_detalle_ventas:  detalle_venta.valor_producto_detalle_ventas,
                        valor_total_detalle_ventas:  detalle_venta.valor_total_detalle_ventas,
                        valor_venta_detalle_ventas:  detalle_venta.valor_venta_detalle_ventas,
                        valoriva_detalle_ventas:  detalle_venta.valoriva_detalle_ventas   
                    })
                    detalles.push(prueba)
                });
            }
        })

        Clientes.find({},(error,clientes)=>{
            if(error){
                return res.status(500).json({
                    message: 'Error mostrando las clientes'
                })
            }
            clientes.forEach((cliente) => {
                if(txtCedula == cliente._id){
                    txtNombreCliente = cliente.nombre_clientes
                    txtdireccionCliente = cliente.direccion_clientes
                    txtTelefonoCliente = cliente.telefono_clientes
                    txtemailCliente = cliente.email_clientes
                }
            })
            console.log('detalles ' + detalles)
            return res.render('facturacion',{usuario, consecutivo, totalparcial, totalfinal, totaliva, txtCedula, txtTelefonoCliente, txtNombreCliente, txtdireccionCliente, txtemailCliente, detalles:detalles, fecha})
        })
    })
    
}

