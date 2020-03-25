var formularioSublineas;
var tabla;

// funcion principal
$(function(){ 
    // obtengo el formulario del almacen
    formularioSublineas = $('#sublinea_data');
    listar();

    //cuando se da click al boton submit entonces se ejecuta la funcion guardaryeditar(e);
    $("#sublinea_form").on("submit",function(e){

        guardaryeditar(e);	
    })

    //cambia el titulo de la ventana modal cuando se da click al boton
    $("#add_button").click(function(){

        $(".modal-title").text("Registrar Sub linea");
    });
});
    
// funcion que agrega las nuevas filas a la tabla
function agregarFilas(sublineas){
    $('#sublinea_data').DataTable().clear().draw();
    for(var i=0 ; sublineas[i] ; i++){
        var sublinea = sublineas[i],
            nombre = sublinea.nombre,
            descripcion = sublinea.descripcion,
            id = sublinea.idsublinea,
            estatus = sublinea.estatus,
            nombre_linea = sublinea.nombre_linea;
        getFilas(nombre, descripcion,id, estatus,nombre_linea)
    }
    $('#sublinea_data').DataTable().draw();
}

function getFilas(nombre, descripcion,id, estatus,nombre_linea){
    var table = $('#sublinea_data').DataTable();
    var string1,string2,string3,string4,string5,string6;
    
    string1 = '<td>' + id + '</td>';
    string2 = '<td>' + nombre + '</td>';
    string3 = '<td>' + nombre_linea + '</td>';
    string4 = '<td>' + descripcion + '</td>';
    string5 = estatus;
    string6 = '<td><button type="button" onClick="mostrar('+id+');"  id="" class="btn btn-warning btn-md update"><i class="glyphicon glyphicon-edit"></i> EDITAR</button></td>';
    table.row.add([
        string1,
        string2,
        string3,
        string4,
        string5,
        string6
    ]);
}

function limpiar(){
    $('#nombre').val("");
    $('#descripcion').val("");
    $('#sublinea').val("");
    $('#idsublinea').val("");

}

function mostrar(idsublinea){
     $.post("/msublinea/mostrarEdit",{idsublinea : idsublinea}, function(data, status){
         limpiar();
         $('#sublineaModal').modal('show');
         $('#nombre').val(data[0].nombre);
         $('#descripcion').val(data[0].descripcion);
         $('#sublinea').val(data[0].nombre_sublinea);
         $('#idsublinea').val(data[0].idsublinea);
         $('.modal-title').text("Editar sublinea");
         $('#action').val("Edit");	

         /*
            Array
                (
                    [id] => 8
                    [field_foreign] => id
                    [table] => sublinea
                    [value] => codsublinea
                    [description] => nombre
                )
        */
            //console.log(data);
            //$("#idlinea option:selected").removeAttr("selected");	
            

            //$("#idlinea option[value="+ data.id +"]").attr('selected', 'selected');
            cargarCombo('','','linea','idlinea','nombre',data[0].idlinea);
            //cargarCombo(data.id,'id','sublinea','codsublinea','nombre',data.codsublinea);
     });        
 }


function listar(){
		tabla=$('#sublinea_data').dataTable({
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
						url: '/msublinea',
						type : 'post',
						dataType : "json",						
						error: function(e){
							console.log(e.responseText);	
						},
                        data: formularioSublineas.serialize(),
                        success : function(data) {
                            // linea
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

 function cambiarEstado(idsublinea, est){
 		bootbox.confirm("¿Está seguro de cambiar de estatus?", function(result){
			if(result){
				$.ajax({
					url: '/msublinea/cambiarestatus',
                    type: 'POST',
					data:{idsublinea:idsublinea, est:est},
					success: function(datos){
	                	$('#sublinea_data').DataTable().ajax.reload();

				    }

				});
				}
		});//bootbox
	   }

function cargarCombo(id,field_foreign,table,value,description,selected){
  $.ajax({
      url:"/msublinea/cargarCombo",
      method:"POST",
      data:{ id:id, field_foreign:field_foreign, table:table, value:value, description:description, selected:selected},
      success: function(data){

          //console.log(data);
          $("#idsublinea").html(data);

      }

  });
}
function cargarCombo(id,field_foreign,table,value,description,selected){
    $.ajax({
          url:"/msublinea/cargarCombo",
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
		var formData =$("#sublinea_form");
		$.ajax({
			url: "/msublinea/guardaryeditar",
		    type: "POST",
		    data: formData.serialize(),

		    success: function(datos){
	            $('#sublinea_form')[0].reset();
				$('#sublineaModal').modal('hide');

				$('#resultados_ajax4').html(datos);
				$('#sublinea_data').DataTable().ajax.reload();
				
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

