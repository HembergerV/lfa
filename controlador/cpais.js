const passport = require("passport");
const modeloPais = require('../modelos/Mpais');
const Utilidad = require('../ayuda/utilidad');
const xlsx = require('xlsx');

function getPais(req, res){
    let usuario = req.session.passport.user;
    // var wb = xlsx.readFile("controlador/inventario.xlsx",{cellDates: true});
    // var ws = wb.Sheets["Data"];
    //
    // var data = xlsx.utils.sheet_to_json(ws);


    modeloPais.get_pais( (error, paises) => { // si se pudo obtener los paises
            if (error) { // si hubo error
                Utilidad.printError(res, {msg: `Error no se pudieron obtener los paises: ${error}`, tipo: 0});

            }else{
                // si no hubo error
                res.render('mpais', {paises, usuario});
            }
        })
};

function cambiarestatus(req, res){
    let codpais = req.body.codpais,
        est = req.body.est

    modeloPais.editar_estatus_pais(codpais,est,(error, estado) => { // si se pudo obtener los paises
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

    modeloPais.get_pais( (error, paises) => {
        var pr = paises;
        for(var i = 0; pr[i]; i++){
          if(pr[i].estatus == 1){
              estiloEstatus = "btn btn-success btn-md estado";
              estatus = 'ACTIVO';
          }else{
              estiloEstatus = "btn btn-warning btn-md estado";
              estatus = 'INACTIVO';
          }

          cont = pr[i].estatus;
          pr[i].estatus = '<button type="button" onClick="cambiarEstado('+ pr[i].codpais+','+cont+');" name="estatus" id="'+pr[i].codpais+'" class="'+estiloEstatus+'">'+estatus+'</button>';
        };

            if(!error) res.send(pr) // se envia el pais seleccionado
        })
}

function guardaryeditar(req,res){
    var nombre = req.body.nombre;
    var codpais = req.body.codpais;
    var archivo = req.body.archivo;
    if(!codpais){
        modeloPais.get_nombre_pais(nombre, (error, dato) => {
            if(!dato[0]){
                modeloPais.registrar_pais(nombre,(error,dato) => {
                    var msj = '<div class="alert alert-success" role="alert"><button type="button" class="close" data-dismiss="alert">&times;</button> <strong>¡Bien hecho!</strong> El país se registro correctamente.</div>';

                })
            } else{
                var msj = '<div class="alert alert-danger" role="alert"><button type="button" class="close" data-dismiss="alert">&times;</button> <strong>Error</strong> El país ya existe.</div>';
                res.send(msj)
            }
        })
    } else{
        modeloPais.get_nombre_pais(nombre, (error, dato) => {
            if(!dato[0]){
                modeloPais.editar_pais(nombre,codpais,(error,dato) => {
                    var msj = '<div class="alert alert-success" role="alert"><button type="button" class="close" data-dismiss="alert">&times;</button> <strong>¡Bien hecho!</strong> El pais se editó correctamente.</div>';
                    res.send(msj)
                })
            } else{
                var msj = '<div class="alert alert-danger" role="alert"><button type="button" class="close" data-dismiss="alert">&times;</button> <strong>Error</strong> El país ya existe.</div>';
                res.send(msj)
            }
        })
    }

}

function mostrarEdit(req,res){
    var codpais = req.body.codpais;
    modeloPais.get_pais_por_id(codpais, (error, dato) => {
        res.send(dato)
    })
}

module.exports = {
    getPais,
    mostrar,
    cambiarestatus,
    guardaryeditar,
    mostrarEdit
}
