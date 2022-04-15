const mongoose = require('mongoose')
const Schema = mongoose.Schema

const productosridSchema = new Schema({
    codigo_productosrids: String,
    nombre_productosrids: String,
    nitproveedor_productosrids: String,
    falla_productosrids: String, 
    fecha_productosrids: String
}, {versionKey:false})

module.exports = mongoose.model('db_productosrids',productosridSchema)

