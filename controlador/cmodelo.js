const passport = require("passport");
const modeloVehiculo = require('../modelos/Mmodelo');
const modeloCliente = require('../modelos/Mcliente');
const modeloRif = require('../modelos/Mrif');
const modeloInventario = require('../modelos/Minventario');

const Utilidad = require('../ayuda/utilidad');
var url = require('url');

function getVehiculo(req, res){
    let usuario = req.session.passport.user;
    var idmodelo = url.parse(req.url,true).query.vehiculo;

    modeloVehiculo.get_modelo_vehiculo(idmodelo, (error, modelos) => { // si se pudo obtener las listas
            if (error) { // si hubo error
                Utilidad.printError(res, {msg: `Error no se pudieron obtener las listas: ${error}`, tipo: 0});

            }else{
                modeloCliente.get_cliente( (error, clientes) => { // si se pudo obtener los clientes
                    modeloRif.get_rif( (error, rifs) => {
                      modeloInventario.get_inventario( (error, items) => {
                          res.render('mmodelo', {items,idmodelo,rifs,modelos, usuario,clientes});
                      })
                    })
                })
            }
    })
};

function getOrdenvehiculo(req,res){
    let usuario = req.session.passport.user;
    var idorden = url.parse(req.url,true).query.codigo;

    modeloVehiculo.get_orden_por_id(idorden, (error, orden) => { // si se pudo obtener las lineas
            if (error) { // si hubo error
                Utilidad.printError(res, {msg: `Error no se pudo obtener el repuesto: ${error}`, tipo: 0});

            }else{
              modeloVehiculo.get_repuestos_orden_only(idorden, (error, repuestos) => { //
                      if (error) { // si hubo error
                          Utilidad.printError(res, {msg: `Error no se pudo obtener el repuesto: ${error}`, tipo: 0});

                      }else{
                          res.render('mmodelo_orden', {repuestos, orden, usuario});
                      }
                })
            }
      })
}

function mostrar(req,res){
    var estiloEstatus;
    var estatus;
    var estiloEstatus2;
    var estatus2;
    var cont;
    var cont2;
    var idmodelo = req.body.idmodelo;

    modeloVehiculo.get_ordenesvehiculo(idmodelo, (error, ordenes) => {
        var pr = ordenes;
        for(var i = 0; pr[i]; i++){
          var disabled = "";

          if(pr[i].estatus == 1){
              estiloEstatus = "btn btn-primary btn-md estado";
              estatus = 'EN TALLER';
          }else{
              estiloEstatus = "btn btn-success btn-md estado";
              estatus = 'RETIRADO';
          }
          if(pr[i].deuda == 1){
              estiloEstatus2 = "btn btn-danger btn-md estado";
              estatus2 = 'POR COBRAR';
          }else{
              estiloEstatus2 = "btn btn-success btn-md estado";
              estatus2 = 'COBRADO';
              disabled = "disabled";
          }

          cont = pr[i].estatus;
          cont2 = pr[i].deuda;

          pr[i].deuda = '<button '+disabled+' type="button" onClick="cambiarEstadoDeuda('+ pr[i].idordenvehiculo+','+cont2+');" name="deuda" id="'+pr[i].idordenvehiculo+'" class="'+estiloEstatus2+'">'+estatus2+'</button>';

          pr[i].estatus = '<button  type="button" onClick="cambiarEstado('+ pr[i].idordenvehiculo+','+cont+');" name="estatus" id="'+pr[i].idordenvehiculo+'" class="'+estiloEstatus+'">'+estatus+'</button>';

        };
            if(!error) res.send(pr) // se envia el registro seleccionado
      })

}

