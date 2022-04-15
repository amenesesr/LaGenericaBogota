const mongoose = require('mongoose')
const Schema = mongoose.Schema

//var conn = require('../db')

const ventasSchema = new Schema({
    _id:String,
    codigo_venta_ventas:Number,
    cedula_cliente_ventas: String,
    detalle_ventas:[{ 
        _id:String,
        codigo_venta_ventas:Number,
        cantidad_producto_detalle_ventas: Number,
        codigo_producto_detalle_ventas: Number,
        nombre_producto_detalle_ventas: String,
        valor_producto_detalle_ventas: Number,
        valor_total_detalle_ventas: Number,
        valor_venta_detalle_ventas: Number,
        valoriva_detalle_ventas: Number   
    }],
    ivaventas_ventas:Number,
    total_venta_ventas:Number,
    valor_venta_ventas:Number,
    fechahora_venta_ventas:String
}, {versionKey:false})

module.exports = mongoose.model('db_ventas',ventasSchema)

/*let venta = conn.Ciclo4A_BOGOTA.model.('db_ventas',ventasSchema)

module.exports = venta*/