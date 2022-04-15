const mongoose = require('mongoose')
const Schema = mongoose.Schema

const clientesridSchema = new Schema({
    cedula_clientesrids: String,
    nombre_clienterids: String,
    falla_clientesrids: String, 
    fecha_clientesrids: String
}, {versionKey:false})

module.exports = mongoose.model('db_clientesrids',clientesridSchema)

