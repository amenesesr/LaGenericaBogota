const mongoose = require('mongoose')
const Schema = mongoose.Schema

const usuariosSchema = new Schema({
    _id: String,
    nombre_usuarios: String,
    email_usuarios: String,
    usuario_usuarios: String,
    password_usuarios: String 
}, {versionKey:false})

module.exports = mongoose.model('db_usuarios',usuariosSchema)

