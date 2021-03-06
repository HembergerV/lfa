var formularioMarcas;
var tabla;

// funcion principal
$(function(){
    // obtengo el formulario del almacen
    formularioMarcas = $('#marca_data');
    listar();

    //cuando se da click al boton submit entonces se ejecuta la funcion guardaryeditar(e);
    $("#marca_form").on("submit",function(e){

        guardaryeditar(e);
    })

    //cambia el titulo de la ventana modal cuando se da click al boton
    $("#add_button").click(function(){

        $(".modal-title").text("Registrar Marca");
    });
});

function agregarFilas(marcas){
    $('#marca_data').DataTable().clear().draw();
    for(var i=0 ; marcas[i] ; i++){
        var marca = marcas[i],
            id = marca.id,
            nombre = marca.nombre,
            descripcion = marca.descripcion,
            estatus = marca.estatus;

        getFilas(id,nombre, descripcion, estatus)
    }
    $('#marca_data').DataTable().draw();
}

function getFilas(id,nombre, descripcion, estatus){
    var table = $('#marca_data').DataTable();
    var string1,string2,string3,string4,string5;

    string1 = '<td>' + id + '</td>';
    string2 = '<td>' + nombre + '</td>';
    string3 = '<td>' + descripcion + '</td>';
    string4 = estatus;
    string5 = '<td><button type="button" onClick="mostrar('+id+');"  id="" class="btn btn-warning btn-md update"><i class="glyphicon glyphicon-edit"></i> EDITAR</button></td>';
    table.row.add([
        string1,
        string2,
        string3,
        string4,
        string5
    ]);
}


function limpiar(){
    $('#nombre').val("");
    $('#descripcion').val("");
    $('#id').val("");
}

function listar(){
tabla=$('#marca_data').dataTable({
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
                url: '/mmarca',
                type : "post",
                dataType : "json",
                error: function(e){
                    console.log(e.responseText);
                },
                data: formularioMarcas.serialize(),
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
    $.post("/mmarca/mostrarEdit",{id : id}, function(data, status){
        $('#marcaModal').modal('show');
        $('#nombre').val(data[0].nombre);
        $('#nombreOriginal').val(data[0].nombre);
        $('#descripcion').val(data[0].descripcion);
        $('#estado').val(data[0].estado);
        $('.modal-title').text("Editar Marca");
        $('#id').val(data[0].id);
        $('#action').val("Edit");
    });
}

function guardaryeditar(e){
    e.preventDefault();
    var formData = $("#marca_form");

    $.ajax({
        url: "/mmarca/guardaryeditar",
        type: "POST",
        data: formData.serialize(),

        success: function(datos){
            $('#marca_form')[0].reset();
            $('#marcaModal').modal('hide');

            $('#resultados_ajax10').html(datos);
            $('#marca_data').DataTable().ajax.reload();

            limpiar();
        }
    });
}



function cambiarEstado(id, est){
bootbox.confirm("¿Está seguro de cambiar de estatus?", function(result){
    if(result){
        $.ajax({
            url:"/mmarca/cambiarestatus",
            method:"POST",
            data:{id:id, est:est},
            success: function(data){

                $('#marca_data').DataTable().ajax.reload();

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
