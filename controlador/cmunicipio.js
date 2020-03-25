const passport = require("passport");
const modeloPais = require('../modelos/Mpais');
const modeloEstado = require('../modelos/Mestado');
const modeloMunicipio = require('../modelos/Mmunicipio');

const Utilidad = require('../ayuda/utilidad');

function getMunicipio(req, res){
    let usuario = req.session.passport.user;
    
    modeloMunicipio.get_municipio( (error, municipios) => { // si se pudo obtener los items
            if (error) { // si hubo error
                Utilidad.printError(res, {msg: `Error no se pudieron obtener los municipios: ${error}`, tipo: 0});
                
            }else{
                // si no hubo error
                modeloPais.get_pais( (error, paises) => { // si se pudo obtener los items
                    if (error) { // si hubo error
                        Utilidad.printError(res, {msg: `Error no se pudieron obtener los estados: ${error}`, tipo: 0});

                    }else{
                        modeloEstado.get_estado( (error, estados) => {
                            res.render('mmunicipio', {municipios, estados,paises, usuario});
                        })
                        // si no hubo error
                        
                    }
                })
            }
        })
};

function cambiarestatus(req, res){
    let codmunicipio = req.body.codmunicipio,
        est = req.body.est
    
    modeloMunicipio.editar_estatus_municipio(codmunicipio,est,(error, municipio) => { // si se pudo obtener los municipioes
            if (error) { // si hubo error
                Utilidad.printError(res, {msg: `Error no se pudo cambiar el estatus: ${error}`, tipo: 0});
                
            }else{
                res.send(municipio)
            }
            
        })
}

function mostrar(req,res){
    var estiloEstatus;
    var estatus;
    var cont;

    modeloMunicipio.get_municipio( (error, municipios) => {

        var pr = municipios;
        for(var i = 0; pr[i]; i++){
          if(pr[i].estatus == 1){
              estiloEstatus = "btn btn-success btn-md estado";
              estatus = 'ACTIVO';
          }else{
              estiloEstatus = "btn btn-warning btn-md estado";
              estatus = 'INACTIVO';
          }
          cont = pr[i].estatus;
          pr[i].estatus = '<button type="button" onClick="cambiarEstado('+ pr[i].codmunicipio+','+cont+');" name="estatus" id="'+pr[i].codmunicipio+'" class="'+estiloEstatus+'">'+estatus+'</button>';
        };
            if(!error) res.send(pr) // se envia el municipio seleccionado
        })
}

function guardaryeditar(req,res){
    var nombre = req.body.nombre;
    var codestado = req.body.codestado;

    var codmunicipio = req.body.codmunicipio;
        
    //console.log(nombre, codestado, codmunicipio,"ASDASDSAD");
    if(!codmunicipio){
        modeloMunicipio.get_nombre_municipio(nombre, codestado,(error, dato) => {
            if(!dato[0]){
                modeloMunicipio.registrar_municipio(nombre, codestado,(error,dato) => {
                    var msj = '<div class="alert alert-success" role="alert"><button type="button" class="close" data-dismiss="alert">&times;</button> <strong>¡Bien hecho!</strong> El municipio se registro correctamente.</div>';
                    res.send(msj) 
                })
            } else{
                var msj = '<div class="alert alert-danger" role="alert"><button type="button" class="close" data-dismiss="alert">&times;</button> <strong>Error</strong> El municipio ya existe.</div>';
                res.send(msj) 
            }
        })
    } else{
        modeloMunicipio.get_nombre_municipio(nombre, codestado,(error, dato) => {
            if(!dato[0]){
                modeloMunicipio.editar_municipio(nombre,codestado,codmunicipio,(error,dato) => {
                    var msj = '<div class="alert alert-success" role="alert"><button type="button" class="close" data-dismiss="alert">&times;</button> <strong>¡Bien hecho!</strong> El municipio se editó correctamente.</div>';
                    res.send(msj) 
                })
            } else{
                var msj = '<div class="alert alert-danger" role="alert"><button type="button" class="close" data-dismiss="alert">&times;</button> <strong>Error</strong> El municipio ya existe.</div>';
                res.send(msj) 
            }
        })
    }
    
}

function mostrarEdit(req,res){
    var codmunicipio = req.body.codmunicipio;
    modeloMunicipio.get_municipio_por_id(codmunicipio, (error, dato) => {
        res.send(dato)
    })
}

module.exports = {
    getMunicipio,
    mostrar,
    cambiarestatus,
    guardaryeditar,
    mostrarEdit
}
