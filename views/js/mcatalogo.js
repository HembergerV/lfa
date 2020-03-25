var formularioRepuestos;
var tabla;

// funcion principal
$(function(){ 
    // obtengo el formulario del almacen
    formularioRepuestos = $('#repuesto_data');
    listar();

    //cuando se da click al boton submit entonces se ejecuta la funcion guardaryeditar(e);
    $("#repuesto_data").on("submit",function(e){

        guardar(e);	
    })

    //cambia el titulo de la ventana modal cuando se da click al boton
    $("#add_button").click(function(){

        $(".modal-title").text("Agregar Repuesto");
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
            cantidad = repuesto.cantidad,
            precio = repuesto.precio * repuesto.monto,
            estatus = repuesto.estatus_inventario;
        getFilas(id_repuesto,nro_parte, referencia, descripcion,marca,linea,sublinea,cantidad,precio,estatus)
    }
    $('#repuesto_data').DataTable().draw();
}

function getFilas(id_repuesto,nro_parte, referencia, descripcion,marca,linea,sublinea,cantidad,precio,estatus){
    var table = $('#repuesto_data').DataTable();
    var string1,string2,string3,string4,string5,string6,string7,string8;

    precio = precio.toFixed(2);
    
    string2 = '<td>' + nro_parte + '</td>';
    string1 = '<td>' + referencia + '</td>';
    string3 = '<td>' + descripcion + '</td>';
    string4 = '<td>' + marca + '</td>';
    string5 = '<td>' + cantidad + '</td>';
    if(cantidad){
        string6 ='<td><strong style="color:green">Disp</strong></td>';
    } else{
        string6 ='<td><strong style="color:red">No Disp</strong></td>';
    }
    string7 = '<td>' + formatNumber.new(precio) + '</td>';

    string8 = '<td><input id="'+id_repuesto+'" type="text" onkeyup="format(this)" onKeyPress="return fnv_soloNumeros(event)" maxlength="2" style="width:45px; height:45px"></td>'


    table.row.add([
        string1,
        string2,
        string3,
        string4,
        string5,
        string6,
        string7,
        string8
        
        
    ]);
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
						url: '/mcatalogo',
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
function guardar(e){
		e.preventDefault();   
		var formData =$("#repuesto_data");
		$.ajax({
			url: "/mcatalogo/guardar",
		    type: "POST",
		    data: formData.serialize(),

		    success: function(datos){
	            $('#repuesto_data')[0].reset();
				$('#repuestoModal').modal('hide');

				$('#resultados_ajax4').html(datos);
				
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
function format(e){

    var a = {
            valor: e.value,
            id: e.id
        };
		$.ajax({
			url: "/mcatalogo/guardar",
		    type: "POST",
		    data: a
		});
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