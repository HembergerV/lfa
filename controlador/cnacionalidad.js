const passport = require("passport");
const modeloNacionalidad = require('../modelos/Mnacionalidad');
const Utilidad = require('../ayuda/utilidad');

function getNacionalidad(req, res){
    
    let usuario = req.session.passport.user;

    modeloNacionalidad.get_nacionalidad( (error, nacionalidades) => { // si se pudo obtener los paises
            if (error) { // si hubo error
                Utilidad.printError(res, {msg: `Error no se pudieron obtener las nacionalidades: ${error}`, tipo: 0});
                
            }else{
                // si no hubo error
                res.render('mnacionalidad', {nacionalidades, usuario});
            }
        })
};

function mostrar(req,res){
    var estiloEstatus;
    var estatus;
    var cont;
    
    modeloNacionalidad.get_nacionalidad( (error, nacionalidades) => {
        var pr = nacionalidades;
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
    let idnacionalidad = req.body.id,
        est = req.body.est
    
    modeloNacionalidad.editar_estatus_nacionalidad(idnacionalidad,est,(error, nacionalidad) => { // si se pudo obtener los paises
            if (error) { // si hubo error
                Utilidad.printError(res, {msg: `Error no se pudo cambiar el estatus: ${error}`, tipo: 0});
                
            }else{
                res.send(nacionalidad)
            }
            
        })
}
function guardaryeditar(req,res){
    var nombre = req.body.nombre;
    var idnacionalidad = req.body.id;
    var abreviatura = req.body.abreviatura;

    if(!idnacionalidad){
        modeloNacionalidad.get_abreviatura_nacionalidad(abreviatura, nombre,(error, dato) => {
            if(!dato[0]){
                modeloNacionalidad.registrar_nacionalidad(nombre, abreviatura, (error,dato) => {
                    var msj = '<div class="alert alert-success" role="alert"><button type="button" class="close" data-dismiss="alert">&times;</button> <strong>¡Bien hecho!</strong> La nacionalidad se registró correctamente.</div>';
                    res.send(msj) 
                })
            } else{
                var msj = '<div class="alert alert-danger" role="alert"><button type="button" class="close" data-dismiss="alert">&times;</button> <strong>Error</strong> La nacionalidad ya existe.</div>';
                res.send(msj) 
            }
        })
    } else{
        modeloNacionalidad.get_abreviatura_nacionalidad_EDIT(abreviatura, nombre,(error, dato) => {
            if(!dato[0]){
                modeloNacionalidad.editar_nacionalidad(nombre, abreviatura, idnacionalidad,(error,dato) => {
                    var msj = '<div class="alert alert-success" role="alert"><button type="button" class="close" data-dismiss="alert">&times;</button> <strong>¡Bien hecho!</strong> La nacionalidad se editó correctamente.</div>';
                    res.send(msj) 
                })
            } else{
                var msj = '<div class="alert alert-danger" role="alert"><button type="button" class="close" data-dismiss="alert">&times;</button> <strong>Error</strong> La nacionalidad existe.</div>';
                res.send(msj) 
            }
        })
    }
    
}

function mostrarEdit(req,res){
    var idnacionalidad = req.body.id;
    modeloNacionalidad.get_nacionalidad_por_id(idnacionalidad, (error, dato) => {
        res.send(dato)
    })
}

module.exports = {
    getNacionalidad,
    mostrar,
    cambiarestatus,
    guardaryeditar,
    mostrarEdit
}