const passport = require("passport");
const Utilidad = require('../ayuda/utilidad');
const modeloPedido = require('../modelos/Mpedido');
var url = require('url');

function getCrearpedido(req, res){
    let usuario = req.session.passport.user;
    
    var observacion = url.parse(req.url,true).query.observacion;
    var iddocumento = 1;
    var fecha = new Date();
    
    fecha = fecha.toLocaleString();
    if(req.session.pedido){
    modeloPedido.eliminar_detalles(req.session.codp,(error, dato) => {
                if (error) { // si hubo error
                    Utilidad.printError(res, {msg: `Error no se pudieron obtener los resultados: ${error}`, tipo: 0});
                }
            })
        for(var i = 0; i < req.session.pedido.length; i++){
            modeloPedido.guardar_detalle(req.session.pedido[i].id,req.session.pedido[i].valor,req.session.codp,req.session.pedido[i].precio,(error, dato) => {
                if (error) { // si hubo error
                    Utilidad.printError(res, {msg: `Error no se pudieron obtener los resultados: ${error}`, tipo: 0});
                }
            })
        }
    }
    
    if(req.session.bandera){
        modeloPedido.crearPedido(usuario.id,iddocumento, observacion, fecha ,(error, dato,f) => {
            if (error) { // si hubo error
                    Utilidad.printError(res, {msg: `Error no se pudieron obtener los resultados: ${error}`, tipo: 0});
            }else{
                var idp = req.session.codp = dato.insertId;
                req.session.bandera = false
            }
        });
    }
    
        modeloPedido.get_pedido_por_id(req.session.codp,(error, pedido) => { 
            if (error) { // si hubo error
                Utilidad.printError(res, {msg: `Error no se pudieron obtener los resultados: ${error}`, tipo: 0});
                
            }else{
                // si no hubo error
                var idp = req.session.codp;
                res.render('mcrearpedido', {idp,pedido, usuario});
            }
        })
    }

function continuar_pedido(req,res){
    let usuario = req.session.passport.user;

    modeloPedido.get_pedido_por_id(req.session.codp,(error, pedido) => { 
            if (error) { // si hubo error
                Utilidad.printError(res, {msg: `Error no se pudieron obtener los resultados: ${error}`, tipo: 0});
                
            }else{
                // si no hubo error
                var idp = req.session.codp;
                res.render('mcrearpedido', {idp,pedido, usuario});
            }
        })
}

function mostrar(req,res){    
    let usuario = req.session.passport.user;   
    var estiloEstatus;
    var estatus;
    var cont;
    
    modeloPedido.get_pedido_por_id(req.session.codp, (error, repuestos) => {
    var pr = repuestos;
        if(!error) res.send(pr) // se envia el repuesto seleccionado
    })
   
}



module.exports = {
    getCrearpedido,
    mostrar,
    continuar_pedido
}