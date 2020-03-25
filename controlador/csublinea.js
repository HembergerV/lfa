const passport = require("passport");
const modeloLinea = require('../modelos/Mlinea');
const modeloSublinea = require('../modelos/Msublinea');
const Utilidad = require('../ayuda/utilidad');

function getSublinea(req, res){
    let usuario = req.session.passport.user;
    
    modeloSublinea.get_sublinea( (error, sublineas) => { // si se pudo obtener los items
            if (error) { // si hubo error
                Utilidad.printError(res, {msg: `Error no se pudieron obtener las sublineas: ${error}`, tipo: 0});
                
            }else{
                // si no hubo error
                modeloLinea.get_linea( (error, lineas) => { // si se pudo obtener los items
                    if (error) { // si hubo error
                        Utilidad.printError(res, {msg: `Error no se pudieron obtener las lineas: ${error}`, tipo: 0});

                    }else{
                        // si no hubo error
                        res.render('msublinea', {sublineas, lineas, usuario});
                    }
                })
            }
        })
};

function cambiarestatus(req, res){
    let idsublinea = req.body.idsublinea,
        est = req.body.est
    
    modeloSublinea.editar_estatus_sublinea(idsublinea,est,(error, sublinea) => { // si se pudo obtener los sublineaes
            if (error) { // si hubo error
                Utilidad.printError(res, {msg: `Error no se pudo cambiar el estatus: ${error}`, tipo: 0});
                
            }else{
                res.send(sublinea)
            }
            
        })
}

function mostrar(req,res){
    var estiloEstatus;
    var estatus;
    var cont;
    modeloSublinea.get_sublinea( (error, sublineas) => {
        var pr = sublineas;
        for(var i = 0; pr[i]; i++){
          if(pr[i].estatus == 1){
              estiloEstatus = "btn btn-success btn-md estado";
              estatus = 'ACTIVO';
          }else{
              estiloEstatus = "btn btn-warning btn-md estado";
              estatus = 'INACTIVO';
          }
          cont = pr[i].estatus;
          pr[i].estatus = '<button type="button" onClick="cambiarEstado('+ pr[i].idsublinea+','+cont+');" name="estatus" id="'+pr[i].idsublinea+'" class="'+estiloEstatus+'">'+estatus+'</button>';
        };
        
            if(!error) res.send(pr) // se envia el sublinea seleccionado
        })
}

function guardaryeditar(req,res){
    var nombre = req.body.nombre;
    var descripcion = req.body.descripcion;
    var idlinea = req.body.idlinea;
    
    var idsublinea = req.body.idsublinea;
    if(!idsublinea){ // si no se ejecuta desde el formulario de editar
        modeloSublinea.get_nombre_sublinea(nombre, idlinea, (error, dato) => {
            if(!dato[0]){ // si no existe el nombre
                modeloSublinea.registrar_sublinea(nombre, descripcion,idlinea, (error,dato) => {
                    var msj = '<div class="alert alert-success" role="alert"><button type="button" class="close" data-dismiss="alert">&times;</button> <strong>¡Bien hecho!</strong> La sub línea se registro correctamente.</div>';
                    res.send(msj) 
                })
            } else{
                var msj = '<div class="alert alert-danger" role="alert"><button type="button" class="close" data-dismiss="alert">&times;</button> <strong>Error</strong> La sub línea ya existe.</div>';
                res.send(msj) 
            }
        })
    } else{ // si se ejecuta desde el formulario de editar
        modeloSublinea.get_nombre_sublinea(nombre, idlinea,(error, dato) => {
            if(!dato[0]){
                modeloSublinea.editar_sublinea(nombre,descripcion,idlinea,idsublinea,(error,dato) => {
                    var msj = '<div class="alert alert-success" role="alert"><button type="button" class="close" data-dismiss="alert">&times;</button> <strong>¡Bien hecho!</strong> La sub línea se editó correctamente.</div>';
                    res.send(msj) 
                })
            } else{
                var msj = '<div class="alert alert-danger" role="alert"><button type="button" class="close" data-dismiss="alert">&times;</button> <strong>Error</strong> La sub línea ya existe.</div>';
                res.send(msj) 
            }
        })
    }
    
}

function mostrarEdit(req,res){
    var idsublinea = req.body.idsublinea;
    modeloSublinea.get_sublinea_por_id(idsublinea, (error, dato) => {
        res.send(dato)
    })
}

module.exports = {
    getSublinea,
    mostrar,
    cambiarestatus,
    guardaryeditar,
    mostrarEdit
}
