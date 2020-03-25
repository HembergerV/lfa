const passport = require("passport");
const modeloRepuesto = require('../modelos/Mrepuesto');
const modeloMarca = require('../modelos/Mmarca');
const modeloSublinea = require('../modelos/Msublinea');
const modeloLinea = require('../modelos/Mlinea');
const Utilidad = require('../ayuda/utilidad');

function getRepuesto(req, res){
    let usuario = req.session.passport.user;
    
    modeloRepuesto.get_repuesto( (error, repuestos) => { // si se pudo obtener los paises
            if (error) { // si hubo error
                Utilidad.printError(res, {msg: `Error no se pudieron obtener los repuestos: ${error}`, tipo: 0});
                
            }else{
                // si no hubo error
                modeloMarca.get_marca( (error, marcas) => {
                    modeloSublinea.get_sublinea( (error, sublineas) => {
                        modeloLinea.get_linea( (error, lineas) => {
                            res.render('mrepuesto', {lineas,sublineas,marcas, repuestos, usuario});
                        })
                    })
                })
            }
        })
};

function cambiarestatus(req, res){
    let idrepuesto = req.body.idrepuesto,
        est = req.body.est
    modeloRepuesto.editar_estatus_repuesto(idrepuesto,est,(error, repuesto) => { // si se pudo obtener los paises
            if (error) { // si hubo error
                Utilidad.printError(res, {msg: `Error no se pudo cambiar el estatus: ${error}`, tipo: 0});
                
            }else{
                res.send(repuesto)
            }
            
        })
}

function mostrar(req,res){
    var estiloEstatus;
    var estatus;
    var cont;
    
    modeloRepuesto.get_repuesto( (error, repuestos) => {
        var pr = repuestos;
        for(var i = 0; pr[i]; i++){
          if(pr[i].estatus == 1){
              estiloEstatus = "btn btn-success btn-md estado";
              estatus = 'ACTIVO';
          }else{
              estiloEstatus = "btn btn-warning btn-md estado";
              estatus = 'INACTIVO';
          }
          
          cont = pr[i].estatus;
          pr[i].estatus = '<button type="button" onClick="cambiarEstado('+ pr[i].idrepuesto+','+cont+');" name="estatus" id="'+pr[i].idrepuesto+'" class="'+estiloEstatus+'">'+estatus+'</button>';
        };
        
            if(!error) res.send(pr) // se envia el repuesto seleccionado
        })
}

function guardaryeditar(req,res){
    var idrepuesto = req.body.idrepuesto;
    var idsublinea = req.body.idsublinea;
    var idlinea = req.body.idlinea;
    var idmarca = req.body.marca;
    var minimo = req.body.minimo;
    var numero_parte = req.body.numero_parte;
    var numero_parte_secundario = req.body.numero_parte_secundario;
    var referenciaO = req.body.referenciaOriginal;
    var referencia = req.body.referencia;
    
    var descripcion = req.body.descripcion;
    
    //console.log(idrepuesto,idsublinea,idlinea,idmarca,minimo,numero_parte,numero_parte_secundario,referencia,descripcion);
    
    if(!idrepuesto){ // si no se ejecuta desde el formulario de editar
        modeloRepuesto.get_repuesto_por_referencia(referencia, numero_parte,(error, dato) => {
            if(!dato[0]){ // si no existe el nombre
                modeloRepuesto.registrar_repuesto(idsublinea,idmarca,minimo,numero_parte,numero_parte_secundario,referencia,descripcion,(error,dato) => {
                    var msj = '<div class="alert alert-success" role="alert"><button type="button" class="close" data-dismiss="alert">&times;</button> <strong>¡Bien hecho!</strong> El repuesto se registró correctamente.</div>';
                    res.send(msj) 
                })
            } else{
                var msj = '<div class="alert alert-danger" role="alert"><button type="button" class="close" data-dismiss="alert">&times;</button> <strong>Error</strong> El repuesto ya existe.</div>';
                res.send(msj) 
            }
        })
    } else{ // si se ejecuta desde el formulario de editar
        if(referenciaO == referencia){
            modeloRepuesto.editar_repuesto(idsublinea,idmarca,minimo,numero_parte,numero_parte_secundario,referencia, descripcion,idrepuesto,(error,dato) => {
                    var msj = '<div class="alert alert-success" role="alert"><button type="button" class="close" data-dismiss="alert">&times;</button> <strong>¡Bien hecho!</strong> El repuesto se editó correctamente.</div>';
                    res.send(msj) 
                })
        } else{
            modeloRepuesto.get_repuesto_por_referencia(referencia,numero_parte,(error, dato) => {
            if(!dato[0]){
                modeloRepuesto.editar_repuesto(idsublinea,idmarca,minimo,numero_parte,numero_parte_secundario,referencia, descripcion,idrepuesto,(error,dato) => {
                    var msj = '<div class="alert alert-success" role="alert"><button type="button" class="close" data-dismiss="alert">&times;</button> <strong>¡Bien hecho!</strong> El repuesto se editó correctamente.</div>';
                    res.send(msj) 
                })
            } else{
                var msj = '<div class="alert alert-danger" role="alert"><button type="button" class="close" data-dismiss="alert">&times;</button> <strong>Error</strong> El repuesto ya existe.</div>';
                res.send(msj) 
            }
        })
        }
        
    }
    
}

function mostrarEdit(req,res){
    var idrepuesto = req.body.idrepuesto;
    modeloRepuesto.get_repuesto_por_id(idrepuesto, (error, dato) => {
        res.send(dato)
    })
}

module.exports = {
    getRepuesto,
    mostrar,
    cambiarestatus,
    guardaryeditar,
    mostrarEdit
}
