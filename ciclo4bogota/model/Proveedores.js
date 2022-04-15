const mongoose = require('mongoose')
const Schema = mongoose.Schema

const proveedoresSchema = new Schema({
    _id: String,
    nombre_proveedores: String,
    ciudad_proveedores: String,
    direccion_proveedores: String,
    telefono_proveedores: Number 
}, {versionKey:false})

module.exports = mongoose.model('db_proveedores',proveedoresSchema)

