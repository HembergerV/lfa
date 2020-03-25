var formularioListas;
var tabla;
// funcion principal
$(function(){
    // obtengo el formulario del almacen
    formularioListas = $('#tramite_data');
    listar();

     //cuando se da click al boton submit entonces se ejecuta la funcion guardaryeditar(e);
    $("#tramite_form").on("submit",function(e){

      guardaryeditar(e);
    });

    //cambia el titulo de la ventana modal cuando se da click al boton
    $("#add_button").click(function(){

      $(".modal-title").text("Agregar Trámite");
    });


    $("#lista_asociar_repuesto_lista_form").on("submit",function(e){
     guardarAsociarRepuesto(e);
   });
});

function agregarFilas(listas){
    $('#tramite_data').DataTable().clear().draw();
    for(var i=0 ; listas[i] ; i++){
        var lista = listas[i],
            id = lista.idlista,
            nombre = lista.nombre,
            descripcion = lista.descripcion,
            estatus = lista.estatus;

        getFilas(id,nombre, descripcion, estatus)
    }
    $('#tramite_data').DataTable().draw();
}

function getFilas(id,nombre, descripcion, estatus){
    var table = $('#tramite_data').DataTable();
    var string1,string2,string3,string4,string5;

    string1 = '<td>' + id + '</td>';
    string2 = '<td>' + nombre + '</td>';
    string3 = '<td>' + descripcion + '</td>';
    string4 = estatus;
    string5 = '<td><button type="button" onClick="mostrar('+id+');"  id="" class="btn btn-warning btn-md update"><i class="glyphicon glyphicon-edit"></i> EDITAR</button>  <button type="button" onClick="asociarRepuestos('+id+',\''+nombre+'\',\''+descripcion+'\')"  title="Agregar Repuestos" id="" class="btn btn-success btn-md update"><i class="glyphicon glyphicon-edit"></i><i class="fas fa-plus"></i></button></td>';
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
		//$('#estado').val("");
		$('#idlista').val("");

		$("#idrepuestos").val("");
		$("#cantidad").val("");

		$("#resultados_ajax_msj").html("");

		$('.js-example-basic-multiple').select2({
			  language: "es"
			, theme: "bootstrap"
			, width: null
			, tokenSeparators: [',', ' ']
			, minimumInputLength: 1
		});
}

function listar(){
		 tabla=$('#tramite_data').dataTable({
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
                       url: '/mlista',
                       type : "post",
                       dataType : "json",
                       error: function(e){
                           console.log(e.responseText);
                       },
                       data: formularioListas.serialize(),
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

	 function mostrar(idlista){
		 $.post("/mlista/mostrarEdit",{idlista : idlista}, function(data, status){
			 $('#tramiteModal').modal('show');
			 $('#nombre').val(data[0].nombre);
       $('#nombreOriginal').val(data[0].nombre);
			 $('#descripcion').val(data[0].descripcion);
			 $('#estado').val(data[0].estado);
			 $('.modal-title').text("Editar Lista");
			 $('#idlista').val(data[0].idlista);
			 $('#action').val("Edit");
		 });
	 }

function guardaryeditar(e){
    e.preventDefault();
    var formData = $("#tramite_form");

		 $.ajax({
			 url: "/mlista/guardaryeditar",
			 type: "POST",
			 data: formData.serialize(),

			 success: function(datos){
				 $('#tramite_form')[0].reset();
				 $('#tramiteModal').modal('hide');

				 $('#resultados_ajax4').html(datos);
				 $('#tramite_data').DataTable().ajax.reload();

				 limpiar();
			 }
		 });
}

function asociarRepuestos(idlista,nombre,descripcion){
			$("#idlistaAsociarRepuestos").val(idlista);
      $("#spannombre").html(nombre);
			$("#spandescripcion").html(descripcion);

			var bar_progress = ' <tr> '+
						'<td colspan="6"> <div class="progress progress-sm"> '+
							'<div class="progress-bar bg-success progress-bar-striped" role="progressbar" aria-valuenow="100" aria-valuemin="0" aria-valuemax="100" style="width: 100%"><span class="">Cargando...</span> '+
							'</div> </div> '+
						'</td> '+
					'</tr>';

			$("#repuesto_data_tbody").html(bar_progress);


			$("#listaAsociarRepuestoModal").modal("show");


			$.ajax({
                url:"/mlista/cargarRepuestos",
                method:"POST",
                data:{ idlista:idlista },

                success: function(data){
                    setTimeout(function(){
                      $("#reporte").val(1);
						                $("#repuesto_data_tbody").html(data);
						                declare_editable();

						                limpiar();
					          }, 1000);
                }
			});

}

function guardarAsociarRepuesto(e){
		//console.log(e);
		e.preventDefault();
		var formData = $("#lista_asociar_repuesto_lista_form");

		$.ajax({
			url: "/mlista/AsociarRepuestos",
			type: "POST",
			data: formData.serialize(),

			success: function(datos){

				declare_editable();
        if(datos.error){
					$("#resultados_ajax_msj").html(datos.error);
				}else{
          $("#reporte").val(1);
          $("#repuesto_data_tbody").html(datos.tbody);
					limpiar();
				}
					//$("#resultados_ajax_msj").html(datos.error);
				/*

				$('#tramite_form')[0].reset();
				$('#tramiteModal').modal('hide');

				$('#resultados_ajax4').html(datos);
				$('#tramite_data').DataTable().ajax.reload();

				limpiar();
				*/
			}
		});

	 }

	 function cambiarEstado(idlista, est){
		  bootbox.confirm("¿Está seguro de cambiar de estatus?", function(result){
			 if(result){
				 $.ajax({
					 url:"/mlista/cambiarestatus",
					 method:"POST",
					 data:{idlista:idlista, est:est},
					 success: function(data){

						$('#tramite_data').DataTable().ajax.reload();

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

		 function removerRepuestos(id,idlista){
			$.ajax({
				url:"/mlista/ActualizarEstatus",
				method:"POST",
				data:{ id:id, idlista:idlista, estatus:1 },

				success: function(data){
					$("#repuesto_data_tbody").html(data);

					declare_editable();

					limpiar();



				}
			});
		 }

		 function ActivarRepuestos(id,idlista){
			$.ajax({
				url:"/mlista/ActualizarEstatus",
				method:"POST",
				data:{ id:id, idlista:idlista, estatus:0 },

				success: function(data){
					$("#repuesto_data_tbody").html(data);

					declare_editable();

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

function declare_editable(){
			$('.editable-update').editable({
				type: 'text',
				mode:'inline',
				name: 'name',
				title: 'Enter name',
				tpl: "<input type='text' class='form-control input-sm' onkeypress='return fnv_soloNumeros(event)' style='padding-right: 10px; width:60px;'>"
			});

			$('.editable-update').on('save', function(e, params) {
				var id         = e.currentTarget.dataset.pkid;
				var idlista = e.currentTarget.dataset.pkcod;
				var value 	   = params.newValue;

				$.ajax({
					url:"/mlista/EditarCantidadRepuestos",
					method:"POST",
					data:{ id:id, idlista:idlista, value:value },

					success: function(data){

						console.log(data);

					}
				});
				console.log(id);
				console.log(value);

			});
}
