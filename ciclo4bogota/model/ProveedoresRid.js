const mongoose = require('mongoose')
const Schema = mongoose.Schema

const proveedoresridsSchema = new Schema({
    nit_proveedoresrids: String,
    nombre_proveedoresrids: String,
    falla_proveedoresrids: String, 
    fecha_proveedoresrids: String
}, {versionKey:false})

module.exports = mongoose.model('db_proveedoresrids', proveedoresridsSchema)

