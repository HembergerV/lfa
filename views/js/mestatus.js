var formularioEstatus;
var tabla;

// funcion principal
$(function(){
    // obtengo el formulario del almacen
    formularioEstatus = $('#estatus_data');
    listar();

    //cuando se da click al boton submit entonces se ejecuta la funcion guardaryeditar(e);
    $("#estatus_form").on("submit",function(e){

        guardaryeditar(e);
    })

    //cambia el titulo de la ventana modal cuando se da click al boton
    $("#add_button").click(function(){

        $(".modal-title").text("Registrar Estatus");
    });
});

function agregarFilas(testatus){
    $('#estatus_data').DataTable().clear().draw();
    for(var i=0 ; testatus[i] ; i++){
        var estatus = testatus[i],
            idestatus = estatus.idestatus,
            codestatus = estatus.codestatus,
            descripcion = estatus.descripcion,
            nombre = estatus.nombre,
            estatus = estatus.estatus;

        getFilas(idestatus,codestatus, descripcion, nombre,estatus)
    }
    $('#estatus_data').DataTable().draw();
}

function getFilas(idestatus,codestatus, descripcion, nombre, estatus){
    var table = $('#estatus_data').DataTable();
    var string1,string2,string3,string4,string5,string6;

    string1 = '<td>' + idestatus + '</td>';
    string2 = '<td>' + codestatus + '</td>';
    string3 = '<td>' + descripcion + '</td>';
    string4 = '<td>' + nombre + '</td>';
    string5 = estatus;
    string6 = '<td><button type="button" onClick="mostrar('+idestatus+');"  id="" class="btn btn-warning btn-md update"><i class="glyphicon glyphicon-edit"></i> EDITAR</button></td>';
    table.row.add([
        string1,
        string2,
        string4,
        string3,
        string5,
        string6
    ]);
}

function limpiar(){
    $('#codestatus').val("");
    $('#nombre').val("");
    $('#descripcion').val("");

}

function listar(){
    tabla=$('#estatus_data').dataTable({
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
                    url: '/mestatus',
                    type : "post",
                    dataType : "json",
                    error: function(e){
                        console.log(e.responseText);
                    },
                    data: formularioEstatus.serialize(),
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

function mostrar(idestatus){
    $.post("/mestatus/mostrarEdit",{idestatus : idestatus}, function(data, status){
        $('#estatusModal').modal('show');
        $('#codestatus').val(data[0].codestatus);
        $('#nombre').val(data[0].nombre);
        $('#descripcion').val(data[0].descripcion);
        $('#estado').val(data[0].estado);
        $('.modal-title').text("Editar Estatus");
        $('#idestatus').val(data[0].idestatus);
        $('#action').val("Edit");
    });
}

function guardaryeditar(e){
    e.preventDefault();
    var formData = $("#estatus_form");

    $.ajax({
        url: "/mestatus/guardaryeditar",
        type: "POST",
        data: formData.serialize(),

        success: function(datos){

            $('#estatus_form')[0].reset();
            $('#estatusModal').modal('hide');

            $('#resultados_ajax').html(datos);
            $('#estatus_data').DataTable().ajax.reload();

            limpiar();
        }
    });
}



function cambiarEstado(idestatus, est){
    bootbox.confirm("¿Está seguro de cambiar de estatus?", function(result){
        if(result){
            $.ajax({
                url:"/mestatus/cambiarestatus",
                method:"POST",
                data:{idestatus:idestatus, est:est},
                success: function(data){

                    $('#estatus_data').DataTable().ajax.reload();

                }

            });

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

    if ((keynum == 8) || (keynum == 46))
        return true;

    return /\d/.test(String.fromCharCode(keynum));
}