function guardaryeditar(req,res){
    var idcliente = req.body.cliente;
    var anio = req.body.anio;
    var color = req.body.color;
    var placa = req.body.placa;
    var placaO = req.body.placaOriginal;
    var modelo = req.body.modelo;
    var idmodelo = req.body.idmodelo;
    var bateria = req.body.bateria;
    var motivo = req.body.nota;
    var idordenvehiculo = req.body.idordenvehiculo;
    var idmodelocarro = req.body.idmodelocarro;
    var fecha = new Date();
    fecha = fecha.toLocaleString();
    //console.log("motivo: "+motivo+", bateria: "+bateria+ ",idcliente: "+idcliente+", año: "+anio+", color: "+color+", placa: "+placa+", modelo: "+modelo+", idmodelocarro: "+idmodelocarro)
    if(!idordenvehiculo){
        modeloVehiculo.get_placa_cliente(placa,(error, dato) => {
            if(!dato[0]){
                modeloVehiculo.registrar_ordenvehiculo(idcliente,idmodelo,modelo,motivo,anio,color,placa,bateria,fecha,(error,dato) => {
                    if (error) { // si hubo error
                        Utilidad.printError(res, {msg: `Error no se pudo cambiar el estatus: ${error}`, tipo: 0});

                    }else{
                        var msj = '<div class="alert alert-success" role="alert"><button type="button" class="close" data-dismiss="alert">&times;</button> <strong>¡Bien hecho!</strong> La orden del vehículo se registró correctamente.</div>';
                        res.send(msj)
                    }
                })
            } else{
                var msj = '<div class="alert alert-danger" role="alert"><button type="button" class="close" data-dismiss="alert">&times;</button> <strong>Error</strong> El vehículo ya tiene una orden activa.</div>';
                res.send(msj)
            }
        })
    } else{
          if(placaO == placa){
              modeloVehiculo.editar_ordenvehiculo(idcliente,idmodelo,modelo,motivo,anio,color,placa,bateria,idordenvehiculo,(error,dato) => {
                      var msj = '<div class="alert alert-success" role="alert"><button type="button" class="close" data-dismiss="alert">&times;</button> <strong>¡Bien hecho!</strong>  El cargo se editó correctamente.</div>';
                      res.send(msj)
                  })
          }else{
              modeloVehiculo.get_placa_cliente(placa, (error, dato) => {
                  if(!dato[0]){
                      modeloVehiculo.editar_ordenvehiculo(idcliente,idmodelo,modelo,motivo,anio,color,placa,bateria,idordenvehiculo,(error,dato) => {
                          if (error) { // si hubo error
                              Utilidad.printError(res, {msg: `Error no se pudo cambiar el estatus: ${error}`, tipo: 0});

                          }else{
                          var msj = '<div class="alert alert-success" role="alert"><button type="button" class="close" data-dismiss="alert">&times;</button> <strong>¡Bien hecho!</strong> La orden del vehículo se editó correctamente.</div>';
                          res.send(msj)
                          }
                      })
                  } else{
                      var msj = '<div class="alert alert-danger" role="alert"><button type="button" class="close" data-dismiss="alert">&times;</button> <strong>Error</strong> El vehículo ya tiene una orden activa.</div>';
                      res.send(msj)
                  }
              })
          }
    }

}

function cambiarestatus(req, res){
    let idorden = req.body.idorden,
        est = req.body.est

    modeloVehiculo.editar_estatus_orden(idorden,est,(error, estatus) => { // si se pudo obtener las marcas
            if (error) { // si hubo error
                Utilidad.printError(res, {msg: `Error no se pudo cambiar el estatus: ${error}`, tipo: 0});

            }else{
                res.send(estatus)
            }

        })
}

function cambiarestatusdeuda(req, res){
    let idorden = req.body.idorden,
        est = req.body.est;

    var fecha = new Date();
    fecha = fecha.toLocaleString();

    modeloVehiculo.editar_estatusdeuda_orden(fecha,idorden,est,(error, estatus) => { // si se pudo obtener las marcas
            if (error) { // si hubo error
                Utilidad.printError(res, {msg: `Error no se pudo cambiar el estatus: ${error}`, tipo: 0});

            }else{
                res.send(estatus)
            }

        })
}

function mostrarEdit(req,res){
    var idorden = req.body.idorden;
    modeloVehiculo.get_orden_por_id(idorden, (error, dato) => {
        res.send(dato)
    })
}


