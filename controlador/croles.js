const passport = require("passport");
const modeloRoles = require('../modelos/Mroles');
const Utilidad = require('../ayuda/utilidad');

function getRoles(req, res){

    let usuario = req.session.passport.user;

    modeloRoles.get_roles( (error, roles) => { // si se pudo obtener los paises
            if (error) { // si hubo error
                Utilidad.printError(res, {msg: `Error no se pudieron obtener los roles: ${error}`, tipo: 0});

            }else{
                // si no hubo error
                res.render('mroles', {roles, usuario});
            }
        })
};

function mostrar(req,res){
    var estiloEstatus;
    var estatus;
    var cont;

    modeloRoles.get_roles( (error, roles) => {
        var pr = roles;
        for(var i = 0; pr[i]; i++){
          if(pr[i].estatus == 1){
              estiloEstatus = "btn btn-success btn-md estado";
              estatus = 'ACTIVO';
          }else{
              estiloEstatus = "btn btn-warning btn-md estado";
              estatus = 'INACTIVO';
          }

          cont = pr[i].estatus;
          pr[i].estatus = '<button type="button" onClick="cambiarEstado('+ pr[i].idroles+','+cont+');" name="estatus" id="'+pr[i].idroles+'" class="'+estiloEstatus+'">'+estatus+'</button>';
        };

            if(!error) res.send(pr) // se envia el pais seleccionado
        })
}

function cambiarestatus(req, res){
    let idroles = req.body.idroles,
        est = req.body.est

    modeloRoles.editar_estatus_roles(idroles,est,(error, roles) => { // si se pudo obtener las marcas
            if (error) { // si hubo error
                Utilidad.printError(res, {msg: `Error no se pudo cambiar el estatus: ${error}`, tipo: 0});

            }else{
                res.send(roles)
            }

        })
}
function guardaryeditar(req,res){
    var nombre = req.body.nombre;
    var nombreO = req.body.nombreOriginal;

    var idroles = req.body.idroles;
    var descripcion = req.body.descripcion;

    if(!idroles){
        modeloRoles.get_nombre_roles(nombre, (error, dato) => {
            if(!dato[0]){
                modeloRoles.registrar_roles(nombre, descripcion, (error,dato) => {
                    var msj = '<div class="alert alert-success" role="alert"><button type="button" class="close" data-dismiss="alert">&times;</button> <strong>¡Bien hecho!</strong> El rol se registró correctamente.</div>';
                    res.send(msj)
                })
            } else{
                var msj = '<div class="alert alert-danger" role="alert"><button type="button" class="close" data-dismiss="alert">&times;</button> <strong>Error</strong> El rol ya existe.</div>';
                res.send(msj)
            }
        })
    } else{
        if(nombreO == nombre){
            modeloRoles.editar_roles(nombre, descripcion, idroles,(error,dato) => {
                    var msj = '<div class="alert alert-success" role="alert"><button type="button" class="close" data-dismiss="alert">&times;</button> <strong>¡Bien hecho!</strong>  El rol se editó correctamente.</div>';
                    res.send(msj)
                })
        }else{
            modeloRoles.get_nombre_roles(nombre, (error, dato) => {
                if(!dato[0]){
                    modeloRoles.editar_roles(nombre, descripcion, idroles,(error,dato) => {
                        var msj = '<div class="alert alert-success" role="alert"><button type="button" class="close" data-dismiss="alert">&times;</button> <strong>¡Bien hecho!</strong> El rol se editó correctamente.</div>';
                        res.send(msj)
                    })
                } else{
                    var msj = '<div class="alert alert-danger" role="alert"><button type="button" class="close" data-dismiss="alert">&times;</button> <strong>Error</strong> El rol ya existe.</div>';
                    res.send(msj)
                }
            })
          }
    }

}

function mostrarEdit(req,res){
    var idroles = req.body.idroles;
    modeloRoles.get_roles_por_id(idroles, (error, dato) => {
        res.send(dato)
    })
}

module.exports = {
    getRoles,
    mostrar,
    guardaryeditar,
    cambiarestatus,
    mostrarEdit
}
