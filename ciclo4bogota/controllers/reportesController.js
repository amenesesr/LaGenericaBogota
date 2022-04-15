const Clientes = require('../model/Clientes')
const Ventas = require('../model/Ventas')


//cargar pagina reportes
module.exports.cargar = (req, res)=>{
    console.log("===================".yellow)
    console.log("  METODO REPORTES  ".red)
    console.log("===================".yellow)
    usuario = req.user
    Clientes.find({},(error, clientes)=>{
        if(error){
            return res.status(500).json({
                message: 'Error mostrando los clientes'
            })
        }
        
        Ventas.find({},(error, ventas)=>{
            if(error){
                return res.status(500).json({
                    message: 'Error mostrando las ventas'
                })
            }
            return res.render('reportes',{clientes: clientes, ventas: ventas, usuario})
        })
    })
}
