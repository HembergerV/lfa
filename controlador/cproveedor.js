const passport = require("passport");
const modeloProveedor = require('../modelos/Mproveedor');
const modeloMarca = require('../modelos/Mmarca');
const modeloRif = require('../modelos/Mrif');
const Utilidad = require('../ayuda/utilidad');

function getProveedor(req, res){
    let usuario = req.session.passport.user;
    
    modeloProveedor.get_proveedor( (error, proveedores) => { // si se pudo obtener los paises
            if (error) { // si hubo error
                Utilidad.printError(res, {msg: `Error no se pudieron obtener los proveedores: ${error}`, tipo: 0});
                
            }else{
                modeloMarca.get_marca( (error, marcas) => {
                    modeloRif.get_rif( (error, rifs) => {
                        res.render('mproveedor', {proveedores, marcas, rifs, usuario});
                    })
                 
            })
        }
            
})
};

function cambiarestatus(req, res){
    let idproveedor = req.body.id,
        est = req.body.est
    
    modeloProveedor.editar_estatus_proveedor(idproveedor,est,(error, proveedor) => { // si se pudo obtener los paises
            if (error) { // si hubo error
                Utilidad.printError(res, {msg: `Error no se pudo cambiar el estatus: ${error}`, tipo: 0});
                
            }else{
                res.send(proveedor)
            }
            
        })
}

function mostrar(req,res){
    var estiloEstatus;
    var estatus;
    var cont;
    
    modeloProveedor.get_proveedor( (error, proveedores) => {
        var pr = proveedores;
        for(var i = 0; pr[i]; i++){
          if(pr[i].estatus == 1){
              estiloEstatus = "btn btn-success btn-md estado";
              estatus = 'ACTIVO';
          }else{
              estiloEstatus = "btn btn-warning btn-md estado";
              estatus = 'INACTIVO';
          }
          
          cont = pr[i].estatus;
          pr[i].estatus = '<button type="button" onClick="cambiarEstado('+ pr[i].idproveedor+','+cont+');" name="estatus" id="'+pr[i].idproveedor+'" class="'+estiloEstatus+'">'+estatus+'</button>';
        };
        
            if(!error) res.send(pr) // se envia el pais seleccionado
        })
}

function guardaryeditar(req,res){
    var idproveedor = req.body.idproveedor;
    var tiporif = req.body.tiporif;
    var rif = req.body.rif;
    var nombre = req.body.nombre;
    var email = req.body.email;
    var telefono = req.body.telefono;
    var nota = req.body.nota;

    if(!idproveedor){
        modeloProveedor.get_nombre_rif_proveedor(nombre,rif,(error, dato) => {
            if(!dato[0]){
                modeloProveedor.registrar_proveedor(tiporif,rif,nombre,email,telefono,nota,(error,dato) => {
                    var msj = '<div class="alert alert-success" role="alert"><button type="button" class="close" data-dismiss="alert">&times;</button> <strong>¡Bien hecho!</strong> El proveedor se registró correctamente.</div>';
                    res.send(msj) 
                })
            } else{
                var msj = '<div class="alert alert-danger" role="alert"><button type="button" class="close" data-dismiss="alert">&times;</button> <strong>Error</strong> El nombre o rif ya existe.</div>';
                res.send(msj) 
            }
        })
    } else{
        modeloProveedor.get_nombre_rif_proveedor(nombre,rif, (error, dato) => {
            if(!dato[0]){
                modeloProveedor.editar_proveedor(tiporif,rif,nombre,email,telefono,nota,idproveedor,(error,dato) => {
                    if (error) { // si hubo error
                        Utilidad.printError(res, {msg: `Error no se pudo cambiar el estatus: ${error}`, tipo: 0});

                    }else{
                    var msj = '<div class="alert alert-success" role="alert"><button type="button" class="close" data-dismiss="alert">&times;</button> <strong>¡Bien hecho!</strong> El proveedor se editó correctamente.</div>';
                    res.send(msj) 
                    }
                })
            } else{
                var msj = '<div class="alert alert-danger" role="alert"><button type="button" class="close" data-dismiss="alert">&times;</button> <strong>Error</strong> El nombre o rif ya existe.</div>';
                res.send(msj) 
            }
        })
    }
    
}

function mostrarEdit(req,res){
    var idproveedor = req.body.idproveedor;
    modeloProveedor.get_proveedor_por_id(idproveedor, (error, dato) => {
        res.send(dato)
    })
}

module.exports = {
    getProveedor,
    mostrar,
    cambiarestatus,
    guardaryeditar,
    mostrarEdit
}
