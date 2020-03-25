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

    //cambia el titulo de la ventana modal cuando se da click al boton
    $("#add_button").click(function(){

        $(".modal-title").text("Registrar repuesto");
    });
});

// funcion que agrega las nuevas filas a la tabla
function agregarFilas(repuestos){
    $('#repuesto_data').DataTable().clear().draw();
    for(var i=0 ; repuestos[i] ; i++){
        var repuesto = repuestos[i],
            id_repuesto = repuesto.idrepuesto,
            nro_parte = repuesto.numero_parte,
            referencia = repuesto.referencia,
            descripcion = repuesto.descripcion,
            marca = repuesto.nombre_marca,
            linea = repuesto.nombre_linea,
            sublinea = repuesto.nombre_sublinea,
            minimo = repuesto.minimo,
            estatus = repuesto.estatus;
        getFilas(id_repuesto,nro_parte, referencia, descripcion,marca,linea,sublinea,minimo,estatus)
    }
    $('#repuesto_data').DataTable().draw();
}

function getFilas(id_repuesto,nro_parte, referencia, descripcion,marca,linea,sublinea,minimo,estatus){
    var table = $('#repuesto_data').DataTable();
    var string1,string2,string3,string4,string5,string6,string7,string8,string9;

    string1 = '<td>' + nro_parte + '</td>';
    string2 = '<td>' + referencia + '</td>';
    string3 = '<td>' + descripcion + '</td>';
    string4 = '<td>' + marca + '</td>';
    string5 = '<td>' + linea + '</td>';
    string6 = '<td>' + sublinea + '</td>';
    string7 = '<td>' + minimo + '</td>';
    string8 = estatus;
    string9 = '<td><button type="button" onClick="mostrar('+id_repuesto+');"  id="" class="btn btn-warning btn-md update"><i class="glyphicon glyphicon-edit"></i> EDITAR</button></td>';
    table.row.add([
        string2,
        string1,
        string3,
        string4,
        string5,
        string6,
//        string7,
        string8,
        string9
    ]);
}

function limpiar(){
    $('#idrepuesto').val("");
    $('#nombre').val("");
    $('#referencia').val("");
    $('#descripcion').val("");
    $('#numero_parte').val("");
    $('#marca').val("");
    $('#minimo').val("");
    $('#idlinea').val("");
    $('#idsublinea').html("<option value=''>Seleccione una opcion</option>");
    $('#numero_parte_secundario').val("");
}

function guardaryeditar(e){
		e.preventDefault();
		var formData =$("#repuesto_form");
		$.ajax({
			url: "/mrepuesto/guardaryeditar",
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

function mostrar(idrepuesto){
     $.post("/mrepuesto/mostrarEdit",{idrepuesto : idrepuesto}, function(data, status){
         limpiar();
         $('#repuestoModal').modal('show');
         $('#referencia').val(data[0].referencia);
         $('#referenciaOriginal').val(data[0].referencia);
         $('#descripcion').val(data[0].descripcion);
         $('#numero_parte').val(data[0].numero_parte);
         $('#marca').val(data[0].idmarca);
         $('#minimo').val(data[0].minimo);
         $('#idlinea').val(data[0].idlinea);
         $('#idsublinea').val(data[0].idsublinea);
         $('#numero_parte_secundario').val(data[0].numero_parte_secundario);
         $('.modal-title').text("Editar repuesto");
         $('#idrepuesto').val(data[0].idrepuesto);
         $('#action').val("Edit");

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
						url: '/mrepuesto',
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
			"iDisplayLength": 20,//Por cada 10 registros hace una paginación
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

 function cambiarEstado(idrepuesto, est){
 		bootbox.confirm("¿Está seguro de cambiar de estatus?", function(result){
			if(result){
				$.ajax({
					url: '/mrepuesto/cambiarestatus',
                    type: 'POST',
					data:{idrepuesto:idrepuesto, est:est},
					success: function(datos){
	                	$('#repuesto_data').DataTable().ajax.reload();

				    }

				});
				}
		});//bootbox
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
