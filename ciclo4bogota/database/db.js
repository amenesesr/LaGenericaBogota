const mongoose = require('mongoose')
const dotenv = require('dotenv').config({path: './env/.env'})
const url_bogota = process.env.DB_URL_BOGOTA

mongoose.connect(url_bogota)

const db = mongoose.connection
db.on('error',console.error.bind(console,'Error al conectar a MongoDB'))
db.once('open',function callback(){
    console.log("Conectado con exito a la Base de datos de Bogota".magenta)
})

module.exports = db