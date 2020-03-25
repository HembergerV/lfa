var formularioPaises;
var tabla;
// funcion que agrega las nuevas filas a la tabla
function agregarFilas(paises){
    $('#pais_data').DataTable().clear().draw();
    for(var i=0 ; paises[i] ; i++){
        var pais = paises[i],
            nombre = pais.nombre,
            codigo = pais.codpais,
            estatus = pais.estatus;

        getFilas(nombre, codigo, estatus)
    }
    $('#pais_data').DataTable().draw();
}

function getFilas(nombre, codigo, estatus){
    var table = $('#pais_data').DataTable();
    var string1,string2,string3,string4;
    
    string1 = '<td>' + nombre + '</td>';
    string2 = '<td>' + codigo + '</td>';
    string3 = estatus;
    string4 = '<td><button type="button" onClick="mostrar('+codigo+');"  id="" class="btn btn-warning btn-md update"><i class="glyphicon glyphicon-edit"></i> EDITAR</button></td>';
    table.row.add([
        string2,
        string1,
        string3,
        string4
    ]);
}
// obtencion de los datos para el top ten
function obtenerPais() {
    $.ajax({
        url: '/mpais',
        type: 'POST',
        data: formularioPaises.serialize(),
        success : function(data) {
            // pais
            agregarFilas(data);
        }
    });
}

function limpiar(){
    $('#nombre').val("");
    //$('#estado').val("");
    $('#codpais').val("");	
}

function mostrar(codpais){
     $.post("/mpais/mostrarEdit",{codpais : codpais}, function(data, status){
         
         $('#paisModal').modal('show');
         $('#nombre').val(data[0].nombre);
         $('.modal-title').text("Editar País");
         $('#codpais').val(data[0].codpais);
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
     });        
 }

function listar(){
		tabla=$('#pais_data').dataTable({
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
						url: '/mpais',
						type : 'POST',
						dataType : "json",						
						error: function(e){
							console.log(e.responseText);	
						},
                        data: formularioPaises.serialize(),
                        success : function(data) {
                            // pais
                            agregarFilas(data);
                        }
					},
			"bDestroy": true,
			"responsive": true,
			"bInfo":true,
			"iDisplayLength": 10,//Por cada 10 registros hace una paginación
		    "order": [[ 0, "desc" ]],//Ordenar (columna,orden)
		    
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

 function cambiarEstado(codpais, est){
 		bootbox.confirm("¿Está seguro de cambiar de estatus?", function(result){
			if(result){
				$.ajax({
					url: '/mpais/cambiarestatus',
                    type: 'POST',
					data:{codpais:codpais, est:est},
					success: function(datos){
	                	$('#pais_data').DataTable().ajax.reload();

				    }

				});
				}
		});//bootbox
	   }

function guardaryeditar(e){
		e.preventDefault();   
		var formData =$("#pais_form");
		$.ajax({
			url: "/mpais/guardaryeditar",
		    type: "POST",
		    data: formData.serialize(),

		    success: function(datos){
	            $('#pais_form')[0].reset();
				$('#paisModal').modal('hide');

				$('#resultados_ajax4').html(datos);
				$('#pais_data').DataTable().ajax.reload();
				
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

// funcion principal
$(function(){ 
    // obtengo el formulario del almacen
    formularioPaises = $('#pais_data');
    listar();

    //cuando se da click al boton submit entonces se ejecuta la funcion guardaryeditar(e);
    $("#pais_form").on("submit",function(e){

        guardaryeditar(e);	
    })

    //cambia el titulo de la ventana modal cuando se da click al boton
    $("#add_button").click(function(){

        $(".modal-title").text("Registrar País");
    });
});
    