const mongoose = require('mongoose')
const Schema = mongoose.Schema

const clientesSchema = new Schema({
    _id: String,
    direccion_clientes: String,
    email_clientes: String,
    nombre_clientes: String,
    telefono_clientes: Number 
}, {versionKey:false})

module.exports = mongoose.model('db_clientes',clientesSchema)

