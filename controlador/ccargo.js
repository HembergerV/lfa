const passport = require("passport");
const modeloCargo = require('../modelos/Mcargo');
const Utilidad = require('../ayuda/utilidad');

function getCargo(req, res){

    let usuario = req.session.passport.user;

    modeloCargo.get_cargo( (error, cargos) => { // si se pudo obtener los paises
            if (error) { // si hubo error
                Utilidad.printError(res, {msg: `Error no se pudieron obtener los cargos: ${error}`, tipo: 0});

            }else{
                // si no hubo error
                res.render('mcargo', {cargos, usuario});
            }
        })
};

function mostrar(req,res){
    var estiloEstatus;
    var estatus;
    var cont;

    modeloCargo.get_cargo( (error, cargos) => {
        var pr = cargos;
        for(var i = 0; pr[i]; i++){
          if(pr[i].estatus == 1){
              estiloEstatus = "btn btn-success btn-md estado";
              estatus = 'ACTIVO';
          }else{
              estiloEstatus = "btn btn-warning btn-md estado";
              estatus = 'INACTIVO';
          }

          cont = pr[i].estatus;
          pr[i].estatus = '<button type="button" onClick="cambiarEstado('+ pr[i].idcargo+','+cont+');" name="estatus" id="'+pr[i].idcargo+'" class="'+estiloEstatus+'">'+estatus+'</button>';
        };

            if(!error) res.send(pr) // se envia el pais seleccionado
        })
}

function cambiarestatus(req, res){
    let idcargo = req.body.idcargo,
        est = req.body.est

    modeloCargo.editar_estatus_cargo(idcargo,est,(error, cargo) => { // si se pudo obtener los paises
            if (error) { // si hubo error
                Utilidad.printError(res, {msg: `Error no se pudo cambiar el estatus: ${error}`, tipo: 0});

            }else{
                res.send(cargo)
            }

        })
}
function guardaryeditar(req,res){
    var nombre = req.body.nombre;
    var nombreO = req.body.nombreOriginal;
    var idcargo = req.body.idcargo;
    var descripcion = req.body.descripcion;

    if(!idcargo){
        modeloCargo.get_nombre_cargo(nombre, (error, dato) => {
            if(!dato[0]){
                modeloCargo.registrar_cargo(nombre, descripcion, (error,dato) => {
                    var msj = '<div class="alert alert-success" role="alert"><button type="button" class="close" data-dismiss="alert">&times;</button> <strong>¡Bien hecho!</strong> El cargo se registró correctamente.</div>';
                    res.send(msj)
                })
            } else{
                var msj = '<div class="alert alert-danger" role="alert"><button type="button" class="close" data-dismiss="alert">&times;</button> <strong>Error</strong> El cargo ya existe.</div>';
                res.send(msj)
            }
        })
    } else{
        if(nombreO == nombre){
            modeloCargo.editar_cargo(nombre, descripcion, idcargo,(error,dato) => {
                    var msj = '<div class="alert alert-success" role="alert"><button type="button" class="close" data-dismiss="alert">&times;</button> <strong>¡Bien hecho!</strong>  El cargo se editó correctamente.</div>';
                    res.send(msj)
                })
        }else{
          modeloCargo.get_nombre_cargo(nombre, (error, dato) => {
              if(!dato[0]){
                  modeloCargo.editar_cargo(nombre, descripcion, idcargo,(error,dato) => {
                      var msj = '<div class="alert alert-success" role="alert"><button type="button" class="close" data-dismiss="alert">&times;</button> <strong>¡Bien hecho!</strong> El cargo se editó correctamente.</div>';
                      res.send(msj)
                  })
              } else{
                  var msj = '<div class="alert alert-danger" role="alert"><button type="button" class="close" data-dismiss="alert">&times;</button> <strong>Error</strong> El cargo ya existe.</div>';
                  res.send(msj)
              }
          })
        }
    }

}

function mostrarEdit(req,res){
    var idcargo = req.body.idcargo;
    modeloCargo.get_cargo_por_id(idcargo, (error, dato) => {
        res.send(dato)
    })
}

module.exports = {
    getCargo,
    mostrar,
    cambiarestatus,
    guardaryeditar,
    mostrarEdit
}
