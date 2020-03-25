const passport = require("passport");
const modeloUsuario = require('../modelos/Musuario');
const modeloNacionalidad = require('../modelos/Mnacionalidad');
const modeloCargo = require('../modelos/Mcargo');
const modeloDepartamento = require('../modelos/Mdpto');
const Utilidad = require('../ayuda/utilidad');

function getUsuario(req, res){
    let usuario = req.session.passport.user;
    modeloUsuario.get_usuario( (error, usuarios) => { // si se pudo obtener los paises
            if (error) { // si hubo error
                Utilidad.printError(res, {msg: `Error no se pudieron obtener los usuarios: ${error}`, tipo: 0});

            }else{
                // si no hubo error
                modeloNacionalidad.get_nacionalidad( (error, nacionalidades) => {
                            modeloCargo.get_cargo( (error, cargos) => {
                                modeloDepartamento.get_dpto( (error, departamentos) => {
                                    res.render('usuario', {usuarios,nacionalidades, cargos, departamentos, usuario});
                                })
                            })
                        })
            }
        })
};

function cambiarestatus(req, res){
    let idusuario = req.body.idusuario,
        est = req.body.estatus

    modeloUsuario.editar_estatus_usuario(idusuario,est,(error, usuario) => { // si se pudo obtener los paises
            if (error) { // si hubo error
                Utilidad.printError(res, {msg: `Error no se pudo cambiar el estatus: ${error}`, tipo: 0});

            }else{
                res.send(usuario)
            }

        })
}

function mostrar(req,res){
    var estiloEstatus;
    var estatus;
    var cont;

    modeloUsuario.get_usuario( (error, usuarios) => {
        for(var i = 0; usuarios[i]; i++){
          if(usuarios[i].estatus == 1){
              estiloEstatus = "btn btn-success btn-md estado";
              estatus = 'ACTIVO';
          }else{
              estiloEstatus = "btn btn-warning btn-md estado";
              estatus = 'INACTIVO';
          }
          cont = usuarios[i].estatus;
          usuarios[i].estatus = '<button type="button" onClick="cambiarEstado('+ usuarios[i].idusuario+','+cont+');" name="estatus" id="'+usuarios[i].idusuario+'" class="'+estiloEstatus+'">'+estatus+'</button>';
        };

            if(!error) res.send(usuarios) // se envia el pais seleccionado
        })
}

function registraryeditar(req,res){
    var idusuario = req.body.idusuario;
    var nacionalidad = req.body.nacionalidad;
    var cedula = req.body.cedula;
    var nombre = req.body.nombre;
    var apellido = req.body.apellido;
    var fechanacimiento = req.body.fechanacimiento;
    var tlf = req.body.telefono;
    var email = req.body.email;
    var direccion = req.body.direccion;
    var fechaing = req.body.fechaingreso;
    var coddpto = req.body.coddpto;
    var cargo = req.body.cargo;
    var usuario = req.body.usuario;
    var password = req.body.password;
    var password2 = req.body.password2;
    if(!idusuario){
        modeloUsuario.get_cedula_correo(cedula, email,(error, dato) => {

            if(!dato[0]){

                modeloUsuario.registrar_usuario(nombre,apellido,nacionalidad,cedula,fechanacimiento,tlf,email,direccion,coddpto,cargo,usuario,password,password2,(error,dato) => {

                    var msj = '<div class="alert alert-success" role="alert"><button type="button" class="close" data-dismiss="alert">&times;</button> <strong>¡Bien hecho!</strong> El usuario se registró correctamente.</div>';
                    res.send(msj)
                })
            } else{
                var msj = '<div class="alert alert-danger" role="alert"><button type="button" class="close" data-dismiss="alert">&times;</button> <strong>Error</strong> La cédula o el correo ya existe.</div>';
                res.send(msj)
            }
        })
    } else{
        modeloUsuario.get_cedula_correo(cedula, email, (error, dato) => {
            if(!dato[0]){
                modeloUsuario.editar_usuario(nombre,apellido,nacionalidad,cedula,fechanacimiento,tlf,email,direccion,coddpto,cargo,usuario,password,password2,idusuario,(error,dato) => {
                    if (error) { // si hubo error
                        Utilidad.printError(res, {msg: `Error no se pudo cambiar el estatus: ${error}`, tipo: 0});

                    }else{
                    var msj = '<div class="alert alert-success" role="alert"><button type="button" class="close" data-dismiss="alert">&times;</button> <strong>¡Bien hecho!</strong> El usuario se editó correctamente.</div>';
                    res.send(msj)
                    }
                })
            } else{
                var msj = '<div class="alert alert-danger" role="alert"><button type="button" class="close" data-dismiss="alert">&times;</button> <strong>Error</strong> La cédula o el correo ya existe.</div>';
                res.send(msj)
            }
        })
    }

}

function mostrarEdit(req,res){
    var idusuario = req.body.idusuario;
    modeloUsuario.get_usuario_por_id(idusuario, (error, dato) => {
        res.send(dato)
    })
}

module.exports = {
    getUsuario,
    mostrar,
    cambiarestatus,
    registraryeditar,
    mostrarEdit
}
