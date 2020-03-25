const passport = require("passport");
const modeloPedido = require('../modelos/Mpedido');
const modeloUsuario = require('../modelos/Musuario');
const modeloEstatus = require('../modelos/Mestatus');
var url = require('url');

const Utilidad = require('../ayuda/utilidad');

function getPedido(req, res){
    req.session.bandera = true;
    req.session.pedido = new Array();
    req.session.contador = 0;
    let usuario = req.session.passport.user;

    var estatuspedido = url.parse(req.url,true).query.estatus;
    if (!estatuspedido){
       estatuspedido = 0;
    }
    modeloPedido.get_pedido_est(estatuspedido, (error, pedidos) => { // si se pudo obtener los pedidos
            if (error) { // si hubo error
                Utilidad.printError(res, {msg: `Error no se pudieron obtener los pedidos: ${error}`, tipo: 0});

            }else{
                // si no hubo error
                modeloUsuario.get_usuario( (error, usuarios) => {
                    modeloEstatus.get_estatus( (error, estatus) => {
                        estatus.estatuspedido = estatuspedido;
                        res.render('mpedido', {estatus,pedidos, usuario,usuarios});
                    })
                })
            }
        })
};


function mostrar(req,res){
    var estiloEstatus;
    var estatus;
    var cont;
    var estatuspedido = url.parse(req.url,true).query.estatus;

    if (!estatuspedido){
       estatuspedido = 0;
    }
    modeloPedido.get_pedido_est(estatuspedido, (error, pedidos) => {
        var pr = pedidos;
        for(var i = 0; pr[i]; i++){
          if(pr[i].estatus == 1){
              estiloEstatus = "btn btn-success btn-md estado";
              estatus = 'ACTIVO';
          }else{
              estiloEstatus = "btn btn-warning btn-md estado";
              estatus = 'INACTIVO';
          }

          cont = pr[i].estatus;
          pr[i].estatus = '<button type="button" onClick="cambiarEstado('+ pr[i].codpedido+','+cont+');" name="estatus" id="'+pr[i].codpedido+'" class="'+estiloEstatus+'">'+estatus+'</button>';
        };

            if(!error) res.send(pr)
        })
}




function ir_a_pedido(req,res){
    console.log(req.body.id);
    req.session.codp = req.body.id;
    res.send("check")
}

module.exports = {
    getPedido,
    mostrar,
    ir_a_pedido
}
