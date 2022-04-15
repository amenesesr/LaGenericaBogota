const dbm = require('mongoose')
const dotenv = require('dotenv').config({path: './env/.env'})
const url_bogota = process.env.DB_URL_BOGOTA
const url_medellin = process.env.DB_URL_MEDELLIN
const url_cali = process.env.DB_URL_CALI

dbm.connect(url_bogota,{})
.then(con=>{
	console.log("Base de datos multiple conectada".red)
})
.catch(error=>{
	console.log("Error: " + error.message)
})

dbm.Ciclo4A_BOGOTA = dbm.createConnection(url_bogota,{})

dbm.Ciclo4A_CALI = dbm.createConnection(url_cali,{})

dbm.Ciclo4A_MEDELLIN = dbm.createConnection(url_medellin,{})

module.exports = dbm