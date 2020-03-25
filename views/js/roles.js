var formularioRoles;
var tabla;

// funcion principal
$(function(){
    // obtengo el formulario del almacen
    formularioRoles = $('#roles_data');
    listar();

    //cuando se da click al boton submit entonces se ejecuta la funcion guardaryeditar(e);
    $("#roles_form").on("submit",function(e){

        guardaryeditar(e);
    })

    //cambia el titulo de la ventana modal cuando se da click al boton
    $("#add_button").click(function(){

        $(".modal-title").text("Registrar Roles");
    });
});

// funcion que agrega las nuevas filas a la tabla
function agregarFilas(roles){
    $('#roles_data').DataTable().clear().draw();
    for(var i=0 ; roles[i] ; i++){
        var rol = roles[i],
            idroles = rol.idroles,
            nombre = rol.nombre,
            descripcion = rol.descripcion,
            fecha = rol.fechainicio,
            estatus = rol.estatus;

        getFilas(idroles,nombre,descripcion, fecha, estatus)
    }
    $('#roles_data').DataTable().draw();
}

function getFilas(idroles,nombre,descripcion, fecha, estatus){
    var table = $('#roles_data').DataTable();
    var string1,string2,string3,string4,string5,string6;

    string1 = '<td>' + idroles + '</td>';
    string2 = '<td>' + nombre + '</td>';
    string3 = '<td>' + descripcion + '</td>';
    string4 = '<td>' + fecha + '</td>';
    string5 = estatus;
    string6 = '<td><button type="button" onClick="mostrar('+idroles+');"  id="" class="btn btn-warning btn-md update"><i class="glyphicon glyphicon-edit"></i> EDITAR</button></td>';
    table.row.add([
        string1,
        string2,
        string3,
        string4,
        string5,
        string6
    ]);
}

function mostrar(idroles){
     $.post("/mroles/mostrarEdit",{idroles : idroles}, function(data, status){
         $('#rolesModal').modal('show');
         $('#nombre').val(data[0].nombre);
         $('#nombreOriginal').val(data[0].nombre);
         $('#descripcion').val(data[0].descripcion);
         $('#estado').val(data[0].estado);
         $('.modal-title').text("Editar roles");
         $('#idroles').val(data[0].idroles);
         $('#action').val("Edit");
     });
 }



function limpiar(){
    $('#nombre').val("");
    $('#descripcion').val("");
    $('#idroles').val("");
}

function listar(){
		tabla=$('#roles_data').dataTable({
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
						url: '/mroles',
						type : 'POST',
						dataType : "json",
						error: function(e){
							console.log(e.responseText);
						},
                        data: formularioRoles.serialize(),
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
function guardaryeditar(e){
		e.preventDefault();
		var formData =$("#roles_form");
		$.ajax({
			url: "/mroles/guardaryeditar",
		    type: "POST",
		    data: formData.serialize(),

		    success: function(datos){
	            $('#roles_form')[0].reset();
				$('#rolesModal').modal('hide');

				$('#resultados_ajax10').html(datos);
				$('#roles_data').DataTable().ajax.reload();

                limpiar();
		    }
		});

	}


function cambiarEstado(idroles, est){
 		bootbox.confirm("¿Está seguro de cambiar de estatus?", function(result){
			if(result){
				$.ajax({
					url: '/mroles/cambiarestatus',
                    type: 'POST',
					data:{idroles:idroles, est:est},
					success: function(datos){
	                	$('#roles_data').DataTable().ajax.reload();

				    }

				});
				}
		});//bootbox
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
