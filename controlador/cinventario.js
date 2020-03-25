const passport = require("passport");
const modeloInventario = require('../modelos/Minventario');
const modeloRepuesto = require('../modelos/Mrepuesto');
const modeloMarca = require('../modelos/Mmarca');
const modeloSublinea = require('../modelos/Msublinea');
const modeloLinea = require('../modelos/Mlinea');
const modeloRif = require('../modelos/Mrif');
const modeloProveedor = require('../modelos/Mproveedor');
const Utilidad = require('../ayuda/utilidad');
var url = require('url');

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
                                        modeloInventario.get_tasa( (error, tasa) => {
                                        res.render('minventario', {proveedores,rifs,items,lineas,sublineas,marcas, repuestos,tasa, usuario});
                                    })
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
    var idrepuesto = req.body.idrepuesto;
    var idproveedor = req.body.idproveedor;
    var nombreProveedor = req.body.nombreOriginal
    let usuario = req.session.passport.user;
    var cantidad = req.body.cantidad;
    var nota = req.body.nota;
    var fecha = new Date();
    fecha = fecha.toLocaleString();

    var precio = 0;

    var estante = req.body.estante;
    var fila = req.body.fila;
    var columna = req.body.columna;


    modeloInventario.get_repuesto_por_id(idrepuesto,(error, dato) => {
        if(!dato[0]){ // si no existe el repuesto en el inventario
            modeloInventario.cargar_inventario(idrepuesto,cantidad,precio,estante, fila, columna,(error,dato) => {
                modeloInventario.registrar_movimiento(nombreProveedor,idrepuesto,usuario.id,fecha,cantidad,1,nota,(error,dato) => {
                    if (error) { // si hubo error
                        Utilidad.printError(res, {msg: `Error no se pudieron obtener los repuestos: ${error}`, tipo: 0});
                    }
                });
                modeloInventario.prov_repuesto(idproveedor,idrepuesto,cantidad,fecha,(error,dato) => {
                    if (error) { // si hubo error
                        Utilidad.printError(res, {msg: `Error no se pudieron obtener los repuestos: ${error}`, tipo: 0});
                    }
                });
                var msj = '<div class="alert alert-success" role="alert"><button type="button" class="close" data-dismiss="alert">&times;</button> <strong>¡Bien hecho!</strong> El repuesto se cargó correctamente.</div>';
                res.send(msj)
            })
        } else{
            modeloInventario.get_cantidad(idrepuesto,(error,stock) => {
                modeloInventario.registrar_movimiento(nombreProveedor,idrepuesto,usuario.id,fecha,cantidad,1,nota,(error,dato) => {
                    if (error) { // si hubo error
                        Utilidad.printError(res, {msg: `Error no se pudieron obtener los repuestos: ${error}`, tipo: 0});
                    }
                });
                modeloInventario.prov_repuesto(idproveedor,idrepuesto,cantidad,fecha,(error,dato) => {
                    if (error) { // si hubo error
                        Utilidad.printError(res, {msg: `Error no se pudieron obtener los repuestos: ${error}`, tipo: 0});
                    }
                });
                modeloInventario.sumar_inventario(idrepuesto,cantidad,stock[0].cantidad,(error,dato) => {
                    var msj = '<div class="alert alert-success" role="alert"><button type="button" class="close" data-dismiss="alert">&times;</button> <strong>¡Bien hecho!</strong> El repuesto se sumó correctamente.</div>';
                    res.send(msj)
                })
            })
        }
    })
}
function guardarEditar(req,res){
    var idrepuesto = req.body.idrepuestoEdit;
    var precio = req.body.precioEdit;
    var cantidad = req.body.cantidadEdit;
    var cantidadO = req.body.cantidadEditOriginal;

    var estante = req.body.estante;
    var fila = req.body.fila;
    var columna = req.body.columna;

    precio = precio.replace(",",".");

    var concepto = "MODIFICACIÓN";
    var nota = "AJUSTE EN LA EXISTENCIA DEL REPUESTO";
    let usuario = req.session.passport.user;

    var fecha = new Date();
    fecha = fecha.toLocaleString();

    modeloInventario.editar_inventario(estante,fila,columna,idrepuesto,cantidad,precio,(error,dato) => {
        if (error) { // si hubo error
                Utilidad.printError(res, {msg: `Error no se pudieron obtener los repuestos: ${error}`, tipo: 0});

        }else {
            if(cantidad != cantidadO){
              var total = cantidadO - cantidad;
              if(total > 0){
                var accion = 2
              } else{
                var accion = 1;
                total = total * -1;
              }
              modeloInventario.registrar_movimiento(concepto,idrepuesto,usuario.id,fecha,total,accion,nota,(error,dato) => {
                  if (error) { // si hubo error
                      Utilidad.printError(res, {msg: `Error no se pudieron obtener los repuestos: ${error}`, tipo: 0});
                  }
              });
            }
            var msj = '<div class="alert alert-success" role="alert"><button type="button" class="close" data-dismiss="alert">&times;</button> <strong>¡Bien hecho!</strong> El repuesto se editó correctamente.</div>';
            res.send(msj);
        }
    })
}
function mostrarEdit(req,res){
    var idrepuesto = req.body.idrepuesto;
    modeloInventario.get_repuesto_por_id(idrepuesto,(error, dato) => {
        if(!dato[0]){ // si no existe el repuesto en el inventario
            modeloRepuesto.get_repuesto_por_id(idrepuesto, (error, dato) => {
                res.send(dato)
            })
        } else{
            modeloRepuesto.get_repuestoUbicacion_por_id(idrepuesto, (error, dato) => {
                res.send(dato)
            })
        }
      })

}
function mostrarEditEdit(req,res){
    var idrepuesto = req.body.idrepuesto;
    modeloInventario.get_repuesto_por_id(idrepuesto, (error, dato) => {
        res.send(dato)
    })
}

