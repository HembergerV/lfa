var formularioPedidos;
var tabla;

// funcion principal
$(function(){
    formularioPedidos = $('#pedido_data');
    listar();
    //cuando se da click al boton submit entonces se ejecuta la funcion guardaryeditar(e);
    $("#pedido_form").on("submit",function(e){

        guardaryeditar(e);
    })

    //cambia el titulo de la ventana modal cuando se da click al boton
    $("#add_button").click(function(){

        $(".modal-title").text("Crear Pedido");
    });
});

function guardaryeditar(e){
		e.preventDefault();
		var formData =$("#pedido_form");
		$.ajax({
			url: "/mpedido/guardar",
		    type: "POST",
		    data: formData.serialize(),

		    success: function(datos){


		    }
		});
}

function cambiarEstatus(e){
            console.log(location.href="mpedido?estatus="+e);
        }

// funcion que agrega las nuevas filas a la tabla
function agregarFilas(pedidos){
    $('#pedido_data').DataTable().clear().draw();
    for(var i=0 ; pedidos[i] ; i++){
        var pedido = pedidos[i],
            usuario = pedido.usuario,
            codpedido = pedido.codpedido,
            descripcion = pedido.descripcion,
            documento = pedido.nombre_documento,
            fecha = pedido.fechacreacion,
            estatus = pedido.nombre_estatus;

        getFilas(usuario,codpedido, documento, fecha, estatus,descripcion)
    }
    $('#pedido_data').DataTable().draw();
}

function getFilas(usuario,codpedido, documento, fecha, estatus,descripcion){
    var table = $('#pedido_data').DataTable();
    var string1,string2,string3,string4,string5,string6;

    string1 = '<td><a style="text-decoration: none" href="/mcontinuar_pedido" onclick="ir_a_pedido(this)" id="'+ codpedido +'">' + codpedido + '</a></td>';
    string2 = '<td>' + usuario + '</td>';
    string3 = '<td>' + descripcion + '</td>';
    string4= '<td>' + documento + '</td>';
    string5 = '<td>' + fecha + '</td>';
    string6 = '<td>' + estatus + '</td>';
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
    //$('#estado').val("");
    $('#codpedido').val("");
}

function listar(){
		tabla=$('#pedido_data').dataTable({
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
						url: '/mpedido/listar?estatus='+$('#codestatus')[0].value,
						type : 'get',
						dataType : "json",
						error: function(e){
							console.log(e.responseText);
						},
                        data: formularioPedidos.serialize(),
                        success : function(data) {
                            // pedido
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


function ir_a_pedido(e){
    console.log(e.id);
    var a = {
            id: e.id
    };

    $.ajax({
			url: "/mpedido/ir_a_pedido",
		    type: "POST",
		    data: a
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