function cargarRepuestos(req, res){
    let idorden = req.body.idorden;
    modeloVehiculo.get_repuestos_orden(idorden,(error, detalles) => { // si se pudo obtener las lineas
            if (error) { // si hubo error
                Utilidad.printError(res, {msg: `Error no se pudo obtener el registro: ${error}`, tipo: 0});

            }else{
              var btn;
              var cantidad;
              var tbody = "";

              for(var i = 0; detalles[i]; i++){
                if(detalles[i].estatus == 1){
                    btn = "<button type='button' onClick='removerRepuestos("+detalles[i].id+","+idorden+")'  title='Desactivar Repuesto' id='' class='btn btn-danger btn-md update'><i class='glyphicon glyphicon-edit'></i><i class='fas fa-trash'></i></button>";

                    cantidad = "<a href='#' title='clic para editar cantidad' class='editable-update' data-pkid="+detalles[i].id+" data-pkcod="+idorden+">"+detalles[i].cantidad+"</a>";

                }else{
                    btn = "<button type='button' onClick='ActivarRepuestos("+detalles[i].id+","+idorden+")'  title='Activar Repuesto' id='' class='btn btn-warning btn-md update'><i class='glyphicon glyphicon-edit'></i><i class='fas fa-redo-alt'></i></button>";

                    cantidad = "<span title='Active el registro para poder editar'>"+detalles[i].cantidad+"</span>";
                }

                detalles[i].precio = detalles[i].precio.toFixed(2);
                tbody +="<tr id='detalles' value='1'>";
                    tbody +="<input type='hidden' name='reporte' id='reporte' class='form-control' value='1'  />";
                    tbody +="<td style='text-align: center;'>"+(i+1)+"</td>";
                    tbody +="<td style='text-align: center;'>"+detalles[i].referencia+"</td>";
                    tbody +="<td>"+detalles[i].descripcion+"</td>";
                    tbody +="<td style='text-align: center;'>"+cantidad+"</td>";
                    tbody +="<td style='text-align: center;'>"+formatNumber.new(detalles[i].precio)+"</td>";
                    tbody +="<td style='text-align: center;'>"+btn+"</td>";
                tbody += "</tr>";
              };
                  if(!error) res.send(tbody) // se envia el pais seleccionado
            }
        })
}
function cargarManoObra(req, res){
    let idorden = req.body.idorden;
    modeloVehiculo.get_manoObra_orden(idorden,(error, detalles) => { // si se pudo obtener las lineas
            if (error) { // si hubo error
                Utilidad.printError(res, {msg: `Error no se pudo obtener el registro: ${error}`, tipo: 0});

            }else{
              var btn;
              var cantidad;
              var tbody = "";

              for(var i = 0; detalles[i]; i++){
                detalles[i].precio = detalles[i].precio.toFixed(2);

                if(detalles[i].estatus == 1){
                    btn = "<button type='button' onClick='removerManoObra("+detalles[i].id+","+idorden+")'  title='Desactivar Mano Obra' id='' class='btn btn-danger btn-md update'><i class='glyphicon glyphicon-edit'></i><i class='fas fa-trash'></i></button>";

                    precio = "<a href='#' title='clic para editar precio' class='editable-update' data-pkid="+detalles[i].id+" data-pkcod="+idorden+">"+formatNumber.new(detalles[i].precio)+"</a>";

                }else{
                    btn = "<button type='button' onClick='ActivarManoObra("+detalles[i].id+","+idorden+")'  title='Activar Mano Obra' id='' class='btn btn-warning btn-md update'><i class='glyphicon glyphicon-edit'></i><i class='fas fa-redo-alt'></i></button>";

                    precio = "<span title='Active el registro para poder editar'>"+formatNumber.new(detalles[i].precio)+"</span>";
                }

                tbody +="<tr id='detalles' value='1'>";
                    tbody +="<td style='text-align: center;'>"+(i+1)+"</td>";
                    tbody +="<td>"+detalles[i].descripcion+"</td>";
                    tbody +="<td style='text-align: center;'>"+precio+"</td>";
                    tbody +="<td style='text-align: center;'>"+btn+"</td>";
                tbody += "</tr>";
              };
                  if(!error) res.send(tbody) // se envia el pais seleccionado
            }
        })
}

