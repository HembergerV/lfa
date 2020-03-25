const passport = require("passport");
const modeloLista = require('../modelos/Mlista');
const modeloInventario = require('../modelos/Minventario');

const Utilidad = require('../ayuda/utilidad');

function getListas(req, res){
    let usuario = req.session.passport.user;
    modeloLista.get_lista( (error, listas) => { // si se pudo obtener las listas
            if (error) { // si hubo error
                Utilidad.printError(res, {msg: `Error no se pudieron obtener las listas: ${error}`, tipo: 0});

            }else{
                // si no hubo error
                modeloInventario.get_inventario( (error, items) => {
                  res.render('mlista', {items,listas, usuario});
                })
            }
        })
};

function mostrar(req,res){
    var estiloEstatus;
    var estatus;
    var cont;

    modeloLista.get_lista( (error, listas) => {
        var pr = listas;
        for(var i = 0; pr[i]; i++){
          if(pr[i].estatus == 1){
              estiloEstatus = "btn btn-success btn-md estado";
              estatus = 'ACTIVO';
          }else{
              estiloEstatus = "btn btn-warning btn-md estado";
              estatus = 'INACTIVO';
          }

          cont = pr[i].estatus;
          pr[i].estatus = '<button type="button" onClick="cambiarEstado('+ pr[i].idlista+','+cont+');" name="estatus" id="'+pr[i].idlista+'" class="'+estiloEstatus+'">'+estatus+'</button>';
;
        };
            if(!error) res.send(pr) // se envia el pais seleccionado
        })
}

function mostrarEdit(req,res){
    var idlista = req.body.idlista;
    modeloLista.get_lista_por_id(idlista, (error, dato) => {
        res.send(dato)
    })
}

function guardaryeditar(req,res){
    var nombre = req.body.nombre;
    var nombreO = req.body.nombreOriginal;

    var idlista = req.body.idlista;
    var descripcion = req.body.descripcion;

    if(!idlista){
        modeloLista.get_nombre_lista(nombre, (error, dato) => {
            if(!dato[0]){
                modeloLista.registrar_lista(nombre, descripcion, (error,dato) => {
                    var msj = '<div class="alert alert-success" role="alert"><button type="button" class="close" data-dismiss="alert">&times;</button> <strong>¡Bien hecho!</strong> La lista se registró correctamente.</div>';
                    res.send(msj)
                })
            } else{
                var msj = '<div class="alert alert-danger" role="alert"><button type="button" class="close" data-dismiss="alert">&times;</button> <strong>Error</strong> La lista ya existe.</div>';
                res.send(msj)
            }
        })
    } else{
        if(nombreO == nombre){
            modeloLista.editar_lista(nombre, descripcion, idlista,(error,dato) => {
                    var msj = '<div class="alert alert-success" role="alert"><button type="button" class="close" data-dismiss="alert">&times;</button> <strong>¡Bien hecho!</strong>  La lista se editó correctamente.</div>';
                    res.send(msj)
                })
        }else{
            modeloLista.get_nombre_lista(nombre, (error, dato) => {
                if(!dato[0]){
                    modeloLista.editar_lista(nombre, descripcion, idlista,(error,dato) => {
                        var msj = '<div class="alert alert-success" role="alert"><button type="button" class="close" data-dismiss="alert">&times;</button> <strong>¡Bien hecho!</strong> La lista se editó correctamente.</div>';
                        res.send(msj)
                    })
                } else{
                    var msj = '<div class="alert alert-danger" role="alert"><button type="button" class="close" data-dismiss="alert">&times;</button> <strong>Error</strong> La lista ya existe.</div>';
                    res.send(msj)
                }
            })
          }
    }
}

function cambiarestatus(req, res){
    let idlista = req.body.idlista,
        est = req.body.est

    modeloLista.editar_estatus_lista(idlista,est,(error, lista) => { // si se pudo obtener las lineas
            if (error) { // si hubo error
                Utilidad.printError(res, {msg: `Error no se pudo cambiar el estatus: ${error}`, tipo: 0});

            }else{
                res.send(lista)
            }
        })
}

