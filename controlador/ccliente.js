const passport = require("passport");
const modeloCliente = require('../modelos/Mcliente');
const modeloMarca = require('../modelos/Mmarca');
const modeloRif = require('../modelos/Mrif');
const Utilidad = require('../ayuda/utilidad');

function getCliente(req, res){
    let usuario = req.session.passport.user;

    modeloCliente.get_cliente( (error, clientes) => { // si se pudo obtener los clientes
            if (error) { // si hubo error
                Utilidad.printError(res, {msg: `Error no se pudieron obtener los clientes: ${error}`, tipo: 0});

            }else{
                modeloRif.get_rif( (error, rifs) => {
                    res.render('mcliente', {clientes, rifs, usuario});
                })

        }

})
};

function cambiarestatus(req, res){
    let idcliente = req.body.id,
        est = req.body.est

    modeloCliente.editar_estatus_cliente(idcliente,est,(error, cliente) => { // si se pudo obtener los paises
            if (error) { // si hubo error
                Utilidad.printError(res, {msg: `Error no se pudo cambiar el estatus: ${error}`, tipo: 0});

            }else{
                res.send(cliente)
            }

        })
}

function mostrar(req,res){
    var estiloEstatus;
    var estatus;
    var cont;

    modeloCliente.get_cliente( (error, clientes) => {
        var pr = clientes;
        for(var i = 0; pr[i]; i++){
          if(pr[i].estatus == 1){
              estiloEstatus = "btn btn-success btn-md estado";
              estatus = 'ACTIVO';
          }else{
              estiloEstatus = "btn btn-warning btn-md estado";
              estatus = 'INACTIVO';
          }

          cont = pr[i].estatus;
          pr[i].estatus = '<button type="button" onClick="cambiarEstado('+ pr[i].idcliente+','+cont+');" name="estatus" id="'+pr[i].idcliente+'" class="'+estiloEstatus+'">'+estatus+'</button>';
        };

            if(!error) res.send(pr) // se envia el pais seleccionado
        })
}

function guardaryeditar(req,res){
    var idcliente = req.body.idcliente;
    var tiporif = req.body.tiporif;
    var rif = req.body.rif;
    var rifO = req.body.rifOriginal;
    var nombre = req.body.nombre;
    var direccion = req.body.direccion;
    var email = req.body.email;
    var telefono = req.body.telefono;

    if(!idcliente){
        modeloCliente.get_rif_cliente(rif,(error, dato) => {
            if(!dato[0]){
                modeloCliente.registrar_cliente(tiporif,rif,nombre,direccion,email,telefono,(error,dato) => {
                    var msj = '<div class="alert alert-success" role="alert"><button type="button" class="close" data-dismiss="alert">&times;</button> <strong>¡Bien hecho!</strong> El cliente se registró correctamente.</div>';
                    res.send(msj)
                })
            } else{
                var msj = '<div class="alert alert-danger" role="alert"><button type="button" class="close" data-dismiss="alert">&times;</button> <strong>Error</strong> El rif ya existe.</div>';
                res.send(msj)
            }
        })
    } else{
        if(rifO == rif){
            modeloCliente.editar_cliente(tiporif,rif,nombre,direccion,email,telefono,idcliente,(error,dato) => {
                    var msj = '<div class="alert alert-success" role="alert"><button type="button" class="close" data-dismiss="alert">&times;</button> <strong>¡Bien hecho!</strong>  El cliente se editó correctamente.</div>';
                    res.send(msj)
                })
        }else{
        modeloCliente.get_rif_cliente(rif, (error, dato) => {
            if(!dato[0]){
                modeloCliente.editar_cliente(tiporif,rif,nombre,direccion,email,telefono,idcliente,(error,dato) => {
                    if (error) { // si hubo error
                        Utilidad.printError(res, {msg: `Error no se pudo cambiar el estatus: ${error}`, tipo: 0});

                    }else{
                    var msj = '<div class="alert alert-success" role="alert"><button type="button" class="close" data-dismiss="alert">&times;</button> <strong>¡Bien hecho!</strong> El cliente se editó correctamente.</div>';
                    res.send(msj)
                    }
                })
            } else{
                var msj = '<div class="alert alert-danger" role="alert"><button type="button" class="close" data-dismiss="alert">&times;</button> <strong>Error</strong> El rif ya existe.</div>';
                res.send(msj)
            }
        })
      }
    }

}

function mostrarEdit(req,res){
    var idcliente = req.body.idcliente;
    modeloCliente.get_cliente_por_id(idcliente, (error, dato) => {
        res.send(dato)
    })
}

module.exports = {
    getCliente,
    mostrar,
    cambiarestatus,
    guardaryeditar,
    mostrarEdit
}
