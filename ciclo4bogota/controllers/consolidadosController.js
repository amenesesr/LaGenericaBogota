const VentasBogota = require('../model/Ventas')
const VentasMedellin = require('../model/VentasMedellin')
const Consolidados = require('../model/Consolidados')
const db = require('../database/db')
const dbMariaDB = require('../database/dbMariaDB')

module.exports.cargar = async (req, res) =>{
	console.log("==========================".yellow)
	console.log("  METODO CONSOLIDADOS ".red)
	console.log("==========================".yellow)
    var idconsolidado = 0
    var consolidado_bogota = 0
	var consolidado_cali = 0
	var consolidado_medellin = 0
	var ciudad = ""
	var ventatotal = 0
	usuario = req.user

	var conVentasCali = []

	conVentasCali = await dbMariaDB.query("SELECT * FROM db_ventas", (error,ventas)=>{
		if(error){
			throw error
		}else{
			return ventas
		}
	})
	
	conVentasCali.forEach((conVentaCali) => {
		consolidado_cali += conVentaCali.total_venta_ventas
		ciudad = "Cali"
	}) //cierra el foreach anterior que calcula el consolidado de cali
 
    Consolidados.find({}, async (error, consolidados)=>{
        if(error){
            return res.status(500).json({
                message: 'Error mostrando los consolidados'
            })
        }
        consolidados.forEach((consolidado) => {
            if (idconsolidado < consolidado.id_consolidado )
            {
                idconsolidado = consolidado.id_consolidado       
            }
        }) // cierra el foreach anterior que calcula el id del consolidado
        idconsolidado += 1
		
            VentasBogota.find({}, async (error, ventasbogota)=>{
                if(error){
                    return res.status(500).json({
                        message: 'Error mostrando las ventas'
                    })
                }
				
                ventasbogota.forEach((ventabogota) => {
                    consolidado_bogota += ventabogota.total_venta_ventas
					ciudad = "Bogota"
                }) //cierra el foreach anterior que calcula el consolidado de Bogota
				
					const consolidadoBogota = new Consolidados({
                    	id_consolidado:idconsolidado,
                    	ciudad_consolidado:ciudad,
                    	ventas_consolidado: consolidado_bogota,
					}) // cierra el objeto de tipo consolidado de la ciudad de bogota
					
					const collectionName = 'db_consolidados';
					var collection = db.collection(collectionName);
					collection.insertOne(consolidadoBogota, (err, result) => {
					if (err) console.log(err);
						if(result){
						}
				
					//comienza el proceso para el consolidado de la segunda ciudad (Cali)
					Consolidados.find({}, async (error, consolidados)=>{
						if(error){
							return res.status(500).json({
								message: 'Error mostrando los consolidados'
							})
						}
						consolidados.forEach((consolidado) => {
							if (idconsolidado < consolidado.id_consolidado )
							{
								idconsolidado = consolidado.id_consolidado       
							}
						}) // cierra el foreach anterior que calcula el id del consolidado para cali
						idconsolidado += 1
						ciudad = ""
						
						const consolidadoCali = new Consolidados({
							id_consolidado: idconsolidado,
							ciudad_consolidado: ciudad,
							ventas_consolidado: consolidado_cali,
						}) // cierra el objeto de tipo consolidado de la ciudad de cali

								const collectionName = 'db_consolidados';
								var collection = db.collection(collectionName);
								collection.insertOne(consolidadoCali, (err, result) => {
								if (err) console.log(err);
									if(result){
									}

								//comienza el proceso para el consolidado de la segunda ciudad (Medellin)
								Consolidados.find({},(error, consolidados)=>{
									if(error){
										return res.status(500).json({
											message: 'Error mostrando los consolidados'
										})
									}
									consolidados.forEach((consolidado) => {
										if (idconsolidado < consolidado.id_consolidado )
										{
											idconsolidado = consolidado.id_consolidado       
										}
									}) // cierra el foreach anterior que calcula el id del consolidado para cali
									idconsolidado += 1
									ciudad = ""
									VentasMedellin.find({},(error, ventasmedellin)=>{
										if(error){
											return res.status(500).json({
												message: 'Error mostrando las ventas Medellin'
											})
										}
										ventasmedellin.forEach((ventamedellin) => {
											consolidado_medellin += ventamedellin.total_venta_ventas
											ciudad = "Medellin"
										}) //cierra el foreach anterior
										
											const consolidadoMedellin = new Consolidados({
											id_consolidado:idconsolidado,
											ciudad_consolidado:ciudad,
											ventas_consolidado: consolidado_medellin,
											}) // cierra el objeto de tipo consolidado de la ciudad de medellin

												const collectionName = 'db_consolidados';
												var collection = db.collection(collectionName);
												collection.insertOne(consolidadoMedellin, (err, result) => {
												if (err) console.log(err);
													if(result){
													}
											
											ventatotal = consolidado_bogota + consolidado_cali + consolidado_medellin
											var consolidados =[consolidado_bogota, consolidado_medellin, consolidado_cali]
											return res.render('consolidados',{consolidado_bogota,consolidado_cali,consolidado_medellin,ventatotal, consolidados, usuario})
										
											})//cierra la funcion que graba el objeto en la base de datos Medellin
										})//cierra la funcion de la lista de ventas de medellin para calcular el consolidado de medellin
									})//cierra la lista del consolidado para sacar el consecutivo de medellin
								})//cierra la funcion que graba el objeto en la base de datos Cali
							})//cierra la lista del consolidado para sacar el consecutivo de cali
						})// cierra la funcion de la lista de ventas de cali para calcular el consolidado de cali
                    })//cierra la funcion que graba el objeto en la base de datos Bogota
    }) // cierra la funcion de la primera lista de consolidados para hacer el consecutivo
}

