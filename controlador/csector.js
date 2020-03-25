const passport = require("passport");
const modeloPais = require('../modelos/Mpais');
const modeloEstado = require('../modelos/Mestado');
const modeloMunicipio = require('../modelos/Mmunicipio');
const modeloParroquia = require('../modelos/Mparroquia');

const modeloSector = require('../modelos/Msector');

const Utilidad = require('../ayuda/utilidad');

function getSector(req, res){
    let usuario = req.session.passport.user;
    
    modeloSector.get_sector( (error, sectores) => { // si se pudo obtener los items
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
                                modeloParroquia.get_parroquia( (error, parroquias) => {

                                res.render('msector', {sectores,parroquias,municipios, estados,paises, usuario});
                                })
                            })
                        })
                        // si no hubo error
                        
                    }
                })
            }
        })
};

function cambiarestatus(req, res){
    let codsector = req.body.codsector,
        est = req.body.est
    
    modeloSector.editar_estatus_sector(codsector,est,(error, sector) => { // si se pudo obtener los estadoes
            if (error) { // si hubo error
                Utilidad.printError(res, {msg: `Error no se pudo cambiar el estatus: ${error}`, tipo: 0});
                
            }else{
                res.send(sector)
            }
            
        })
}

function mostrar(req,res){
    var estiloEstatus;
    var estatus;
    var cont;
    modeloSector.get_sector( (error, sectores) => {
        var pr = sectores;
        for(var i = 0; pr[i]; i++){
          if(pr[i].estatus == 1){
              estiloEstatus = "btn btn-success btn-md estado";
              estatus = 'ACTIVO';
          }else{
              estiloEstatus = "btn btn-warning btn-md estado";
              estatus = 'INACTIVO';
          }
          cont = pr[i].estatus;
          pr[i].estatus = '<button type="button" onClick="cambiarEstado('+ pr[i].codsector+','+cont+');" name="estatus" id="'+pr[i].codsector+'" class="'+estiloEstatus+'">'+estatus+'</button>';
        };
        
            if(!error) res.send(pr) // se envia el estado seleccionado
        })
}

function guardaryeditar(req,res){
    var nombre = req.body.nombre;
    var codestado = req.body.codestado;
    var codparroquia = req.body.codparroquia;
    
    var codsector = req.body.codsector;

    if(!codsector){
        modeloSector.get_nombre_sector(nombre, codparroquia,(error, dato) => {
            if(!dato[0]){
                modeloSector.registrar_sector(nombre, codparroquia,(error,dato) => {
                    var msj = '<div class="alert alert-success" role="alert"><button type="button" class="close" data-dismiss="alert">&times;</button> <strong>¡Bien hecho!</strong> El sector se registro correctamente.</div>';
                    res.send(msj) 
                })
            } else{
                var msj = '<div class="alert alert-danger" role="alert"><button type="button" class="close" data-dismiss="alert">&times;</button> <strong>Error</strong> El sector ya existe.</div>';
                res.send(msj) 
            }
        })
    } else{
        modeloSector.get_nombre_sector(nombre, codparroquia,(error, dato) => {
            if(!dato[0]){
                modeloSector.editar_sector(nombre,codparroquia,codsector,(error,dato) => {
                    var msj = '<div class="alert alert-success" role="alert"><button type="button" class="close" data-dismiss="alert">&times;</button> <strong>¡Bien hecho!</strong> El sector se editó correctamente.</div>';
                    res.send(msj) 
                })
            } else{
                var msj = '<div class="alert alert-danger" role="alert"><button type="button" class="close" data-dismiss="alert">&times;</button> <strong>Error</strong> El sector ya existe.</div>';
                res.send(msj) 
            }
        })
    }
    
}

function mostrarEdit(req,res){
    var codsector = req.body.codsector;
    modeloSector.get_sector_por_id(codsector, (error, dato) => {
        res.send(dato)
    })
}

module.exports = {
    getSector,
    mostrar,
    cambiarestatus,
    guardaryeditar,
    mostrarEdit
}