function AsociarRepuestos(req, res){
    let idorden = req.body.idorden;
    let idinventario = req.body.idrepuestos;
    let cantidad = req.body.cantidad;

    modeloVehiculo.get_detalle_orden(idorden,idinventario,(error, detalles) => { // si se pudo obtener las lineas
        if(!detalles[0]){
            modeloVehiculo.registrar_detalle(idorden, idinventario,cantidad, (error,dato) => {
              modeloVehiculo.get_repuestos_orden(idorden,(error, detalles) => { // si se pudo obtener las lineas
                      if (error) { // si hubo error
                          Utilidad.printError(res, {msg: `Error no se pudo obtener el registro: ${error}`, tipo: 0});

                      }else{
                        var btn;
                        var cantidad;
                        var tbody = "";

                        for(var i = 0; detalles[i]; i++){
                          if(detalles[i].estatus == 1){
                              btn = "<button type='button' onClick='removerRepuestos("+detalles[i].id+","+idorden+")'  title='Desactivar Repuesto' id='' class='btn btn-danger btn-md update'><i class='glyphicon glyphicon-edit'></i><i class='fas fa-trash'></i></button>";

                              cantidad = "<a href='#' title='clic para editar cantidad' class='editable-update' data-pkid="+detalles[i].id+" data-pkcod="+idorden+">"+detalles[i].cantidad+"</a>";

                          }else{
                              btn = "<button type='button' onClick='ActivarRepuestos("+detalles[i].id+","+idorden+")'  title='Activar Repuesto' id='' class='btn btn-warning btn-md update'><i class='glyphicon glyphicon-edit'></i><i class='fas fa-redo-alt'></i></button>";

                              cantidad = "<span title='Active el registro para poder editar'>"+detalles[i].cantidad+"</span>";
                          }
                          detalles[i].precio = detalles[i].precio.toFixed(2);

                          tbody +="<tr>";
                              tbody +="<td style='text-align: center;'>"+(i+1)+"</td>";
                              tbody +="<td style='text-align: center;'>"+detalles[i].referencia+"</td>";
                              tbody +="<td>"+detalles[i].descripcion+"</td>";
                              tbody +="<td style='text-align: center;'>"+cantidad+"</td>";
                              tbody +="<td style='text-align: center;'>"+formatNumber.new(detalles[i].precio)+"</td>";
                              tbody +="<td style='text-align: center;'>"+btn+"</td>";
                          tbody += "</tr>";
                        };
                            var dato = {
                              tbody : tbody,
                              error : false
                            }
                            if(!error) res.send(dato) // se envia el pais seleccionado
                      }
                  })

            })
        } else{
            var error = '<div class="alert alert-danger" role="alert"><button type="button" class="close" data-dismiss="alert">&times;</button><strong>Error!</strong>el registro ya existe</div>';
            var dato = {
              error : error
            }
            res.send(dato)
        }
    })
}
function AsociarManoObra(req, res){
    let idorden = req.body.idorden;
    let descripcion = req.body.descripcion;
    let precio = req.body.precio;
    precio = precio.replace(",",".");
            modeloVehiculo.registrar_manoObra(idorden, descripcion,precio, (error,dato) => {
              modeloVehiculo.get_manoObra_orden(idorden,(error, detalles) => { // si se pudo obtener las lineas
                      if (error) { // si hubo error
                          Utilidad.printError(res, {msg: `Error no se pudo obtener el registro: ${error}`, tipo: 0});

                      }else{
                        var btn;
                        var cantidad;
                        var tbody = "";

                        for(var i = 0; detalles[i]; i++){
                          detalles[i].precio = detalles[i].precio.toFixed(2);

                          if(detalles[i].estatus == 1){
                              btn = "<button type='button' onClick='removerManoObra("+detalles[i].id+","+idorden+")'  title='Desactivar Mano Obra' id='' class='btn btn-danger btn-md update'><i class='glyphicon glyphicon-edit'></i><i class='fas fa-trash'></i></button>";

                              precio = "<a href='#' title='clic para editar precio' class='editable-update' data-pkid="+detalles[i].id+" data-pkcod="+idorden+">"+formatNumber.new(detalles[i].precio)+"</a>";

                          }else{
                              btn = "<button type='button' onClick='ActivarManoObra("+detalles[i].id+","+idorden+")'  title='Activar Mano Obra' id='' class='btn btn-warning btn-md update'><i class='glyphicon glyphicon-edit'></i><i class='fas fa-redo-alt'></i></button>";

                              precio = "<span title='Active el registro para poder editar'>"+formatNumber.new(detalles[i].precio)+"</span>";
                          }

                          tbody +="<tr id='detalles' value='1'>";
                              tbody +="<td style='text-align: center;'>"+(i+1)+"</td>";
                              tbody +="<td>"+detalles[i].descripcion+"</td>";
                              tbody +="<td style='text-align: center;'>"+precio+"</td>";
                              tbody +="<td style='text-align: center;'>"+btn+"</td>";
                          tbody += "</tr>";
                        };
                          var dato = {
                            tbody : tbody,
                            error : false
                          }
                          if(!error) res.send(dato)
                      }
                  })

            })

        }


