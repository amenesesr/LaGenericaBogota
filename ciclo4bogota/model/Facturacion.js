const mongoose = require('mongoose')
const Schema = mongoose.Schema

const facturacionSchema = new Schema({
    _id:String,
    codigo_venta_ventas:Number,
    cantidad_producto_detalle_ventas: Number,
    codigo_producto_detalle_ventas: Number,
    nombre_producto_detalle_ventas: String,
    valor_producto_detalle_ventas: Number,
    valor_total_detalle_ventas: Number,
    valor_venta_detalle_ventas: Number,
    valoriva_detalle_ventas: Number       
}, {versionKey:false})

module.exports = mongoose.model('db_facturacion', facturacionSchema)

