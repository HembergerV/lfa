var formularioRepuestos;
var tabla;

// funcion principal
$(function(){
    // obtengo el formulario del almacen
    formularioRepuestos = $('#repuesto_data');
    listar();

    //cuando se da click al boton submit entonces se ejecuta la funcion guardaryeditar(e);
    $("#repuesto_form").on("submit",function(e){

        guardaryeditar(e);
    })

    $("#repuestoEdit_form").on("submit",function(e){

        guardarEditar(e);
    })

    $("#tasa_form").on("submit",function(e){

        cambiarTasa(e);
    })
    //cambia el titulo de la ventana modal cuando se da click al boton
    $("#add_button").click(function(){

        $(".modal-title").text("Agregar Repuesto");
    });
});

// funcion que agrega las nuevas filas a la tabla
function agregarFilas(repuestos){
    $('#repuesto_data').DataTable().clear().draw();
    var cont = 0;
    for(var i=repuestos.length - 1 ; i >= 0 ; i--){
        var repuesto = repuestos[i],
            id_repuesto = repuesto.idrepuesto,
            nro_parte = repuesto.numero_parte,
            referencia = repuesto.referencia,
            descripcion = repuesto.descripcion,
            marca = repuesto.nombre_marca,
            linea = repuesto.nombre_linea,
            sublinea = repuesto.nombre_sublinea,
            minimo = repuesto.minimo,
            cantidad = repuesto.cantidad,
            precio = repuesto.precio * repuesto.monto,
            precioverde = repuesto.precio,
            idinventario = repuesto.idinventario,
            estatus = repuesto.estatus_inventario;
            cont += 1;
        getFilas(cont,id_repuesto,nro_parte, referencia, descripcion,marca,linea,sublinea,cantidad,precio,estatus,precioverde)
    }
    $('#repuesto_data').DataTable().draw();
}

function getFilas(idinventario,id_repuesto,nro_parte, referencia, descripcion,marca,linea,sublinea,cantidad,precio,estatus,precioverde){
    var table = $('#repuesto_data').DataTable();
    var string0,string1,string2,string3,string4,string5,string6,string7,string8;

    precio = precio.toFixed(2);
    string0 = '<td>' + idinventario + '</td>';
    string2 = '<td><a href="minventario/repuesto?codigo='+ id_repuesto +'" style="text-decoration: none" id="'+ nro_parte +'">' + nro_parte + '</a></td>';
    string1 = '<td>' + referencia + '</td>';
    string3 = '<td>' + descripcion + '</td>';
    string4 = '<td>' + marca + '</td>';
    string5 = '<td>' + cantidad + '</td>';
    string6 = '<td><span class="badge badge-primary" style="float:right;"> BS ' + formatNumber.new(precio) + '</span>   <span class="badge badge-success" style="float:right;"> $ ' + precioverde + '</span></td>';
    string8 = '<td><button type="button" onClick="mostrar('+id_repuesto+');"  id="" class="btn btn-warning btn-md update"><i class="glyphicon glyphicon-edit"></i> EDITAR</button></td>';


    table.row.add([
        string0,
        string1,
        string2,
        string3,
        string4,
        string5,
        string6,
        string8

    ]);
}

function limpiar(){
  $('#estante').prop("disabled", false);
  $('#fila').prop("disabled", false);
  $('#columna').prop("disabled", false);
    $('#idrepuesto').val("");
    $('#repuesto').val("");
    $('#tiporif').val("");
    $('#rif').val("");
    $('#nombre').val("");
    $('#referencia').val("");
    $('#descripcion').val("");
    $('#numero_parte').val("");
    $('#marca').val("");
    $('#minimo').val("");
    $('#idlinea').val("");
    $('#precio').val("");
    $('#estante').val("");
    $('#fila').val("");
    $('#columna').val("");
    $('#idsublinea').html("<option value=''>Seleccione una opcion</option>");
    $('#numero_parte_secundario').val("");
    $('.js-example-basic-multiple').select2({
			  language: "es"
			, theme: "bootstrap"
			, width: null
			, tokenSeparators: [',', ' ']
			, minimumInputLength: 1
		});
}