function ActualizarEstatus(req, res){
    let idorden = req.body.idorden;
    let iddetalle = req.body.id;
    let estatus = req.body.estatus;

    modeloVehiculo.editar_estatus_detalle(iddetalle,estatus,(error, lista) => {
            if (error) { // si hubo error
                Utilidad.printError(res, {msg: `Error no se pudo cambiar el estatus: ${error}`, tipo: 0});

            }else{
                modeloVehiculo.get_repuestos_orden(idorden,(error, detalles) => {
                        if (error) { // si hubo error
                            Utilidad.printError(res, {msg: `Error no se pudo obtener el registro: ${error}`, tipo: 0});

                        }else{
                          var btn;
                          var cantidad;
                          var tbody = "";
                          for(var i = 0; detalles[i]; i++){
                            if(detalles[i].estatus == 1){
                                btn = "<button type='button' onClick='removerRepuestos("+detalles[i].id+","+idorden+")'  title='Desactivar Repuesto' id='' class='btn btn-danger btn-md update'><i class='glyphicon glyphicon-edit'></i><i class='fas fa-trash'></i></button>";

                                cantidad = "<a href='#' title='clic para editar cantidad' class='editable-update' data-pkid="+detalles[i].id+" data-pkcod="+idorden+">"+detalles[i].cantidad+"</a>";

                            }else{
                                btn = "<button type='button' onClick='ActivarRepuestos("+detalles[i].id+","+idorden+")'  title='Activar Repuesto' id='' class='btn btn-warning btn-md update'><i class='glyphicon glyphicon-edit'></i><i class='fas fa-redo-alt'></i></button>";

                                cantidad = "<span title='Active el registro para poder editar'>"+detalles[i].cantidad+"</span>";
                            }
                            detalles[i].precio = detalles[i].precio.toFixed(2);

                            tbody +="<tr>";
                                tbody +="<td style='text-align: center;'>"+(i+1)+"</td>";
                                tbody +="<td style='text-align: center;'>"+detalles[i].referencia+"</td>";
                                tbody +="<td>"+detalles[i].descripcion+"</td>";
                                tbody +="<td style='text-align: center;'>"+cantidad+"</td>";
                                tbody +="<td style='text-align: center;'>"+formatNumber.new(detalles[i].precio)+"</td>";
                                tbody +="<td style='text-align: center;'>"+btn+"</td>";
                            tbody += "</tr>";
                          };
                              if(!error) res.send(tbody) //
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

function EditarCantidadRepuestos(req, res){
    let idorden = req.body.idorden;
    let iddetalle = req.body.id;
    let cantidad = req.body.value;

    modeloVehiculo.editar_cantidad_detalle(iddetalle,cantidad,(error, lista) => { // si se pudo obtener las lineas
            if (error) { // si hubo error
                Utilidad.printError(res, {msg: `Error no se pudo cambiar el estatus: ${error}`, tipo: 0});

            }else{
                var mjs = "Todo bien";
                res.send(mjs)
            }
        })
}

function EditarPrecioManoObra(req, res){
    let idorden = req.body.idorden;
    let iddetalle = req.body.id;
    let precio = req.body.value;

    modeloVehiculo.editar_precio_manoObra(iddetalle,precio,(error, lista) => { // si se pudo obtener las lineas
            if (error) { // si hubo error
                Utilidad.printError(res, {msg: `Error no se pudo cambiar el estatus: ${error}`, tipo: 0});

            }else{
                var mjs = "Todo bien";
                res.send(mjs)
            }
        })
}
module.exports = {
    getOrdenvehiculo,
    getVehiculo,
    mostrar,
    guardaryeditar,
    cambiarestatus,
    mostrarEdit,
    cargarRepuestos,
    AsociarRepuestos,
    ActualizarEstatus,
    EditarCantidadRepuestos,
    cargarManoObra,
    EditarPrecioManoObra,
    AsociarManoObra,
    cambiarestatusdeuda

}