function cambiartasa(req,res){
    var tasa = req.body.tasa;
    tasa = tasa.replace(",",".");

    modeloInventario.cambiar_tasa(tasa, (error, dato,f) => {
        if (error) { // si hubo error
                Utilidad.printError(res, {msg: `Error no se pudieron obtener los repuestos: ${error}`, tipo: 0});

        }else{
            var msj = '<div class="alert alert-success" role="alert"><button type="button" class="close" data-dismiss="alert">&times;</button> <strong>¡Bien hecho!</strong> Se ha modificado la tasa correctamente.</div>';
            msj = [msj, tasa];
            res.send(msj)
        }
    })
}

function getRepuesto(req,res){
    let usuario = req.session.passport.user;
    var id = url.parse(req.url,true).query.codigo;

    modeloRepuesto.get_repuesto_por_id(id, (error, repuesto) => { // si se pudo obtener las lineas
            if (error) { // si hubo error
                Utilidad.printError(res, {msg: `Error no se pudo obtener el repuesto: ${error}`, tipo: 0});

            }else{
                // si no hubo error
                modeloInventario.get_repuesto_por_id(id, (error, inventario) => { // si se pudo obtener las lineas
                    if (error) { // si hubo error
                        Utilidad.printError(res, {msg: `Error no se pudo obtener el repuesto: ${error}`, tipo: 0});

                    }else{
                        // si no hubo error
                        modeloInventario.get_movimiento_por_id(id, (error, movimientos) => { // si se pudo obtener las lineas
                            if (error) { // si hubo error
                                Utilidad.printError(res, {msg: `Error no se pudo obtener el repuesto: ${error}`, tipo: 0});

                            }else{
                                // si no hubo error
                                inventario[0].monto = inventario[0].monto * inventario[0].precio;
                                inventario[0].monto = inventario[0].monto.toFixed(2);

                                inventario[0].monto = formatNumber.new(inventario[0].monto);

                                for(var i = 0; i < movimientos.length; i++) {
                                    if(movimientos[i].tipomovimiento == 1){
                                        movimientos[i].tipomovimiento = "ENTRADA";
                                    } else if(movimientos[i].tipomovimiento == 2){
                                        movimientos[i].tipomovimiento = "SALIDA";
                                    }
                                    movimientos[i].fecha = movimientos[i].fecha.toLocaleDateString();
                                }


                                res.render('minventario_repuesto', {inventario,repuesto,movimientos, usuario});
                            }
                        })
                    }
                })
            }
        })
}

var formatNumber = {
    separador: ".", // separador para los miles
    sepDecimal: ',', // separador para los decimales
    formatear:function (num){
        num +='';

        var splitStr = num.split('.');
        var splitLeft = splitStr[0];
        var splitRight = splitStr.length > 1 ? this.sepDecimal + splitStr[1] : '';
        var regx = /(\d+)(\d{3})/;
        while (regx.test(splitLeft)) {
            splitLeft = splitLeft.replace(regx, '$1' + this.separador + '$2');
        }
            return this.simbol + splitLeft +splitRight;
    },
    new:function(num, simbol){
    this.simbol = simbol ||'';
        return this.formatear(num);
    }
}

module.exports = {
    getInventario,
    getRepuesto,
    mostrar,
    cambiarestatus,
    guardar,
    mostrarEdit,
    mostrarEditEdit,
    guardarEditar,
    cambiartasa
}
