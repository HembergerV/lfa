const passport = require("passport");
const modeloLinea = require('../modelos/Mlinea');
const Utilidad = require('../ayuda/utilidad');

function getLinea(req, res){

    let usuario = req.session.passport.user;

    modeloLinea.get_linea( (error, lineas) => { // si se pudo obtener las lineas
            if (error) { // si hubo error
                Utilidad.printError(res, {msg: `Error no se pudieron obtener las lineas: ${error}`, tipo: 0});

            }else{
                // si no hubo error
                res.render('mlinea', {lineas, usuario});
            }
        })
};

function mostrar(req,res){
    var estiloEstatus;
    var estatus;
    var cont;

    modeloLinea.get_linea( (error, lineas) => {
        var pr = lineas;
        for(var i = 0; pr[i]; i++){
          if(pr[i].estatus == 1){
              estiloEstatus = "btn btn-success btn-md estado";
              estatus = 'ACTIVO';
          }else{
              estiloEstatus = "btn btn-warning btn-md estado";
              estatus = 'INACTIVO';
          }

          cont = pr[i].estatus;
          pr[i].estatus = '<button type="button" onClick="cambiarEstado('+ pr[i].idlinea+','+cont+');" name="estatus" id="'+pr[i].idlinea+'" class="'+estiloEstatus+'">'+estatus+'</button>';
        };

            if(!error) res.send(pr) // se envia el pais seleccionado
        })
}

function cambiarestatus(req, res){
    let idlinea = req.body.idlinea,
        est = req.body.est

    modeloLinea.editar_estatus_linea(idlinea,est,(error, linea) => { // si se pudo obtener las lineas
            if (error) { // si hubo error
                Utilidad.printError(res, {msg: `Error no se pudo cambiar el estatus: ${error}`, tipo: 0});

            }else{
                res.send(linea)
            }

        })
}
function guardaryeditar(req,res){
    var nombre = req.body.nombre;
    var nombreO = req.body.nombreOriginal;

    var idlinea = req.body.idlinea;
    var descripcion = req.body.descripcion;

    if(!idlinea){
        modeloLinea.get_nombre_linea(nombre, (error, dato) => {
            if(!dato[0]){
                modeloLinea.registrar_linea(nombre, descripcion, (error,dato) => {
                    var msj = '<div class="alert alert-success" role="alert"><button type="button" class="close" data-dismiss="alert">&times;</button> <strong>¡Bien hecho!</strong> La Linea se registró correctamente.</div>';
                    res.send(msj)
                })
            } else{
                var msj = '<div class="alert alert-danger" role="alert"><button type="button" class="close" data-dismiss="alert">&times;</button> <strong>Error</strong> La Linea ya existe.</div>';
                res.send(msj)
            }
        })
    } else{
        if(nombreO == nombre){
            modeloLinea.editar_linea(nombre, descripcion, idlinea,(error,dato) => {
                    var msj = '<div class="alert alert-success" role="alert"><button type="button" class="close" data-dismiss="alert">&times;</button> <strong>¡Bien hecho!</strong>  El cargo se editó correctamente.</div>';
                    res.send(msj)
                })
        }else{
            modeloLinea.get_nombre_linea(nombre, (error, dato) => {
                if(!dato[0]){
                    modeloLinea.editar_linea(nombre, descripcion, idlinea,(error,dato) => {
                        var msj = '<div class="alert alert-success" role="alert"><button type="button" class="close" data-dismiss="alert">&times;</button> <strong>¡Bien hecho!</strong> La linea se editó correctamente.</div>';
                        res.send(msj)
                    })
                } else{
                    var msj = '<div class="alert alert-danger" role="alert"><button type="button" class="close" data-dismiss="alert">&times;</button> <strong>Error</strong> La Linea ya existe.</div>';
                    res.send(msj)
                }
            })
          }
    }

}

function mostrarEdit(req,res){
    var idlinea = req.body.idlinea;
    modeloLinea.get_linea_por_id(idlinea, (error, dato) => {
        res.send(dato)
    })
}

module.exports = {
    getLinea,
    mostrar,
    cambiarestatus,
    guardaryeditar,
    mostrarEdit
}