function mostrar(idrepuesto){
    $.post("/minventario/mostrarEditEdit",{idrepuesto : idrepuesto}, function(data, status){
         limpiar();
         $('#repuestoEditModal').modal('show');
         $('#estante2').val(data[0].estante);
         $('#fila2').val(data[0].fila);
         $('#columna2').val(data[0].columna);
         $('#precioEdit').val(data[0].precio);
         $('#cantidadEdit').val(data[0].cantidad);
         $('#cantidadEditOriginal').val(data[0].cantidad);

         $('.modal-title').text("Editar repuesto");
         $('#idrepuestoEdit').val(data[0].idrepuesto);
         $('#action').val("Edit");

     });
 }


function listar(){
		tabla=$('#repuesto_data').dataTable({
			"aProcessing": true,
		    "aServerSide": true,
		    dom: 'Bfrtip',
		    buttons: [
			            'copyHtml5',
			            'excelHtml5',
			            'csvHtml5',
			            'pdf'
			        ],
			"ajax":
					{
						url: '/minventario',
						type : 'post',
						dataType : "json",
						error: function(e){
							console.log(e.responseText);
						},
                        data: formularioRepuestos.serialize(),
                        success : function(data) {
                            // pais
                            agregarFilas(data);
                        }
					},
			"bDestroy": true,
			"responsive": true,
			"bInfo":true,
			"iDisplayLength": 20,//Por cada 20 registros hace una paginación
		    "order": [[ 0, "asc" ]],//Ordenar (columna,orden)

		    "language": {
				    "sProcessing":     "Procesando...",
				    "sLengthMenu":     "Mostrar _MENU_ registros",
				    "sZeroRecords":    "No se encontraron resultados",
				    "sEmptyTable":     "Ningún dato disponible en esta tabla",
				    "sInfo":           "Mostrando un total de _TOTAL_ registros",
				    "sInfoEmpty":      "Mostrando un total de 0 registros",
				    "sInfoFiltered":   "(filtrado de un total de _MAX_ registros)",
				    "sInfoPostFix":    "",
				    "sSearch":         "Buscar:",
				    "sUrl":            "",
				    "sInfoThousands":  ",",
				    "sLoadingRecords": "Cargando...",
				    "oPaginate": {
				        "sFirst":    "Primero",
				        "sLast":     "Último",
				        "sNext":     "Siguiente",
				        "sPrevious": "Anterior"
				    },
				    "oAria": {
				        "sSortAscending":  ": Activar para ordenar la columna de manera ascendente",
				        "sSortDescending": ": Activar para ordenar la columna de manera descendente"
				    	}
			   		}//cerrando language
		}).DataTable();
	}

 function cambiarEstado(idinventario, est){
 		bootbox.confirm("¿Está seguro de cambiar de estatus?", function(result){
			if(result){
				$.ajax({
					url: '/minventario/cambiarestatus',
                    type: 'POST',
					data:{idinventario:idinventario, est:est},
					success: function(datos){
	                	$('#repuesto_data').DataTable().ajax.reload();

				    }

				});
				}
		});//bootbox
	   }

function camposrepuesto(value,name){
    $.post("/minventario/mostrarEdit",{idrepuesto : value}, function(data, status){
         $('#referencia').val(data[0].referencia);
         $('#descripcion').val(data[0].descripcion);
         $('#numero_parte').val(data[0].numero_parte);

         $('#estante').val("");
         $('#fila').val("");
         $('#columna').val("");
         if(data[0].estante){
            $('#estante').val(data[0].estante);
            $('#estante').prop("disabled", true);
         }else {
            $('#estante').prop("disabled", false);
         }
         if(data[0].fila){
            $('#fila').val(data[0].fila);
            $('#fila').prop("disabled", true);
         }else{
            $('#fila').prop("disabled", false);
         }
         if(data[0].columna){
            $('#columna').val(data[0].columna);
            $('#columna').prop("disabled", true);
         }else{
            $('#columna').prop("disabled", false);
         }
         $('#marca').val(data[0].idmarca);
         $('#minimo').val(data[0].minimo);
        //$('#minimo').prop("disabled", false);
         $('#precio').val(data[0].precio);
         $('#idlinea').val(data[0].idlinea);
         $('#idsublinea').val(data[0].idsublinea);
         $('#numero_parte_secundario').val(data[0].numero_parte_secundario);
         $('#idrepuesto').val(data[0].idrepuesto);
         /*
            Array
                (
                    [id] => 8
                    [field_foreign] => codpais
                    [table] => repuesto
                    [value] => codrepuesto
                    [description] => nombre
                )
        */


            //$("#codpais option[value="+ data.codpais +"]").attr('selected', 'selected');
            cargarCombo('','','marca','idmarca','nombre',data[0].idmarca);
            cargarCombo('','','linea','idlinea','nombre',data[0].idlinea);
            cargarCombo(data[0].idlinea,'idlinea','sublinea','idsublinea','nombre',data[0].idsublinea);
     });
}

