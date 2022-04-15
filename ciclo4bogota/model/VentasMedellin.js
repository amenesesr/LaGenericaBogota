const mongoose = require('mongoose')
const Schema = mongoose.Schema

var conn = require('../database/dbm')

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
        valor_producto_detalle_venta: Number,
        valor_total_detalle_ventas: Number,
        valor_venta_detalle_ventas: Number,
        valoriva_detalle_ventas: Number   
    }],
    ivaventas_ventas:Number,
    total_venta_ventas:Number,
    valor_venta_ventas:Number
}, {versionKey:false})

let venta = conn.Ciclo4A_MEDELLIN.model('db_ventas',ventasSchema)

module.exports = venta