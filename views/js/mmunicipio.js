var formularioMunicipios;
var tabla;

// funcion principal
$(function(){ 
    formularioMunicipios = $('#municipio_data');
    listar();

      //cuando se da click al boton submit entonces se ejecuta la funcion guardaryeditar(e);
     $("#municipio_form").on("submit",function(e){

         guardaryeditar(e);	
     })

     //cambia el titulo de la ventana modal cuando se da click al boton
     $("#add_button").click(function(){

         $(".modal-title").text("Registrar Municipio");
     });
});
   
// funcion que agrega las nuevas filas a la tabla
function agregarFilas(municipios){
    $('#municipio_data').DataTable().clear().draw();
    for(var i=0 ; municipios[i] ; i++){
        var municipio = municipios[i],
            nombre = municipio.nombre,
            codigo = municipio.codmunicipio,
            estatus = municipio.estatus,
            nombre_pais = municipio.nombre_pais,
            nombre_estado = municipio.nombre_estado;

        getFilas(nombre, codigo, estatus,nombre_pais,nombre_estado)
    }
    $('#municipio_data').DataTable().draw();
}

function getFilas(nombre, codigo, estatus,nombre_pais,nombre_estado){
    var table = $('#municipio_data').DataTable();
    var string1,string2,string3,string4,string5,string6;
    string1 = '<td>' + nombre + '</td>';
    string2 = '<td>' + codigo + '</td>';
    string3 = '<td>' + nombre_pais + '</td>';
    string6 = '<td>' + nombre_estado + '</td>';
    string4 = estatus;
    string5 = '<td><button type="button" onClick="mostrar('+codigo+');"  id="" class="btn btn-warning btn-md update"><i class="glyphicon glyphicon-edit"></i> EDITAR</button></td>';
    table.row.add([
        string2,
        string1,
        string6,
        string3,
        string4,
        string5
    ]);
}


function limpiar(){
    $('#nombre').val("");
    $('#codestado').html("<option value=''>Seleccione una opcion</option>");
    $('#codpais').val("");	
    $('#codmunicipio').val("");	
}

function listar(){
 tabla=$('#municipio_data').dataTable({
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
						url: '/mmunicipio',
						type : 'post',
						dataType : "json",						
						error: function(e){
							console.log(e.responseText);	
						},
                        data: formularioMunicipios.serialize(),
                        success : function(datos) {
                            // muni
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

function mostrar(codmunicipio){
 $.post("/mmunicipio/mostrarEdit",{codmunicipio : codmunicipio}, function(data, status){
     $('#municipioModal').modal('show');
     $('#nombre').val(data[0].nombre);
     $('#estado').val(data[0].nombre_estado);
     $('.modal-title').text("Editar Municipio");
     $('#codmunicipio').val(data[0].codmunicipio);
     
     $('#action').val("Edit");	

     /*
        Array
            (
                [id] => 8
                [field_foreign] => codpais
                [table] => estado
                [value] => codestado
                [description] => nombre
            )

    */
    //console.log(data);
    //$("#codpais option:selected").removeAttr("selected");	


    //$("#codpais option[value="+ data.codpais +"]").attr('selected', 'selected');
    cargarCombo('','','pais','codpais','nombre',data[0].codpais);
    cargarCombo(data[0].codpais,'codpais','estado','codestado','nombre',data[0].codestado);

 });        
}

function guardaryeditar(e){
 e.preventDefault();
 var formData =$("#municipio_form");
 $.ajax({
     url: "/mmunicipio/guardaryeditar",
     type: "POST",
     data: formData.serialize(),

     success: function(datos){
         $('#municipio_form')[0].reset();
         $('#municipioModal').modal('hide');

         $('#resultados_ajax').html(datos);
         $('#municipio_data').DataTable().ajax.reload();

         limpiar();		
     }
 });

}



function cambiarEstado(codmunicipio, est){
  bootbox.confirm("¿Está seguro de cambiar de estatus?", function(result){
     if(result){
         $.ajax({
             url:"/mmunicipio/cambiarestatus",
             method:"POST",
             data:{codmunicipio:codmunicipio, est:est},
             success: function(data){

                 $('#municipio_data').DataTable().ajax.reload();

             }

         });

         }
 });//bootbox
}
function cargarCombo(id,field_foreign,table,value,description,selected){
  $.ajax({
      url:"/mmunicipio/cargarCombo",
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
      url:"/mmunicipio/cargarCombo",
      method:"POST",
      data:{ id:id, field_foreign:field_foreign, table:table, value:value, description:description, selected:selected},
      success: function(data){
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

 