var formularioNacionalidad;
var tabla;

// funcion principal
$(function(){ 
    // obtengo el formulario del almacen
    formularioNacionalidad = $('#nacionalidad_data');
    listar();

    //cuando se da click al boton submit entonces se ejecuta la funcion guardaryeditar(e);
    $("#nacionalidad_form").on("submit",function(e){

        guardaryeditar(e);	
    })

    //cambia el titulo de la ventana modal cuando se da click al boton
    $("#add_button").click(function(){

        $(".modal-title").text("Registrar Nacionalidad");
    });
});

function agregarFilas(nacionalidades){
    $('#nacionalidad_data').DataTable().clear().draw();
    for(var i=0 ; nacionalidades[i] ; i++){
        var nacionalidad = nacionalidades[i],
            idnacionalidad = nacionalidad.id,
            nombre = nacionalidad.nombre,
            abreviatura = nacionalidad.abreviatura,
            estatus = nacionalidad.estatus;

        getFilas(idnacionalidad,nombre, abreviatura, estatus)
    }
    $('#nacionalidad_data').DataTable().draw();
}

function getFilas(idnacionalidad,nombre, abreviatura, estatus){
    var table = $('#nacionalidad_data').DataTable();
    var string1,string2,string3,string4,string5;
    
    string1 = '<td>' + idnacionalidad + '</td>';
    string2 = '<td>' + nombre + '</td>';
    string3 = '<td>' + abreviatura + '</td>';
    string4 = estatus;
    string5 = '<td><button type="button" onClick="mostrar('+idnacionalidad+');"  id="" class="btn btn-warning btn-md update"><i class="glyphicon glyphicon-edit"></i> EDITAR</button></td>';
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
    $('#abreviatura').val("");
    $('#id').val("");	
}

function listar(){
    tabla=$('#nacionalidad_data').dataTable({
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
                    url: '/mnacionalidad',
                    type : "post",
                    dataType : "json",						
                    error: function(e){
                        console.log(e.responseText);	
                    },
                    data: formularioNacionalidad.serialize(),
                    success : function(data) {
                        // datos para listar
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
    $.post("/mnacionalidad/mostrarEdit",{id : id}, function(data, status){
        $('#nacionalidadModal').modal('show');
        $('#nombre').val(data[0].nombre);
        $('#abreviatura').val(data[0].abreviatura);
        $('#estado').val(data[0].estado);
        $('.modal-title').text("Editar Nacionalidad");
        $('#id').val(data[0].id);
        $('#action').val("Edit");	
    });        
}

function guardaryeditar(e){
    e.preventDefault();
    var formData = $("#nacionalidad_form");

    $.ajax({
        url: "/mnacionalidad/guardaryeditar",
        type: "POST",
        data: formData.serialize(),

        success: function(datos){
            $('#nacionalidad_form')[0].reset();
            $('#nacionalidadModal').modal('hide');

            $('#resultados_ajax').html(datos);
            $('#nacionalidad_data').DataTable().ajax.reload();

            limpiar();		
        }
    });
}



function cambiarEstado(id, est){
    bootbox.confirm("¿Está seguro de cambiar de estatus?", function(result){
        if(result){
            $.ajax({
                url:"/mnacionalidad/cambiarestatus",
                method:"POST",
                data:{id:id, est:est},
                success: function(data){
                    $('#nacionalidad_data').DataTable().ajax.reload();

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