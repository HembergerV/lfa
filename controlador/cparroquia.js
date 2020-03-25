const passport = require("passport");
const modeloPais = require('../modelos/Mpais');
const modeloEstado = require('../modelos/Mestado');
const modeloParroquia = require('../modelos/Mparroquia');
const modeloMunicipio = require('../modelos/Mmunicipio');

const Utilidad = require('../ayuda/utilidad');

function getParroquia(req, res){
    let usuario = req.session.passport.user;
    
    modeloParroquia.get_parroquia( (error, parroquias) => { // si se pudo obtener los items
            if (error) { // si hubo error
                Utilidad.printError(res, {msg: `Error no se pudieron obtener los estados: ${error}`, tipo: 0});
                
            }else{
                // si no hubo error
                modeloPais.get_pais( (error, paises) => { // si se pudo obtener los items
                    if (error) { // si hubo error
                        Utilidad.printError(res, {msg: `Error no se pudieron obtener los estados: ${error}`, tipo: 0});

                    }else{
                        modeloEstado.get_estado( (error, estados) => {
                            modeloMunicipio.get_municipio( (error, municipios) => {
                            
                            res.render('mparroquia', {parroquias,municipios, estados,paises, usuario});
                            })
                        })
                        // si no hubo error
                        
                    }
                })
            }
        })
};

function cambiarestatus(req, res){
    let codparroquia = req.body.codparroquia,
        est = req.body.est
    
    modeloParroquia.editar_estatus_parroquia(codparroquia,est,(error, parroquia) => { // si se pudo obtener los estadoes
            if (error) { // si hubo error
                Utilidad.printError(res, {msg: `Error no se pudo cambiar el estatus: ${error}`, tipo: 0});
                
            }else{
                res.send(parroquia)
            }
            
        })
}

function mostrar(req,res){
    var estiloEstatus;
    var estatus;
    var cont;
    modeloParroquia.get_parroquia( (error, parroquias) => {
        var pr = parroquias;
        for(var i = 0; pr[i]; i++){
          if(pr[i].estatus == 1){
              estiloEstatus = "btn btn-success btn-md estado";
              estatus = 'ACTIVO';
          }else{
              estiloEstatus = "btn btn-warning btn-md estado";
              estatus = 'INACTIVO';
          }
          cont = pr[i].estatus;
          pr[i].estatus = '<button type="button" onClick="cambiarEstado('+ pr[i].codparroquia+','+cont+');" name="estatus" id="'+pr[i].codparroquia+'" class="'+estiloEstatus+'">'+estatus+'</button>';
        };
        
            if(!error) res.send(pr) // se envia el estado seleccionado
        })
}

function guardaryeditar(req,res){
    var nombre = req.body.nombre;
    var codestado = req.body.codestado;
    var codmunicipio = req.body.codmunicipio;
    
    var codparroquia = req.body.codparroquia;

    if(!codparroquia){
        modeloParroquia.get_nombre_parroquia(nombre, codmunicipio,(error, dato) => {
            if(!dato[0]){
                modeloParroquia.registrar_parroquia(nombre, codmunicipio,(error,dato) => {
                    var msj = '<div class="alert alert-success" role="alert"><button type="button" class="close" data-dismiss="alert">&times;</button> <strong>¡Bien hecho!</strong> El parroquia se registro correctamente.</div>';
                    res.send(msj) 
                })
            } else{
                var msj = '<div class="alert alert-danger" role="alert"><button type="button" class="close" data-dismiss="alert">&times;</button> <strong>Error</strong> El parroquia ya existe.</div>';
                res.send(msj) 
            }
        })
    } else{
        modeloParroquia.get_nombre_parroquia(nombre, codmunicipio,(error, dato) => {
            if(!dato[0]){
                modeloParroquia.editar_parroquia(nombre,codmunicipio,codparroquia,(error,dato) => {
                    var msj = '<div class="alert alert-success" role="alert"><button type="button" class="close" data-dismiss="alert">&times;</button> <strong>¡Bien hecho!</strong> El parroquia se editó correctamente.</div>';
                    res.send(msj) 
                })
            } else{
                var msj = '<div class="alert alert-danger" role="alert"><button type="button" class="close" data-dismiss="alert">&times;</button> <strong>Error</strong> El parroquia ya existe.</div>';
                res.send(msj) 
            }
        })
    }
    
}

function mostrarEdit(req,res){
    var codparroquia = req.body.codparroquia;
    modeloParroquia.get_parroquia_por_id(codparroquia, (error, dato) => {
        res.send(dato)
    })
}

module.exports = {
    getParroquia,
    mostrar,
    cambiarestatus,
    guardaryeditar,
    mostrarEdit
}
