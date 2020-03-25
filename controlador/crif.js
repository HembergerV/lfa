const passport = require("passport");
const modeloRif = require('../modelos/Mrif');
const Utilidad = require('../ayuda/utilidad');

function getRif(req, res){
    
    let usuario = req.session.passport.user;

    modeloRif.get_rif( (error, rif) => { // si se pudo obtener los paises
            if (error) { // si hubo error
                Utilidad.printError(res, {msg: `Error no se pudieron obtener los rif: ${error}`, tipo: 0});
                
            }else{
                // si no hubo error
                res.render('mrif', {rif, usuario});
            }
        })
};

function mostrar(req,res){
    var estiloEstatus;
    var estatus;
    var cont;
    
    modeloRif.get_rif( (error, rif) => {
        var pr = rif;
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
    let idrif = req.body.id,
        est = req.body.est
    
    modeloRif.editar_estatus_rif(idrif,est,(error, cargo) => { // si se pudo obtener los paises
            if (error) { // si hubo error
                Utilidad.printError(res, {msg: `Error no se pudo cambiar el estatus: ${error}`, tipo: 0});
                
            }else{
                res.send(idrif)
            }
            
        })
}
function guardaryeditar(req,res){
    var nombre = req.body.nombre;
    var idrif = req.body.id;
    var abreviatura = req.body.abreviatura;

    if(!idrif){
        modeloRif.get_abreviatura_rif(nombre, abreviatura,(error, dato) => {
            if(!dato[0]){
                modeloRif.registrar_rif(nombre, abreviatura, (error,dato) => {
                    var msj = '<div class="alert alert-success" role="alert"><button type="button" class="close" data-dismiss="alert">&times;</button> <strong>¡Bien hecho!</strong> El rif se registró correctamente.</div>';
                    res.send(msj) 
                })
            } else{
                var msj = '<div class="alert alert-danger" role="alert"><button type="button" class="close" data-dismiss="alert">&times;</button> <strong>Error</strong> El rif ya existe.</div>';
                res.send(msj) 
            }
        })
    } else{
        modeloRif.get_abreviatura_rif_EDIT(nombre, (error, dato) => {
            if(!dato[0]){
                modeloRif.editar_rif(nombre, abreviatura, idrif,(error,dato) => {
                    var msj = '<div class="alert alert-success" role="alert"><button type="button" class="close" data-dismiss="alert">&times;</button> <strong>¡Bien hecho!</strong> El rif se editó correctamente.</div>';
                    res.send(msj) 
                })
            } else{
                var msj = '<div class="alert alert-danger" role="alert"><button type="button" class="close" data-dismiss="alert">&times;</button> <strong>Error</strong> El rif ya existe.</div>';
                res.send(msj) 
            }
        })
    }
    
}

function mostrarEdit(req,res){
    var idrif = req.body.id;
    modeloRif.get_rif_por_id(idrif, (error, dato) => {
        res.send(dato)
    })
}

module.exports = {
    getRif,
    mostrar,
    cambiarestatus,
    guardaryeditar,
    mostrarEdit
}