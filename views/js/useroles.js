var formularioUserRoles;
var tabla;

// funcion principal
$(function(){ 
    // obtengo el formulario del almacen
    formularioUserRoles = $('#usersroles_data');
    listar();

    //cuando se da click al boton submit entonces se ejecuta la funcion guardaryeditar(e);
    $("#usersroles_form").on("submit",function(e){

        guardaryeditar(e);	
    })

    //cambia el titulo de la ventana modal cuando se da click al boton
    $("#add_button").click(function(){

        $(".modal-title").text("Asignar rol a usuario");
    });
});


// funcion que agrega las nuevas filas a la tabla
function agregarFilas(useroles){
    $('#usersroles_data').DataTable().clear().draw();
    for(var i=0 ; useroles[i] ; i++){
        var rol = useroles[i],
            iduseroles = rol.id,
            nombre_usuario = rol.nombre_usuario,
            nombre_rol = rol.nombre_rol,
            fecha = rol.fechainicio,
            estatus = rol.estatus;

        getFilas(iduseroles,nombre_usuario,nombre_rol, fecha, estatus)
    }
    $('#usersroles_data').DataTable().draw();
}

function getFilas(iduseroles,nombre_usuario,nombre_rol, fecha, estatus){
    var table = $('#usersroles_data').DataTable();
    var string1,string2,string3,string4,string5,string6;
    
    string1 = '<td>' + iduseroles + '</td>';
    string2 = '<td>' + nombre_usuario + '</td>';
    string3 = '<td>' + nombre_rol + '</td>';
    string4 = '<td>' + fecha + '</td>';
    string5 = estatus;
    string6 = '<td><button type="button" onClick="mostrar('+iduseroles+');"  id="" class="btn btn-warning btn-md update"><i class="glyphicon glyphicon-edit"></i> EDITAR</button></td>';
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

    $('#idusuario').val("");
    $('#idroles').val("");
    $('#id').val("");	
    
}
function listar(){
		tabla=$('#usersroles_data').dataTable({
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
						url: '/museroles',
						type : 'POST',
						dataType : "json",						
						error: function(e){
							console.log(e.responseText);	
						},
                        data: formularioUserRoles.serialize(),
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

function mostrar(id){
     $.post("/museroles/mostrarEdit",{id : id}, function(data, status){     
        limpiar();		
        $('#usersrolesModal').modal('show');
        $('#idusuario').val(data[0].idusuario);
        $('#idroles').val(data[0].idroles);
        $('#estado').val(data[0].estado);
        $('.modal-title').text("Editar rol a usuario");
        $('#id').val(data[0].id);
        $('#action').val("Edit");	
     });        
 }


function guardaryeditar(e){
		e.preventDefault();   
		var formData =$("#usersroles_form");
		$.ajax({
			url: "/museroles/guardaryeditar",
		    type: "POST",
		    data: formData.serialize(),

		    success: function(datos){
	            $('#usersroles_form')[0].reset();
				$('#usersrolesModal').modal('hide');

				$('#resultados_ajax10').html(datos);
				$('#usersroles_data').DataTable().ajax.reload();
				
                limpiar();		
		    }
		});
	       
	}

function cambiarEstado(id, est){
 		bootbox.confirm("¿Está seguro de cambiar de estatus?", function(result){
			if(result){
				$.ajax({
					url: '/museroles/cambiarestatus',
                    type: 'POST',
					data:{id:id, est:est},
					success: function(datos){
	                	$('#usersroles_data').DataTable().ajax.reload();

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