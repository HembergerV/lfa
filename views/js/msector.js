var formularioSectores;
var tabla;

// funcion principal
$(function(){ 
    formularioSectores = $('#sector_data');
    listar();

      //cuando se da click al boton submit entonces se ejecuta la funcion guardaryeditar(e);
     $("#sector_form").on("submit",function(e){

         guardaryeditar(e);	
     })

     //cambia el titulo de la ventana modal cuando se da click al boton
     $("#add_button").click(function(){

         $(".modal-title").text("Registrar Sector");
     });
});

// funcion que agrega las nuevas filas a la tabla
function agregarFilas(sectores){
    $('#sector_data').DataTable().clear().draw();
    for(var i=0 ; sectores[i] ; i++){
        var sector = sectores[i],
            nombre = sector.nombre,
            codigo = sector.codsector,
            estatus = sector.estatus,
            nombre_pais = sector.nombre_pais,
            nombre_estado = sector.nombre_estado,
            nombre_municipio = sector.nombre_municipio,
            nombre_parroquia = sector.nombre_parroquia;


        getFilas(nombre, codigo, estatus,nombre_pais,nombre_estado,nombre_municipio,nombre_parroquia)
    }
    $('#sector_data').DataTable().draw();
}

function getFilas(nombre, codigo, estatus,nombre_pais,nombre_estado,nombre_municipio,nombre_parroquia){
    var table = $('#sector_data').DataTable();
    var string1,string2,string3,string4,string5,string6,string7,string8;
    string1 = '<td>' + nombre + '</td>';
    string2 = '<td>' + codigo + '</td>';
    string3 = '<td>' + nombre_pais + '</td>';
    string6 = '<td>' + nombre_estado + '</td>';
    string7 = '<td>' + nombre_municipio + '</td>';
    string8 = '<td>' + nombre_parroquia + '</td>';
    string4 = estatus;
    string5 = '<td><button type="button" onClick="mostrar('+codigo+');"  id="" class="btn btn-warning btn-md update"><i class="glyphicon glyphicon-edit"></i> EDITAR</button></td>';
    table.row.add([
        string2,
        string1,
        string8,
        string7,
        string6,
        string3,
        string4,
        string5
    ]);
}
 
function limpiar(){
    $('#nombre').val("");
    $('#codsector').val("");
    $('#codparroquia').html("<option value=''>Seleccione una opcion</option>");
    $('#codmunicipio').html("<option value=''>Seleccione una opcion</option>");
    $('#codestado').html("<option value=''>Seleccione una opcion</option>");
    $('#codpais').val("");	
}

function listar(){
 tabla=$('#sector_data').dataTable({
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
                 url: '/msector',
                 type : "post",
                 dataType : "json",						
                 error: function(e){
                    console.log(e.responseText);	
                 },
                 data: formularioSectores.serialize(),
                 success : function(datos) {
                        // parro
                 agregarFilas(datos);
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

function mostrar(codsector){
 $.post("/msector/mostrarEdit",{codsector : codsector}, function(data, status){
     $('#sectorModal').modal('show');
     $('#nombre').val(data[0].nombre);
     $('.modal-title').text("Editar Sector");
     $('#codestado').val(data[0].codestado);
     $('#codmunicipio').val(data[0].codmunicipio);
     $('#codparroquia').val(data[0].codparroquia);
     $('#parroquia').val(data[0].nombre_parroquia);
     $('#codsector').val(data[0].codsector);
     $('#estado').val(data[0].nombre_estado);
     $('#action').val("Edit");	


    cargarCombo('','','pais','codpais','nombre',data[0].codpais);
    cargarCombo(data[0].codpais,'codpais','estado','codestado','nombre',data[0].codestado);
    cargarCombo(data[0].codestado,'codestado','municipio','codmunicipio','nombre',data[0].codmunicipio);
    cargarCombo(data[0].codmunicipio,'codmunicipio','parroquia','codparroquia','nombre',data[0].codparroquia);


 });        
}

function guardaryeditar(e){
    e.preventDefault();
    var formData = $("#sector_form");

    $.ajax({
         url: "/msector/guardaryeditar",
         type: "POST",
         data: formData.serialize(),

         success: function(datos){
             $('#sector_form')[0].reset();
             $('#sectorModal').modal('hide');

             $('#resultados_ajax').html(datos);
             $('#sector_data').DataTable().ajax.reload();

             limpiar();		
         }
    });

}


function cambiarEstado(codsector, est){
  bootbox.confirm("¿Está seguro de cambiar de estatus?", function(result){
     if(result){
         $.ajax({
             url:"/msector/cambiarestatus",
             method:"POST",
             data:{codsector:codsector, est:est},
             success: function(data){

                 $('#sector_data').DataTable().ajax.reload();

             }

         });

         }
 });//bootbox
}


function cargarCombo(id,field_foreign,table,value,description,selected){
  $.ajax({
      url:"/msector/cargarCombo",
      method:"POST",
      data:{ id:id, field_foreign:field_foreign, table:table, value:value, description:description, selected:selected},
      success: function(data){

          //console.log(data);
          $("#codestado").html(data);

      }

  });
}

function cargarCombo(id,field_foreign,table,value,description,selected){

  $.ajax({
      url:"/msector/cargarCombo",
      method:"POST",
      data:{ id:id, field_foreign:field_foreign, table:table, value:value, description:description, selected:selected},
      success: function(data){

          //console.log(data);
          $("#"+ value).html(data);

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