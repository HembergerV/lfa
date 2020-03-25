var formularioEstados;
var tabla;

// funcion principal
$(function(){ 
    // obtengo el formulario del almacen
    formularioEstados = $('#estado_data');
    listar();

    //cuando se da click al boton submit entonces se ejecuta la funcion guardaryeditar(e);
    $("#estado_form").on("submit",function(e){

        guardaryeditar(e);	
    })

    //cambia el titulo de la ventana modal cuando se da click al boton
    $("#add_button").click(function(){

        $(".modal-title").text("Registrar Estado");
    });
});
    
// funcion que agrega las nuevas filas a la tabla
function agregarFilas(estados){
    $('#estado_data').DataTable().clear().draw();
    for(var i=0 ; estados[i] ; i++){
        var estado = estados[i],
            nombre = estado.nombre,
            codigo = estado.codestado,
            estatus = estado.estatus,
            nombre_pais = estado.nombre_pais;
        getFilas(nombre, codigo, estatus,nombre_pais)
    }
    $('#estado_data').DataTable().draw();
}

function getFilas(nombre, codigo, estatus,nombre_pais){
    var table = $('#estado_data').DataTable();
    var string1,string2,string3,string4,string5;
    
    string1 = '<td>' + nombre + '</td>';
    string2 = '<td>' + codigo + '</td>';
    string3 = '<td>' + nombre_pais + '</td>';
    string4 = estatus;
    string5 = '<td><button type="button" onClick="mostrar('+codigo+');"  id="" class="btn btn-warning btn-md update"><i class="glyphicon glyphicon-edit"></i> EDITAR</button></td>';
    table.row.add([
        string2,
        string1,
        string3,
        string4,
        string5
    ]);
}

function limpiar(){
    $('#nombre').val("");
    $('#estado').val("");
    $('#codestado').val("");
}

function mostrar(codestado){
     $.post("/mestado/mostrarEdit",{codestado : codestado}, function(data, status){
         limpiar();
         $('#estadoModal').modal('show');
         $('#nombre').val(data[0].nombre);
         $('#estado').val(data[0].nombre_estado);
         $('.modal-title').text("Editar Estado");
         $('#codestado').val(data[0].codestado);
         $('#action').val("Edit");	

         /*
            Array
                (
                    [id] => 8
                    [field_foreign] => codpais
                    [table] => estado
                    [value] => codestado
                    [description] => nombre
                )
        */
            //console.log(data);
            //$("#codpais option:selected").removeAttr("selected");	
            

            //$("#codpais option[value="+ data.codpais +"]").attr('selected', 'selected');
            cargarCombo('','','pais','codpais','nombre',data[0].codpais);
            //cargarCombo(data.codpais,'codpais','estado','codestado','nombre',data.codestado);
     });        
 }


function listar(){
		tabla=$('#estado_data').dataTable({
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
						url: '/mestado',
						type : 'post',
						dataType : "json",						
						error: function(e){
							console.log(e.responseText);	
						},
                        data: formularioEstados.serialize(),
                        success : function(data) {
                            // pais
                            agregarFilas(data);
                        }
					},
			"bDestroy": true,
			"responsive": true,
			"bInfo":true,
			"iDisplayLength": 10,//Por cada 10 registros hace una paginación
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

 function cambiarEstado(codestado, est){
 		bootbox.confirm("¿Está seguro de cambiar de estatus?", function(result){
			if(result){
				$.ajax({
					url: '/mestado/cambiarestatus',
                    type: 'POST',
					data:{codestado:codestado, est:est},
					success: function(datos){
	                	$('#estado_data').DataTable().ajax.reload();

				    }

				});
				}
		});//bootbox
	   }

function cargarCombo(id,field_foreign,table,value,description,selected){
  $.ajax({
      url:"/mestado/cargarCombo",
      method:"POST",
      data:{ id:id, field_foreign:field_foreign, table:table, value:value, description:description, selected:selected},
      success: function(data){

          //console.log(data);
          $("#codestado").html(data);

      }

  });
}
function cargarCombo(id,field_foreign,table,value,description,selected){
    $.ajax({
          url:"/mestado/cargarCombo",
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
		var formData =$("#estado_form");
		$.ajax({
			url: "/mestado/guardaryeditar",
		    type: "POST",
		    data: formData.serialize(),

		    success: function(datos){
	            $('#estado_form')[0].reset();
				$('#estadoModal').modal('hide');

				$('#resultados_ajax4').html(datos);
				$('#estado_data').DataTable().ajax.reload();
				
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

