const mongoose = require('mongoose')
const Schema = mongoose.Schema

const productosSchema = new Schema({
    _id: String,
    ivacompra_productos: Number,
    nitproveedor_productos: Number,
    nombre_productos: String,
    precio_compra_productos: Number,
    precio_venta_productos: Number  
}, {versionKey:false})

module.exports = mongoose.model('db_productos',productosSchema)

