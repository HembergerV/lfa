const passport = require("passport");
const modeloUseroles = require('../modelos/Museroles');
const modeloRoles = require('../modelos/Mroles');
const modeloUsuario = require('../modelos/Musuario');

const Utilidad = require('../ayuda/utilidad');

function getUseroles(req, res){
    
    let usuario = req.session.passport.user;

    modeloUseroles.get_useroles( (error, useroles) => { 
            if (error) { // si hubo error
                Utilidad.printError(res, {msg: `Error no se pudieron obtener los campos: ${error}`, tipo: 0});
            }else{
                modeloRoles.get_roles( (error, roles) => {   
                    modeloUsuario.get_usuario( (error, usuarios) => {
                        res.render('museroles', {roles,useroles,usuarios, usuario});
                    })
                })
            }
        })
};

function mostrar(req,res){
    var estiloEstatus;
    var estatus;
    var cont;
    
    modeloUseroles.get_useroles( (error, useroles) => {
        var pr = useroles;
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
    let iduseroles = req.body.id,
        est = req.body.est
    
    modeloUseroles.editar_estatus_useroles(iduseroles,est,(error, useroles) => { // si se pudo obtener las marcas
            if (error) { // si hubo error
                Utilidad.printError(res, {msg: `Error no se pudo cambiar el estatus: ${error}`, tipo: 0});
                
            }else{
                res.send(useroles)
            }
            
        })
}

function guardaryeditar(req,res){
    var id = req.body.id;
    var idusuario = req.body.idusuario;
    var idroles = req.body.idroles;

    if(!id){
         modeloUseroles.get_idusuario_useroles(idusuario, (error, dato) => {
            if(!dato[0]){
                modeloUseroles.registrar_useroles(idusuario, idroles, (error,dato) => {
                    var msj = '<div class="alert alert-success" role="alert"><button type="button" class="close" data-dismiss="alert">&times;</button> <strong>¡Bien hecho!</strong> El rol se asignó correctamente.</div>';
                    res.send(msj) 
                })
            }  else{
                var msj = '<div class="alert alert-danger" role="alert"><button type="button" class="close" data-dismiss="alert">&times;</button> <strong>Error</strong> El usuario ya posee un rol asignado.</div>';
                res.send(msj) 
            }
         })

    } else{
        modeloUseroles.editar_useroles(idusuario, idroles, id,(error,dato) => {
            var msj = '<div class="alert alert-success" role="alert"><button type="button" class="close" data-dismiss="alert">&times;</button> <strong>¡Bien hecho!</strong> El rol se editó correctamente.</div>';
            res.send(msj) 
        })
            
    }
}
    

function mostrarEdit(req,res){
    var iduseroles = req.body.id;
    modeloUseroles.get_useroles_por_id(iduseroles, (error, dato) => {
        res.send(dato)
    })
}

module.exports = {
    getUseroles,
    mostrar,
    cambiarestatus,
    guardaryeditar,
    mostrarEdit
}