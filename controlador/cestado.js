const passport = require("passport");
const modeloPais = require('../modelos/Mpais');
const modeloEstado = require('../modelos/Mestado');
const Utilidad = require('../ayuda/utilidad');

function getEstado(req, res){
    let usuario = req.session.passport.user;
    
    modeloEstado.get_estado( (error, estados) => { // si se pudo obtener los items
            if (error) { // si hubo error
                Utilidad.printError(res, {msg: `Error no se pudieron obtener los estados: ${error}`, tipo: 0});
                
            }else{
                // si no hubo error
                modeloPais.get_pais( (error, paises) => { // si se pudo obtener los items
                    if (error) { // si hubo error
                        Utilidad.printError(res, {msg: `Error no se pudieron obtener los estados: ${error}`, tipo: 0});

                    }else{
                        // si no hubo error
                        res.render('mestado', {estados, paises, usuario});
                    }
                })
            }
        })
};

function cambiarestatus(req, res){
    let codestado = req.body.codestado,
        est = req.body.est
    
    modeloEstado.editar_estatus_estado(codestado,est,(error, estado) => { // si se pudo obtener los estadoes
            if (error) { // si hubo error
                Utilidad.printError(res, {msg: `Error no se pudo cambiar el estatus: ${error}`, tipo: 0});
                
            }else{
                res.send(estado)
            }
            
        })
}

function mostrar(req,res){
    var estiloEstatus;
    var estatus;
    var cont;
    modeloEstado.get_estado( (error, estados) => {
        var pr = estados;
        for(var i = 0; pr[i]; i++){
          if(pr[i].estatus == 1){
              estiloEstatus = "btn btn-success btn-md estado";
              estatus = 'ACTIVO';
          }else{
              estiloEstatus = "btn btn-warning btn-md estado";
              estatus = 'INACTIVO';
          }
          cont = pr[i].estatus;
          pr[i].estatus = '<button type="button" onClick="cambiarEstado('+ pr[i].codestado+','+cont+');" name="estatus" id="'+pr[i].codestado+'" class="'+estiloEstatus+'">'+estatus+'</button>';
        };
        
            if(!error) res.send(pr) // se envia el estado seleccionado
        })
}

function guardaryeditar(req,res){
    var nombre = req.body.nombre;
    var codpais = req.body.codpais;
    
    var codestado = req.body.codestado;
    console.log(nombre, codpais, codestado, "asdsa");
    if(!codestado){ // si no se ejecuta desde el formulario de editar
        modeloEstado.get_nombre_estado(nombre, codpais, (error, dato) => {
            if(!dato[0]){ // si no existe el nombre
                modeloEstado.registrar_estado(nombre, codpais, (error,dato) => {
                    var msj = '<div class="alert alert-success" role="alert"><button type="button" class="close" data-dismiss="alert">&times;</button> <strong>¡Bien hecho!</strong> El estado se registro correctamente.</div>';
                    res.send(msj) 
                })
            } else{
                var msj = '<div class="alert alert-danger" role="alert"><button type="button" class="close" data-dismiss="alert">&times;</button> <strong>Error</strong> El estado ya existe.</div>';
                res.send(msj) 
            }
        })
    } else{ // si se ejecuta desde el formulario de editar
        modeloEstado.get_nombre_estado(nombre, codpais,(error, dato) => {
            if(!dato[0]){
                modeloEstado.editar_estado(nombre,codpais,codestado,(error,dato) => {
                    var msj = '<div class="alert alert-success" role="alert"><button type="button" class="close" data-dismiss="alert">&times;</button> <strong>¡Bien hecho!</strong> El estado se editó correctamente.</div>';
                    res.send(msj) 
                })
            } else{
                var msj = '<div class="alert alert-danger" role="alert"><button type="button" class="close" data-dismiss="alert">&times;</button> <strong>Error</strong> El estado ya existe.</div>';
                res.send(msj) 
            }
        })
    }
    
}

function mostrarEdit(req,res){
    var codestado = req.body.codestado;
    modeloEstado.get_estado_por_id(codestado, (error, dato) => {
        res.send(dato)
    })
}

module.exports = {
    getEstado,
    mostrar,
    cambiarestatus,
    guardaryeditar,
    mostrarEdit
}
