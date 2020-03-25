const passport = require("passport");
const modeloMarca = require('../modelos/Mmarca');
const Utilidad = require('../ayuda/utilidad');

function getMarca(req, res){

    let usuario = req.session.passport.user;

    modeloMarca.get_marca( (error, marcas) => { // si se pudo obtener las marcas
            if (error) { // si hubo error
                Utilidad.printError(res, {msg: `Error no se pudieron obtener las marcas: ${error}`, tipo: 0});

            }else{
                // si no hubo error
                res.render('mmarca', {marcas, usuario});
            }
        })
};

function mostrar(req,res){
    var estiloEstatus;
    var estatus;
    var cont;

    modeloMarca.get_marca( (error, marcas) => {
        var pr = marcas;
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
    let idmarca = req.body.id,
        est = req.body.est

    modeloMarca.editar_estatus_marca(idmarca,est,(error, marca) => { // si se pudo obtener las marcas
            if (error) { // si hubo error
                Utilidad.printError(res, {msg: `Error no se pudo cambiar el estatus: ${error}`, tipo: 0});

            }else{
                res.send(marca)
            }

        })
}
function guardaryeditar(req,res){
    var nombre = req.body.nombre;
    var nombreO = req.body.nombreOriginal;

    var idmarca = req.body.id;
    var descripcion = req.body.descripcion;

    if(!idmarca){
        modeloMarca.get_nombre_marca(nombre, (error, dato) => {
            if(!dato[0]){
                modeloMarca.registrar_marca(nombre, descripcion, (error,dato) => {
                    var msj = '<div class="alert alert-success" role="alert"><button type="button" class="close" data-dismiss="alert">&times;</button> <strong>¡Bien hecho!</strong> La Marca se registró correctamente.</div>';
                    res.send(msj)
                })
            } else{
                var msj = '<div class="alert alert-danger" role="alert"><button type="button" class="close" data-dismiss="alert">&times;</button> <strong>Error</strong> La Marca ya existe.</div>';
                res.send(msj)
            }
        })
    } else{
        if(nombreO == nombre){
            modeloMarca.editar_marca(nombre, descripcion, idmarca,(error,dato) => {
                    var msj = '<div class="alert alert-success" role="alert"><button type="button" class="close" data-dismiss="alert">&times;</button> <strong>¡Bien hecho!</strong>  El cargo se editó correctamente.</div>';
                    res.send(msj)
                })
        }else{
            modeloMarca.get_nombre_marca(nombre, (error, dato) => {
                if(!dato[0]){
                    modeloMarca.editar_marca(nombre, descripcion, idmarca,(error,dato) => {
                        var msj = '<div class="alert alert-success" role="alert"><button type="button" class="close" data-dismiss="alert">&times;</button> <strong>¡Bien hecho!</strong> La Marca se editó correctamente.</div>';
                        res.send(msj)
                    })
                } else{
                    var msj = '<div class="alert alert-danger" role="alert"><button type="button" class="close" data-dismiss="alert">&times;</button> <strong>Error</strong> La Marca ya existe.</div>';
                    res.send(msj)
                }
            })
          }
    }

}

function mostrarEdit(req,res){
    var idmarca = req.body.id;
    modeloMarca.get_marca_por_id(idmarca, (error, dato) => {
        res.send(dato)
    })
}

module.exports = {
    getMarca,
    mostrar,
    cambiarestatus,
    guardaryeditar,
    mostrarEdit
}
