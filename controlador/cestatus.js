const passport = require("passport");
const modeloEstatus = require('../modelos/Mestatus');
const Utilidad = require('../ayuda/utilidad');

function getEstatus(req, res){
    
    let usuario = req.session.passport.user;

    modeloEstatus.get_estatus( (error, estatus) => { // si se pudo obtener los paises
            if (error) { // si hubo error
                Utilidad.printError(res, {msg: `Error no se pudieron obtener los cargos: ${error}`, tipo: 0});
                
            }else{
                // si no hubo error
                res.render('mestatus', {estatus, usuario});
            }
        })
};

function mostrar(req,res){
    var estiloEstatus;
    var estado;
    var cont;
    
    modeloEstatus.get_estatus( (error, estatus) => {
        var pr = estatus;
        for(var i = 0; pr[i]; i++){
          if(pr[i].estatus == 1){
              estiloEstatus = "btn btn-success btn-md estado";
              estado = 'ACTIVO';
          }else{
              estiloEstatus = "btn btn-warning btn-md estado";
              estado = 'INACTIVO';
          }
          
          cont = pr[i].estatus;
          pr[i].estatus = '<button type="button" onClick="cambiarEstado('+ pr[i].idestatus+','+cont+');" name="estatus" id="'+pr[i].idestatus+'" class="'+estiloEstatus+'">'+estado+'</button>';
        };
        
            if(!error) res.send(pr) // se envia el pais seleccionado
        })
}

function cambiarestatus(req, res){
    let idestatus = req.body.idestatus,
        est = req.body.est
    
    modeloEstatus.editar_estatus_estatus(idestatus,est,(error, cargo) => { // si se pudo obtener los paises
            if (error) { // si hubo error
                Utilidad.printError(res, {msg: `Error no se pudo cambiar el estatus: ${error}`, tipo: 0});
                
            }else{
                res.send(cargo)
            }
            
        })
}
function guardaryeditar(req,res){
    var idestatus = req.body.idestatus;
    var codestatus = req.body.codestatus;
    var nombre = req.body.nombre;
    var descripcion = req.body.descripcion;

    if(!idestatus){
        modeloEstatus.get_nombre_estatus(nombre, (error, dato) => {
            if(!dato[0]){
                modeloEstatus.registrar_estatus(codestatus,nombre, descripcion, (error,dato) => {
                    var msj = '<div class="alert alert-success" role="alert"><button type="button" class="close" data-dismiss="alert">&times;</button> <strong>¡Bien hecho!</strong> El estatus se registró correctamente.</div>';
                    res.send(msj) 
                })
            } else{
                var msj = '<div class="alert alert-danger" role="alert"><button type="button" class="close" data-dismiss="alert">&times;</button> <strong>Error</strong> El estatus ya existe.</div>';
                res.send(msj) 
            }
        })
    } else{
        modeloEstatus.get_nombre_estatus(nombre, (error, dato) => {
            if(!dato[0]){
                modeloEstatus.editar_estatus(codestatus,nombre, descripcion, idestatus,(error,dato) => {
                    var msj = '<div class="alert alert-success" role="alert"><button type="button" class="close" data-dismiss="alert">&times;</button> <strong>¡Bien hecho!</strong> El estatus se editó correctamente.</div>';
                    res.send(msj) 
                })
            } else{
                var msj = '<div class="alert alert-danger" role="alert"><button type="button" class="close" data-dismiss="alert">&times;</button> <strong>Error</strong> El estatus ya existe.</div>';
                res.send(msj) 
            }
        })
    }
    
}

function mostrarEdit(req,res){
    var idestatus = req.body.idestatus;
    modeloEstatus.get_estatus_por_id(idestatus, (error, dato) => {
        res.send(dato)
    })
}

module.exports = {
    getEstatus,
    mostrar,
    cambiarestatus,
    guardaryeditar,
    mostrarEdit
}