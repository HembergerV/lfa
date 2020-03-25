var formularioClientes;
var tabla;

// funcion principal
$(function(){
    // obtengo el formulario del almacen
    formularioClientes = $('#cliente_data');
    listar();

    //cuando se da click al boton submit entonces se ejecuta la funcion guardaryeditar(e);
    $("#cliente_form").on("submit",function(e){

        guardaryeditar(e);
    })

    //cambia el titulo de la ventana modal cuando se da click al boton
    $("#add_button").click(function(){

        $(".modal-title").text("Registrar client");
    });
});

function agregarFilas(clientes){
    $('#cliente_data').DataTable().clear().draw();
    for(var i=0 ; clientes[i] ; i++){
        var cliente = clientes[i],
            id = cliente.idcliente,
            tiporif = cliente.abreviatura,
            rif = cliente.rif,
            nombre = cliente.nombre,
            direccion = cliente.direccion,
            email = cliente.email,
            tlf = cliente.telefono,
            estatus = cliente.estatus;

        getFilas(id,tiporif, rif, nombre,direccion,email,tlf,estatus)
    }
    $('#cliente_data').DataTable().draw();
}

function getFilas(id,tiporif, rif, nombre,direccion,email,tlf,estatus){
    var table = $('#cliente_data').DataTable();
    var string1,string2,string3,string4,string5,string6,string7;

    string1 = '<td>' + id + '</td>';
    string2 = '<td>' + tiporif + '-'+rif+'</td>';
    string3 = '<td>' + nombre + '</td>';
    string4 = '<td>' + tlf + '</td>';
    string5 = '<td>' + direccion + '</td>';
    string6 = estatus;
    string7 = '<td><button type="button" onClick="mostrar('+id+');"  id="" class="btn btn-warning btn-md update"><i class="glyphicon glyphicon-edit"></i> EDITAR</button></td>';
    table.row.add([
        string1,
        string2,
        string3,
        string4,
        string5,
        string6,
        string7
    ]);
}


function limpiar(){
    $('#nombre').val("");
    $('#email').val("");
    $('#telefono').val("");
    $('#tiporif').val("");
    $('#rif').val("");
    $('#rifOriginal').val("");
    $('#direccion').val("");
    $('#idcliente').val("");
}

function listar(){
tabla=$('#cliente_data').dataTable({
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
                url: '/mcliente',
                type : "post",
                dataType : "json",
                error: function(e){
                    console.log(e.responseText);
                },
                data: formularioClientes.serialize(),
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

function mostrar(idcliente){
    $.post("/mcliente/mostrarEdit",{idcliente : idcliente}, function(data, status){
        limpiar()
        $('#clienteModal').modal('show');
        $('#nombre').val(data[0].nombre);
        $('#email').val(data[0].email);
        $('#telefono').val(data[0].telefono);
        $('#tiporif').val(data[0].tiporif);
        $('#direccion').val(data[0].direccion);
        $('#rif').val(data[0].rif);
        $('#rifOriginal').val(data[0].rif);
        $('.modal-title').text("Editar cliente");
        $('#idcliente').val(data[0].idcliente);
        $('#action').val("Edit");
    });
}

function guardaryeditar(e){
    e.preventDefault();
    var formData = $("#cliente_form");

    $.ajax({
        url: "/mcliente/guardaryeditar",
        type: "POST",
        data: formData.serialize(),

        success: function(datos){
            $('#cliente_form')[0].reset();
            $('#clienteModal').modal('hide');

            $('#resultados_ajax10').html(datos);
            $('#cliente_data').DataTable().ajax.reload();

            limpiar();
        }
    });
}



function cambiarEstado(id, est){
bootbox.confirm("¿Está seguro de cambiar de estatus?", function(result){
    if(result){
        $.ajax({
            url:"/mcliente/cambiarestatus",
            method:"POST",
            data:{id:id, est:est},
            success: function(data){

                $('#cliente_data').DataTable().ajax.reload();

            }

        });

        }
});//bootbox
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
