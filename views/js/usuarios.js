var formularioUsuarios;
var tabla;

// funcion principal
$(function(){
    // obtengo el formulario del almacen
    formularioUsuarios = $('#usuario_data');
    listar();

    //cuando se da click al boton submit entonces se ejecuta la funcion guardaryeditar(e);
    $("#usuario_form").on("submit",function(e){

        guardaryeditar(e);
    })

    //cambia el titulo de la ventana modal cuando se da click al boton
    $("#add_button").click(function(){

        $(".modal-title").text("Registrar Usuario");
    });
});

function agregarFilas(usuarios){
    $('#usuario_data').DataTable().clear().draw();
    for(var i=0 ; usuarios[i] ; i++){
        var usuario = usuarios[i],
            idusuario = usuario.idusuario,
            nacionalidad = usuario.nacionalidad,
            cedula = usuario.cedula,
            nombre = usuario.nombre,
            apellido = usuario.apellido,
            fechanac = usuario.fechanacimiento,
            tlf = usuario.telefono,
            email = usuario.email,
            direccion = usuario.direccion,
            fechaing = usuario.fechaingreso,
            dpto = usuario.coddpto,
            cargo = usuario.cargo,
            nick = usuario.usuario,
            estatus = usuario.estatus;

        getFilas(idusuario,nacionalidad,cedula, nombre, apellido,fechanac,tlf,email,direccion,fechaing,dpto,cargo,nick,estatus)
    }
    $('#usuario_data').DataTable().draw();
}

function getFilas(idusuario,nacionalidad,cedula, nombre, apellido,fechanac,tlf,email,direccion,fechaing,dpto,cargo,nick,estatus){
    var table = $('#usuario_data').DataTable();
    var string1,string2,string3,string4,string5,string6,string7,string8,string9,string10,string11,string12,string13,string14;

    fechanac = new Date(fechanac)
    fechanac = fechanac.getDate() +"-"+(fechanac.getMonth()+1)+"-"+fechanac.getFullYear();

    fechaing = new Date(fechaing)
    fechaing = fechaing.getDate() +"-"+(fechaing.getMonth()+1)+"-"+fechaing.getFullYear();

    string1 = '<td>' + nacionalidad + '</td>';
    string2 = '<td>' + cedula + '</td>';
    string3 = '<td>' + nombre + '</td>';
    string4 = '<td>' + apellido + '</td>';
    string5 = '<td>' + fechanac + '</td>';
    string6 = '<td>' + tlf + '</td>';
    string7 = '<td>' + email + '</td>';
    string8 = '<td>' + direccion + '</td>';
    string9 = '<td>' + fechaing + '</td>';
    string10 = '<td>' + dpto + '</td>';
    string11 = '<td>' + cargo + '</td>';
    string12 = '<td>' + nick + '</td>';

    string13 = estatus;
    string14 = '<td><button type="button" onClick="mostrar('+idusuario+');"  id="" class="btn btn-warning btn-md update"><i class="glyphicon glyphicon-edit"></i> EDITAR</button></td>';
    table.row.add([
        string1,
        string2,
        string3,
        string4,
        string5,
        string6,
        string7,
        string8,
        string9,
        string10,
        string11,
        string12,
        string13,
        string14,
    ]);
}

//funcion que limpia los campos del formulario
function limpiar(){
    $("#cedula").val("");
    $('#nombre').val("");
    $('#apellido').val("");
    $('#nacionalidad').val("");
    $('#coddpto').val("");
    $('#cargo').val("");
    $('#usuario').val("");
    $('#password').val("");
    $('#password2').val("");
    $('#telefono').val("");
    $('#email').val("");
    $('#direccion').val("");
    $('#idusuario').val("");
    //$('input:checkbox').removeAttr('checked');
}
//function listar
function listar(){
    tabla=$('#usuario_data').dataTable({

    "aProcessing": true,//Activamos el procesamiento del datatables
    "aServerSide": true,//Paginación y filtrado realizados por el servidor
    dom: 'Bfrtip',//Definimos los elementos del control de tabla
    buttons: [
                'copyHtml5',
                'excelHtml5',
                'csvHtml5',
                'pdf'
            ],
    "ajax":
       {
                url: '/musuario',
                type : "post",
                dataType : "json",
                error: function(e){
                    console.log(e.responseText);
                },
                data: formularioUsuarios.serialize(),
                success : function(data) {
                    // usuarios
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
//Mostrar datos del usuario en la ventana modal del formulario
function mostrar(idusuario){
    $.post("/musuario/mostrarEdit",{idusuario : idusuario}, function(data, estatus){
        $("#usuarioModal").modal("show");
        $("#cedula").val(data[0].cedula);
        $('#nombre').val(data[0].nombre);
        $('#apellido').val(data[0].apellido);
        $('#nacionalidad').val(data[0].nacionalidad);
        console.log(data[0].fechanacimiento);
        $('#fechanacimiento').val(data[0].fechanacimiento);
        $('#fechaingreso').val(data[0].fechaingreso);
        $('#coddpto').val(data[0].coddpto);
        $('#cargo').val(data[0].cargo);
        $('#usuario').val(data[0].usuario);
        $('#password').val(data[0].password);
        $('#password2').val(data[0].password2);
        $('#telefono').val(data[0].telefono);
        $('#email').val(data[0].email);
        $('#direccion').val(data[0].direccion);
        $('#estatus').val(data[0].estatus);
        $('.modal-title').text("Editar Usuario");
        $('#idusuario').val(data[0].idusuario);
        $('#action').val("Edit");
    });

}
//la funcion guardaryeditar(e); se llama cuando se da click al boton submit
function guardaryeditar(e){

    e.preventDefault(); //No se activará la acción predeterminada del evento
    var formData = $("#usuario_form");

    var password= $("#password").val();
    var password2= $("#password2").val();

        //si el password conincide entonces se envia el formulario
    if(password == password2){
        $.ajax({
            url: "/musuario/registraryeditar",
            type: "POST",
            data: formData.serialize(),

            success: function(datos){

                $('#usuario_form')[0].reset();
                $('#usuarioModal').modal('hide');

                $('#resultados_ajax').html(datos);
                $('#usuario_data').DataTable().ajax.reload();

                limpiar();

            }
        });

    } //cierre de la validacion


        else {

            bootbox.alert("No coincide el password");
    }
}
//EDITAR ESTADO DEL USUARIO
function cambiarEstado(idusuario,estatus){
    bootbox.confirm("¿Está Seguro de cambiar de estado?", function(result){
        if(result){
            $.ajax({
                url:"/musuario/cambiarestatus",
                method:"POST",
                //toma el valor del id y del estado
                data:{idusuario:idusuario, estatus:estatus},

                success: function(data){
                    $('#usuario_data').DataTable().ajax.reload();
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
