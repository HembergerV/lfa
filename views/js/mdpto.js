var formularioDpto;
var tabla;

// funcion principal
$(function(){
    // obtengo el formulario del almacen
    formularioDpto = $('#cargo_data');
    listar();

    //cuando se da click al boton submit entonces se ejecuta la funcion guardaryeditar(e);
    $("#dpto_form").on("submit",function(e){

        guardaryeditar(e);
    })

    //cambia el titulo de la ventana modal cuando se da click al boton
    $("#add_button").click(function(){

        $(".modal-title").text("Registrar Departamento");
    });
});

function agregarFilas(dptos){
    $('#dpto_data').DataTable().clear().draw();
    for(var i=0 ; dptos[i] ; i++){
        var dpto = dptos[i],
            id = dpto.id,
            coddpto = dpto.coddpto,
            nombre = dpto.nombre,
            estatus = dpto.estatus;

        getFilas(id,coddpto, nombre, estatus)
    }
    $('#dpto_data').DataTable().draw();
}

function getFilas(id,coddpto, nombre, estatus){
    var table = $('#dpto_data').DataTable();
    var string1,string2,string3,string4,string5;

    string1 = '<td>' + id + '</td>';
    string2 = '<td>' + coddpto + '</td>';
    string3 = '<td>' + nombre + '</td>';
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
    $('#coddpto').val("");
    $('#nombre').val("");
    $('#id').val("");
}

function listar(){
    tabla=$('#dpto_data').dataTable({
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
                    url: '/mdpto',
                    type : "post",
                    dataType : "json",
                    error: function(e){
                        console.log(e.responseText);
                    },
                    data: formularioDpto.serialize(),
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

function mostrar(id){
    $.post("/mdpto/mostrarEdit",{id : id}, function(data, status){
        $('#dptoModal').modal('show');
        $('#coddpto').val(data[0].coddpto);
        $('#coddptoOriginal').val(data[0].coddpto);
        $('#nombre').val(data[0].nombre);
        $('#nombreOriginal').val(data[0].nombre);
        $('#estado').val(data[0].estado);
        $('.modal-title').text("Editar Departamento");
        $('#id').val(data[0].id);
        $('#action').val("Edit");
    });
}

function guardaryeditar(e){
    e.preventDefault();
    var formData = $("#dpto_form");

    $.ajax({
        url: "/mdpto/guardaryeditar",
        type: "POST",
        data: formData.serialize(),

        success: function(datos){
            console.log(datos);

            $('#dpto_form')[0].reset();
            $('#dptoModal').modal('hide');

            $('#resultados_ajax5').html(datos);
            $('#dpto_data').DataTable().ajax.reload();

            limpiar();
        }
    });

}



function cambiarEstado(id, est){
    bootbox.confirm("¿Está seguro de cambiar de estatus?", function(result){
        if(result){
            $.ajax({
                url:"/mdpto/cambiarestatus",
                method:"POST",
                data:{id:id, est:est},
                success: function(data){

                    $('#dpto_data').DataTable().ajax.reload();

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

    function fnv_soloNumeros(e){
        var keynum = window.event ? window.event.keyCode : e.which;

        if ((keynum == 8) || (keynum == 46))
            return true;

        return /\d/.test(String.fromCharCode(keynum));
    }
