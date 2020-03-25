const passport = require("passport");
const modeloInventario = require('../modelos/Minventario');
const modeloRepuesto = require('../modelos/Mrepuesto');
const modeloMarca = require('../modelos/Mmarca');
const modeloSublinea = require('../modelos/Msublinea');
const modeloLinea = require('../modelos/Mlinea');
const modeloRif = require('../modelos/Mrif');
const modeloProveedor = require('../modelos/Mproveedor');
const Utilidad = require('../ayuda/utilidad');

function getInventario(req, res){
    let usuario = req.session.passport.user;
    
    modeloInventario.get_inventario( (error, repuestos) => { // si se pudo obtener los paises
            if (error) { // si hubo error
                Utilidad.printError(res, {msg: `Error no se pudieron obtener los repuestos: ${error}`, tipo: 0});
                
            }else{
                // si no hubo error
                modeloMarca.get_marca( (error, marcas) => {
                    modeloSublinea.get_sublinea( (error, sublineas) => {
                        modeloLinea.get_linea( (error, lineas) => {
                            modeloRepuesto.get_repuesto( (error, items) => {
                                modeloRif.get_rif( (error, rifs) => {
                                    modeloProveedor.get_proveedor( (error, proveedores) => {
                                        res.render('mcatalogo', {proveedores,rifs,items,lineas,sublineas,marcas, repuestos, usuario});
                                    })
                                })
                            })
                        })
                    })
                })
            }
        })
};

function cambiarestatus(req, res){
    let idinventario = req.body.idinventario,
        est = req.body.est
    modeloInventario.editar_estatus_repuesto(idinventario,est,(error, repuesto) => { // si se pudo obtener los paises
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
    
    modeloInventario.get_inventario( (error, repuestos) => {
        var pr = repuestos;
        for(var i = 0; pr[i]; i++){
          if(pr[i].estatus_inventario == 1){
              estiloEstatus = "btn btn-success btn-md estado";
              estatus = 'ACTIVO';
          }else{
              estiloEstatus = "btn btn-warning btn-md estado";
              estatus = 'INACTIVO';
          }
          
          cont = pr[i].estatus_inventario;
          pr[i].estatus_inventario = '<button type="button" onClick="cambiarEstado('+ pr[i].idinventario+','+cont+');" name="estatus" id="'+pr[i].idinventario+'" class="'+estiloEstatus+'">'+estatus+'</button>';
        };
        
            if(!error) res.send(pr) // se envia el repuesto seleccionado
        })
}

function guardar(req,res){
    var bandera = true;
    if(req.body.valor){
        modeloInventario.get_repuesto_por_id(req.body.id, (error, items) => {
            for(var i = 0; i < req.session.pedido.length; i++){
                if(req.session.pedido[i].id == req.body.id){
                    req.session.pedido[i].valor = req.body.valor;
                    bandera = false;
                }
            }

            if(bandera){
                req.session.pedido[req.session.contador] = {id: req.body.id, valor: req.body.valor, precio: items[0].precio};
                req.session.contador += 1;
            }
            res.send("msj");   
        })
    }
}
function guardarEditar(req,res){
    var idrepuesto = req.body.idrepuestoEdit;
    var precio = req.body.precioEdit;
    var cantidad = req.body.cantidadEdit;
    
    modeloInventario.editar_inventario(idrepuesto,cantidad,precio,(error,dato) => {
        var msj = '<div class="alert alert-success" role="alert"><button type="button" class="close" data-dismiss="alert">&times;</button> <strong>¡Bien hecho!</strong> El repuesto se editó correctamente.</div>';
        res.send(msj) 
    })
}
function mostrarEdit(req,res){
    var idrepuesto = req.body.idrepuesto;
    modeloRepuesto.get_repuesto_por_id(idrepuesto, (error, dato) => {
        res.send(dato)
    })
    
}function mostrarEditEdit(req,res){
    var idrepuesto = req.body.idrepuesto;
    modeloInventario.get_repuesto_por_id(idrepuesto, (error, dato) => {
        res.send(dato)
    })
}

module.exports = {
    getInventario,
    mostrar,
    cambiarestatus,
    guardar,
    mostrarEdit,
    mostrarEditEdit,
    guardarEditar
}
