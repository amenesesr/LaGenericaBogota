const mongoose = require('mongoose')
const Schema = mongoose.Schema

const usuariosridSchema = new Schema({
    cedula_usuariosrids: String,
    nombre_usuariosrids: String,
    usuario_usuariosrids: String,
    falla_usuariosrids: String, 
    fecha_usuariosrids: String
}, {versionKey:false})

module.exports = mongoose.model('db_usuariosrids',usuariosridSchema)

