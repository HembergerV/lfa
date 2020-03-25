const passport = require("passport");
const modeloDpto = require('../modelos/Mdpto');
const Utilidad = require('../ayuda/utilidad');

function getDpto(req, res){
    let usuario = req.session.passport.user;

    modeloDpto.get_dpto( (error, dpto) => { // si se pudo obtener los paises
            if (error) { // si hubo error
                Utilidad.printError(res, {msg: `Error no se pudieron obtener los departamentos: ${error}`, tipo: 0});

            }else{
                // si no hubo error
                res.render('mdpto', {dpto, usuario});
            }
        })
};

function mostrar(req,res){
    var estiloEstatus;
    var estatus;
    var cont;

    modeloDpto.get_dpto( (error, dpto) => {
        var pr = dpto;
        for(var i = 0; pr[i]; i++){
          if(pr[i].estatus == 1){
              estiloEstatus = "btn btn-success btn-md estado";
              estatus = 'ACTIVO';
          }else{
              estiloEstatus = "btn btn-warning btn-md estado";
              estatus = 'INACTIVO';
          }

          cont = pr[i].estatus;
          pr[i].estatus = '<button type="button" onClick="cambiarEstado('+ pr[i].id+','+cont+');" name="estatus" id="'+pr[i].id+'" class="'+estiloEstatus+'">'+estatus+'</button>';
        };

            if(!error) res.send(pr) // se envia el pais seleccionado
        })
}

function cambiarestatus(req, res){
    let iddpto = req.body.id,
        est = req.body.est

    modeloDpto.editar_estatus_dpto(iddpto,est,(error, dpto) => { // si se pudo obtener los paises
            if (error) { // si hubo error
                Utilidad.printError(res, {msg: `Error no se pudo cambiar el estatus: ${error}`, tipo: 0});

            }else{
                res.send(dpto)
            }

        })
}
function guardaryeditar(req,res){
    var nombre = req.body.nombre;
    var nombreO = req.body.nombreOriginal;

    var iddpto = req.body.id;
    var coddpto = req.body.coddpto;
    var coddptoO = req.body.coddptoOriginal;

    if(!iddpto){
        modeloDpto.get_nombre_dpto(nombre, coddpto,(error, dato) => {
            if(!dato[0]){
                modeloDpto.registrar_dpto(nombre,coddpto, (error,dato) => {
                    var msj = '<div class="alert alert-success" role="alert"><button type="button" class="close" data-dismiss="alert">&times;</button> <strong>¡Bien hecho!</strong> El departamento se registró correctamente.</div>';
                    res.send(msj)
                })
            } else{
                var msj = '<div class="alert alert-danger" role="alert"><button type="button" class="close" data-dismiss="alert">&times;</button> <strong>Error</strong> El departamento ya existe.</div>';
                res.send(msj)
            }
        })
    } else{
        if(coddpto == coddptoO && nombre == nombreO){
          var msj = '<div class="alert alert-info" role="alert"><button type="button" class="close" data-dismiss="alert">&times;</button> <strong></strong> Valores sin cambio.</div>';
          res.send(msj)
        }else if(coddpto == coddptoO){
          modeloDpto.get_nombre_dpto(nombre, 0,(error, dato) => {
              if(!dato[0]){
                  modeloDpto.editar_dpto(nombre,coddpto, iddpto,(error,dato) => {
                      if (error) { // si hubo error
                          Utilidad.printError(res, {msg: `Error no se pudo cambiar el estatus: ${error}`, tipo: 0});

                      }else{
                          var msj = '<div class="alert alert-success" role="alert"><button type="button" class="close" data-dismiss="alert">&times;</button> <strong>¡Bien hecho!</strong> El departamento se editó correctamente.</div>';
                          res.send(msj)
                      }

                  })
              } else{
                  if (error) { // si hubo error
                          Utilidad.printError(res, {msg: `Error no se pudo cambiar el estatus: ${error}`, tipo: 0});

                      }else{
                          var msj = '<div class="alert alert-danger" role="alert"><button type="button" class="close" data-dismiss="alert">&times;</button> <strong>Error</strong> El departamento ya existe.</div>';
                          res.send(msj)
                      }

              }
          })
        }else if(nombre == nombreO){
          modeloDpto.get_nombre_dpto(0, coddpto,(error, dato) => {
              if(!dato[0]){
                  modeloDpto.editar_dpto(nombre,coddpto, iddpto,(error,dato) => {
                      if (error) { // si hubo error
                          Utilidad.printError(res, {msg: `Error no se pudo cambiar el estatus: ${error}`, tipo: 0});

                      }else{
                          var msj = '<div class="alert alert-success" role="alert"><button type="button" class="close" data-dismiss="alert">&times;</button> <strong>¡Bien hecho!</strong> El departamento se editó correctamente.</div>';
                          res.send(msj)
                      }

                  })
              } else{
                  if (error) { // si hubo error
                          Utilidad.printError(res, {msg: `Error no se pudo cambiar el estatus: ${error}`, tipo: 0});

                      }else{
                          var msj = '<div class="alert alert-danger" role="alert"><button type="button" class="close" data-dismiss="alert">&times;</button> <strong>Error</strong> El departamento ya existe.</div>';
                          res.send(msj)
                      }

              }
          })
        }else{
          modeloDpto.get_nombre_dpto(nombre, coddpto,(error, dato) => {
              if(!dato[0]){
                  modeloDpto.editar_dpto(nombre,coddpto, iddpto,(error,dato) => {
                      if (error) { // si hubo error
                          Utilidad.printError(res, {msg: `Error no se pudo cambiar el estatus: ${error}`, tipo: 0});

                      }else{
                          var msj = '<div class="alert alert-success" role="alert"><button type="button" class="close" data-dismiss="alert">&times;</button> <strong>¡Bien hecho!</strong> El departamento se editó correctamente.</div>';
                          res.send(msj)
                      }

                  })
              } else{
                  if (error) { // si hubo error
                          Utilidad.printError(res, {msg: `Error no se pudo cambiar el estatus: ${error}`, tipo: 0});

                      }else{
                          var msj = '<div class="alert alert-danger" role="alert"><button type="button" class="close" data-dismiss="alert">&times;</button> <strong>Error</strong> El departamento ya existe.</div>';
                          res.send(msj)
                      }

              }
          })
        }
    }

}

function mostrarEdit(req,res){
    var iddpto = req.body.id;
    modeloDpto.get_dpto_por_id(iddpto, (error, dato) => {
        res.send(dato)
    })
}

module.exports = {
    getDpto,
    mostrar,
    cambiarestatus,
    guardaryeditar,
    mostrarEdit
}