function cargarRepuestos(req, res){
    let idlista = req.body.idlista;
    modeloLista.get_repuestos_lista(idlista,(error, detalles) => { // si se pudo obtener las lineas
            if (error) { // si hubo error
                Utilidad.printError(res, {msg: `Error no se pudo obtener el registro: ${error}`, tipo: 0});

            }else{
              var btn;
              var cantidad;
              var tbody = "";

              for(var i = 0; detalles[i]; i++){
                if(detalles[i].estatus == 1){
                    btn = "<button type='button' onClick='removerRepuestos("+detalles[i].id+","+idlista+")'  title='Desactivar Repuesto' id='' class='btn btn-danger btn-md update'><i class='glyphicon glyphicon-edit'></i><i class='fas fa-trash'></i></button>";

                    cantidad = "<a href='#' title='clic para editar cantidad' class='editable-update' data-pkid="+detalles[i].id+" data-pkcod="+idlista+">"+detalles[i].cantidad+"</a>";

                }else{
                    btn = "<button type='button' onClick='ActivarRepuestos("+detalles[i].id+","+idlista+")'  title='Activar Repuesto' id='' class='btn btn-warning btn-md update'><i class='glyphicon glyphicon-edit'></i><i class='fas fa-redo-alt'></i></button>";

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

function AsociarRepuestos(req, res){
    let idlista = req.body.idlista;
    let idinventario = req.body.idrepuestos;
    let cantidad = req.body.cantidad;

    modeloLista.get_detalle_lista(idlista,idinventario,(error, detalles) => { // si se pudo obtener las lineas
        if(!detalles[0]){
            modeloLista.registrar_detalle(idlista, idinventario,cantidad, (error,dato) => {
              modeloLista.get_repuestos_lista(idlista,(error, detalles) => { // si se pudo obtener las lineas
                      if (error) { // si hubo error
                          Utilidad.printError(res, {msg: `Error no se pudo obtener el registro: ${error}`, tipo: 0});

                      }else{
                        var btn;
                        var cantidad;
                        var tbody = "";

                        for(var i = 0; detalles[i]; i++){
                          if(detalles[i].estatus == 1){
                              btn = "<button type='button' onClick='removerRepuestos("+detalles[i].id+","+idlista+")'  title='Desactivar Repuesto' id='' class='btn btn-danger btn-md update'><i class='glyphicon glyphicon-edit'></i><i class='fas fa-trash'></i></button>";

                              cantidad = "<a href='#' title='clic para editar cantidad' class='editable-update' data-pkid="+detalles[i].id+" data-pkcod="+idlista+">"+detalles[i].cantidad+"</a>";

                          }else{
                              btn = "<button type='button' onClick='ActivarRepuestos("+detalles[i].id+","+idlista+")'  title='Activar Repuesto' id='' class='btn btn-warning btn-md update'><i class='glyphicon glyphicon-edit'></i><i class='fas fa-redo-alt'></i></button>";

                              cantidad = "<span title='Active el registro para poder editar'>"+detalles[i].cantidad+"</span>";
                          }
                          detalles[i].precio = detalles[i].precio.toFixed(2);

                          tbody +="<tr>";
                              tbody +="<td style='text-align: center;'>"+(i+1)+"</td>";
                              tbody +="<td style='text-align: center;'>"+detalles[i].referencia+"</td>";
                              tbody +="<td>"+detalles[i].descripcion+"</td>";
                              tbody +="<td style='text-align: center;'>"+cantidad+"</td>";
                              tbody +="<td style='text-align: center;'>"+detalles[i].precio+"</td>";
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


function ActualizarEstatus(req, res){
    let idlista = req.body.idlista;
    let iddetalle = req.body.id;
    let estatus = req.body.estatus;

    modeloLista.editar_estatus_detalle(iddetalle,estatus,(error, lista) => {
            if (error) { // si hubo error
                Utilidad.printError(res, {msg: `Error no se pudo cambiar el estatus: ${error}`, tipo: 0});

            }else{
                modeloLista.get_repuestos_lista(idlista,(error, detalles) => {
                        if (error) { // si hubo error
                            Utilidad.printError(res, {msg: `Error no se pudo obtener el registro: ${error}`, tipo: 0});

                        }else{
                          var btn;
                          var cantidad;
                          var tbody = "";
                          for(var i = 0; detalles[i]; i++){
                            if(detalles[i].estatus == 1){
                                btn = "<button type='button' onClick='removerRepuestos("+detalles[i].id+","+idlista+")'  title='Desactivar Repuesto' id='' class='btn btn-danger btn-md update'><i class='glyphicon glyphicon-edit'></i><i class='fas fa-trash'></i></button>";

                                cantidad = "<a href='#' title='clic para editar cantidad' class='editable-update' data-pkid="+detalles[i].id+" data-pkcod="+idlista+">"+detalles[i].cantidad+"</a>";

                            }else{
                                btn = "<button type='button' onClick='ActivarRepuestos("+detalles[i].id+","+idlista+")'  title='Activar Repuesto' id='' class='btn btn-warning btn-md update'><i class='glyphicon glyphicon-edit'></i><i class='fas fa-redo-alt'></i></button>";

                                cantidad = "<span title='Active el registro para poder editar'>"+detalles[i].cantidad+"</span>";
                            }
                            detalles[i].precio = detalles[i].precio.toFixed(2);

                            tbody +="<tr>";
                                tbody +="<td style='text-align: center;'>"+(i+1)+"</td>";
                                tbody +="<td style='text-align: center;'>"+detalles[i].referencia+"</td>";
                                tbody +="<td>"+detalles[i].descripcion+"</td>";
                                tbody +="<td style='text-align: center;'>"+cantidad+"</td>";
                                tbody +="<td style='text-align: center;'>"+detalles[i].precio+"</td>";
                                tbody +="<td style='text-align: center;'>"+btn+"</td>";
                            tbody += "</tr>";
                          };
                              if(!error) res.send(tbody) // se envia el pais seleccionado
                        }
                    })
            }
        })
}

function EditarCantidadRepuestos(req, res){
    let idlista = req.body.idlista;
    let iddetalle = req.body.id;
    let cantidad = req.body.value;

    modeloLista.editar_cantidad_detalle(iddetalle,cantidad,(error, lista) => { // si se pudo obtener las lineas
            if (error) { // si hubo error
                Utilidad.printError(res, {msg: `Error no se pudo cambiar el estatus: ${error}`, tipo: 0});

            }else{
                var mjs = "Todo bien";
                res.send(mjs)
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
    getListas,
    mostrar,
    mostrarEdit,
    guardaryeditar,
    cambiarestatus,
    cargarRepuestos,
    AsociarRepuestos,
    ActualizarEstatus,
    EditarCantidadRepuestos
}