function camposproveedor(idproveedor){
    $.post("/mproveedor/mostrarEdit",{idproveedor : idproveedor}, function(data, status){

        $('#nombre').val(data[0].nombre);
        $('#nombreOriginal').val(data[0].nombre);

        $('#tiporif').val(data[0].tiporif);
        $('#rif').val(data[0].rif);
        $('#idproveedor').val(data[0].idproveedor);
    });
}

function cargarCombo(id,field_foreign,table,value,description,selected){
  $.ajax({
      url:"/mrepuesto/cargarCombo",
      method:"POST",
      data:{ id:id, field_foreign:field_foreign, table:table, value:value, description:description, selected:selected},
      success: function(data){

          //console.log(data);
          $("#idrepuesto").html(data);

      }

  });
}

function cambiarTasa(e){
    e.preventDefault();
		var formData =$("#tasa_form");
		$.ajax({
			url: "/minventario/cambiartasa",
		    type: "POST",
		    data: formData.serialize(),

		    success: function(datos){
	            $('#repuesto_form')[0].reset();

				$('#tasaModal').modal('hide');

				$('#resultados_ajax4').html(datos[0]);
				$('#repuesto_data').DataTable().ajax.reload();
				$('#tasita').val("TASA: "+datos[1]);
                limpiar();
		    }
		});
}
function cargarCombo(id,field_foreign,table,value,description,selected){
    $.ajax({
          url:"/mrepuesto/cargarCombo",
          method:"POST",
          data:{ id:id, field_foreign:field_foreign, table:table, value:value, description:description, selected:selected},
          success: function(data){

                  //console.log(data);
                  $("#"+ value).html(data);

              }

          });
        }


function guardaryeditar(e){
		e.preventDefault();
		var formData =$("#repuesto_form");
		$.ajax({
			url: "/minventario/guardar",
		    type: "POST",
		    data: formData.serialize(),

		    success: function(datos){
	      $('#repuesto_form')[0].reset();
				$('#repuestoModal').modal('hide');

				$('#resultados_ajax4').html(datos);
				$('#repuesto_data').DataTable().ajax.reload();

        limpiar();
		    }
		});

	}

function guardarEditar(e){
		e.preventDefault();
		var formData =$("#repuestoEdit_form");
		$.ajax({
			url: "/minventario/guardarEditar",
		    type: "POST",
		    data: formData.serialize(),

		    success: function(datos){
	            $('#repuestoEdit_form')[0].reset();
				$('#repuestoEditModal').modal('hide');

				$('#resultados_ajax4').html(datos);
				$('#repuesto_data').DataTable().ajax.reload();

                limpiar();
		    }
		});

	}

function soloLetrasConEspacio(e) {
    // 1
    tecla = (document.all) ? e.keyCode : e.which;
    if (tecla==8) return true; // backspace
    if (tecla==32) return true; // espacio
    //if (e.ctrlKey && tecla==86) { return true;} //Ctrl v
    //if (e.ctrlKey && tecla==67) { return true;} //Ctrl c
    //if (e.ctrlKey && tecla==88) { return true;} //Ctrl x

    patron = /[a-zA-Z]/; //patron

    te = String.fromCharCode(tecla);
    return patron.test(te); // prueba de patron
}

function fnv_soloNumeros(e){
    var keynum = window.event ? window.event.keyCode : e.which;

    if ((keynum == 8))
        return true;

    return /\d/.test(String.fromCharCode(keynum));
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
