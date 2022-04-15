const ProductosRid = require('../model/ProductosRid')
const db = require('../database/db')



//mostrar metodos de la api
module.exports.mostrar = (req, res)=>{
    console.log("==========================".yellow)
    console.log(" METODO MOSTRAR PRODUCTOS ".red)
    console.log("==========================".yellow)

    ProductosRid.find({},(error, productosRID)=>{
        if(error){
            return res.status(500).json({
                        message: 'Error mostrando los productos'
            })
        }
        console.log("productos rechazados: " + productosRID)
        return res.render('pruebas',{productosRID: productosRID}) 
    })
}
