var formularioCrearp;
var tabla;

// funcion principal
$(function(){ 
    // obtengo el formulario del almacen
    formularioCrearp = $('#crearp_data');
    listar();

    //cuando se da click al boton submit entonces se ejecuta la funcion guardaryeditar(e);
    /*$("#crearp_form").on("submit",function(e){

        guardaryeditar(e);	
    })*/

    //cambia el titulo de la ventana modal cuando se da click al boton
    $("#add_button").click(function(){

        $(".modal-title").text("Crear Pedido");
    });
});

function agregarFilas(crearps){
    $('#crearp_data').DataTable().clear().draw();
    for(var i=0 ; crearps[i] ; i++){
        var crearp = crearps[i],
            codigo = crearp.numero_parte,
            nombre = crearp.nombre_repuesto,
            precio = crearp.preciounitario * crearp.monto,
            cantidad = crearp.cantidad,
            total = cantidad*precio;
        getFilas(codigo,nombre, precio, cantidad,total)
    }
        $('#crearp_data').DataTable().draw();

   
}

function getFilas(codigo,nombre, precio, cantidad,total){
    var table = $('#crearp_data').DataTable();
    var string1,string2,string3,string4,string5, string6;
    
    precio = precio.toFixed(2);
    total = total.toFixed(2);

    string1 = '<td>' + codigo + '</td>';
    string2 = '<td>' + nombre + '</td>';
    string3 = '<td>' + formatNumber.new(precio) + '</td>';

    string4 = '<td>' + cantidad + '</td>';
    string5 = '<td> Disponible </td>';
    string6 = '<td>' + formatNumber.new(total) + '</td>';

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
    $('#idcrearp').val("");	
}

function listar(){
    tabla=$('#crearp_data').dataTable({
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
                url: '/mcrearpedido',
                type : "post",
                dataType : "json",						
                error: function(e){
                    console.log(e.responseText);	
                },
                data: formularioCrearp.serialize(),
                
                success : function(datos) {
                    // pais
                    agregarFilas(datos);
                }
            },
    "bDestroy": true,
    "responsive": true,
    "bInfo":true,
    "iDisplayLength": 10,//Por cada 10 registros hace una paginación
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
    var formData = $("#crearp_form");

    $.ajax({
        url: "/mcrearp/guardaryeditar",
        type: "POST",
        data: formData.serialize(),

        success: function(datos){
            $('#crearp_form')[0].reset();
            $('#crearpModal').modal('hide');

            $('#resultados_ajax10').html(datos);
            $('#crearp_data').DataTable().ajax.reload();

            limpiar();		
        }
    });
}


function fnv_soloNumeros(e){
    var keynum = window.event ? window.event.keyCode : e.which;

    if ((keynum == 8))
        return true;

    return /\d/.test(String.fromCharCode(keynum));
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