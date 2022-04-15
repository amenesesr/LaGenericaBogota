const { query } = require('express')
const mariadb = require('mariadb')
const dotenv = require('dotenv').config({path: './env/.env'})

const con = mariadb.createPool({
    host: process.env.DB_HOST, 
    user: process.env.DB_USER, 
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    connectionLimit: process.env.DB_CONNECTIONLIMIT
})

con.getConnection()
.then(con => {
    console.log("conectado con exito a la base de datos Cali")  
}).catch(err => {
    console.log(err)
})
 
module.exports = con
