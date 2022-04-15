const path = require('path');
const express = require('express')
const {body, validationResult} = require('express-validator')
const db = require('./database/db')
const colors =require('colors')
const morgan = require('morgan')
//const dotenv = require('dotenv').config({path: './env/.env'})
const cookieParser = require('cookie-parser')


const app = express()

app.set('views', __dirname + '\\views');
app.set('view engine', 'ejs')

app.use(express.static(__dirname + '/public'))

app.use(express.urlencoded({extended:true}))
app.use(express.json())

app.use(cookieParser())

const reportes = require('./routes/reportes')
app.use(reportes)

const clientes = require('./routes/clientes')
app.use(clientes)

const productos = require('./routes/productos')
app.use(productos)

const ventas = require('./routes/ventas')
app.use(ventas)

const consolidados = require('./routes/consolidados')
app.use(consolidados)

const factura = require('./routes/factura')
app.use(factura)

const usuarios = require('./routes/usuarios')
app.use(usuarios)

const proveedores = require('./routes/proveedores')
app.use(proveedores)

const pruebas = require('./routes/pruebas')
app.use(pruebas)

const facturacion = require('./routes/facturacion')
app.use(facturacion)

const login = require('./routes/login');
const res = require('express/lib/response');
app.use(login)

app.use(function(req,res,next){
    if(!req.usuario)
        res.header('Cache-Control', 'private, no-cache, no-store, must-revalidate')
    next()
})

app.get('/',morgan('tiny'),(req, res)=>{
    res.send('Se ha conectado a la aplicacion con exito')
})

app.listen(process.env.PORT,(req, res)=>{
    console.log('Conexion existosa en http://localhost:'.brightBlue + process.env.PORT)
})