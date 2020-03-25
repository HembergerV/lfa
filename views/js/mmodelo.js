    var formularioOrdenes;
    var tabla;

    // funcion principal
    $(function(){
        // obtengo el formulario del almacen
        formularioOrdenes = $('#cliente_data');
        var modelo = $('#idmodelo')[0];
        listar(modelo.value);
         //cuando se da click al boton submit entonces se ejecuta la funcion guardaryeditar(e);
        $("#cliente_form").on("submit",function(e){

          guardaryeditar(e);
        });

        //cambia el titulo de la ventana modal cuando se da click al boton
        $("#add_button").click(function(){

          $(".modal-title").text("Agregar Orden");
        });


        $("#lista_asociar_repuesto_lista_form").on("submit",function(e){
         guardarAsociarRepuesto(e);
       });
       $("#lista_asociar_manoObra_lista_form").on("submit",function(e){
        guardarAsociarManoObra(e);
      });
    });

    function agregarFilas(listas){
        $('#cliente_data').DataTable().clear().draw();
        for(var i=0 ; listas[i] ; i++){
            var lista = listas[i],
                id = lista.idordenvehiculo,
                placa = lista.placa,
                nombre = lista.nombre_cliente,
                tlf = lista.tlf_cliente,
                modelo = lista.modelo,
                direccion = lista.direccion,
                anio = lista.anio,
                color = lista.color,
                fecha = lista.fecha,
                motivo = lista.motivo,
                deuda = lista.deuda,
                estatus = lista.estatus;

            getFilas(id,placa, nombre, tlf,modelo,direccion, anio, color, fecha, motivo,estatus,i+1,deuda)
        }
        $('#cliente_data').DataTable().draw();
    }

    function getFilas(id,placa, nombre, tlf,modelo,direccion, anio, color, fecha,motivo, estatus,n,deuda){
        var table = $('#cliente_data').DataTable();
        var string1,string2,string3,string4,string5, string6,string7,string8;

        string1 = '<td>' + n + '</td>';
        string2 = '<td>' + placa + '</td>';
        string3 = '<td>' + modelo +" "+ anio +" "+ color + '</td>';
        string4 = '<td>' + nombre + '</td>';
        string5 = '<td>' + tlf +'</td>';
        string8 = deuda;
        string6 = estatus;
        string7 = '<td><button type="button" onClick="mostrar('+id+');"  id="" class="btn btn-warning btn-md update"><i class="glyphicon glyphicon-edit"></i> EDITAR</button>  <button type="button" onClick="asociarRepuestos('+id+',\''+nombre+'\',\''+tlf+'\',\''+direccion+'\',\''+modelo+'\',\''+placa+'\',\''+fecha+'\',\''+motivo+'\')"  title="Agregar Repuestos" id="" class="btn btn-success btn-md update"><i class="glyphicon glyphicon-edit"></i><i class="fas fa-plus"></i></button> <button onclick="asociarManoObra('+id+')" type="button" id="" class="btn btn-white btn-md update" style="background:white"><i class="glyphicon glyphicon-edit"></i><i class=" fas fa-sign-language"></i></button></td>';
        table.row.add([
            string1,
            string2,
            string3,
            string4,
            string5,
            string8,
            string6,
            string7
        ]);
    }


    function limpiar(){
    		$('#cliente').val("");
    		//$('#estado').val("");
        $("#email").val("");
        $("#tiporif").val("");
        $("#rif").val("");
        $("#telefono").val("");
        $("#color").val("");
        $("#placa").val("");
        $("#bateria").val("");
        $("#nota").val("");
        $("#modelo").val("");
        $("#anio").val("");

    		$("#resultados_ajax_msj").html("");

    		$('.js-example-basic-multiple').select2({
    			  language: "es"
    			, theme: "bootstrap"
    			, width: null
    			, tokenSeparators: [',', ' ']
    			, minimumInputLength: 1
    		});
    }

    function listar(idmodelo){
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
                           url: '/mtaller/modelo',
                           type : "post",
                           dataType : "json",
                           error: function(e){
                               console.log(e.responseText);
                           },
                           data: {idmodelo : idmodelo},
                           success : function(date) {
                               agregarFilas(date);
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
    function mostrar(idorden){
     $.post("/mtaller/modelo/mostrarEdit",{idorden : idorden}, function(data, status){
       $('#clienteModal').modal('show');
       $('#color').val(data[0].color);
       $('#placa').val(data[0].placa);
       $('#placaOriginal').val(data[0].placa);
       $('#bateria').val(data[0].bateria);
       $('#modelo').val(data[0].modelo);
       $('#nota').val(data[0].motivo);
       $('#anio').val(data[0].anio);
       $('#bateria').val(data[0].bateria);
       $('#cli').val(data[0].motivo);

       camposcliente(data[0].idcliente);

       $('.modal-title').text("Editar Orden vehículo");
       $('#idordenvehiculo').val(data[0].idordenvehiculo);
       $('#action').val("Edit");
     });
    }


    function camposcliente(idcliente){
       $.post("/mcliente/mostrarEdit",{idcliente : idcliente}, function(data, status){
           $('#nombre').val(data[0].nombre);
           $('#email').val(data[0].email);
           $('#telefono').val(data[0].telefono);
           $('#tiporif').val(data[0].tiporif);
           $('#direccion').val(data[0].direccion);
           $('#rif').val(data[0].rif);
           $('#rifOriginal').val(data[0].rif);
       });
    }

    function guardaryeditar(e){
        e.preventDefault();
        var formData = $("#cliente_form");

    		 $.ajax({
    			 url: "/mtaller/modelo/guardaryeditar",
    			 type: "POST",
    			 data: formData.serialize(),

    			 success: function(datos){
    				 $('#cliente_form')[0].reset();
    				 $('#clienteModal').modal('hide');

    				 $('#resultados_ajax4').html(datos);
    				 $('#cliente_data').DataTable().ajax.reload();

    				 limpiar();
    			 }
    		 });
    }

    function asociarRepuestos(idorden,cliente,telefono,direccion,modelo,placa,fecha,motivo){
          $('.modal-title').text("Repuestos orden vehículo");
    			$("#idordenAsociarRepuestos").val(idorden);
          $("#spancliente").html(cliente);
          $("#spantelefono").html(telefono);
          $("#spandireccion").html(direccion);
          $("#spanvehiculo").html(modelo);
          $("#spanplaca").html(placa);
          fecha = new Date();
          fecha = fecha.getDate()+"-"+fecha.getMonth()+1+"-"+fecha.getFullYear();
          $("#spanfecha").html(fecha);
          $("#spanmotivo").html(motivo);

    			var bar_progress = ' <tr> '+
    						'<td colspan="6"> <div class="progress progress-sm"> '+
    							'<div class="progress-bar bg-success progress-bar-striped" role="progressbar" aria-valuenow="100" aria-valuemin="0" aria-valuemax="100" style="width: 100%"><span class="">Cargando...</span> '+
    							'</div> </div> '+
    						'</td> '+
    					'</tr>';

    			$("#repuesto_data_tbody").html(bar_progress);


    			$("#listaAsociarRepuestoModal").modal("show");


    			$.ajax({
                    url:"/mtaller/modelo/cargarRepuestos",
                    method:"POST",
                    data:{ idorden:idorden },

                    success: function(data){
                        setTimeout(function(){
    						                $("#repuesto_data_tbody").html(data);
    						                declare_editable();

    						                limpiar();
    					          }, 1000);
                    }
    			});

    }

    function asociarManoObra(idorden){
          $('.modal-title').text("Mano de obra | T.O.T.");
    			$("#idordenAsociarManoObra").val(idorden);

    			var bar_progress = ' <tr> '+
    						'<td colspan="6"> <div class="progress progress-sm"> '+
    							'<div class="progress-bar bg-success progress-bar-striped" role="progressbar" aria-valuenow="100" aria-valuemin="0" aria-valuemax="100" style="width: 100%"><span class="">Cargando...</span> '+
    							'</div> </div> '+
    						'</td> '+
    					'</tr>';

    			$("#manoObra_data_tbody").html(bar_progress);


    			$("#listaAsociarManoObraModal").modal("show");


    			$.ajax({
                    url:"/mtaller/modelo/cargarManoObra",
                    method:"POST",
                    data:{ idorden:idorden },

                    success: function(data){
                        setTimeout(function(){
    						                $("#manoObra_data_tbody").html(data);
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
    			url: "/mtaller/modelo/AsociarRepuestos",
    			type: "POST",
    			data: formData.serialize(),

    			success: function(datos){

    				declare_editable();
            if(datos.error){
    					$("#resultados_ajax_msj").html(datos.error);
    				}else{
              $("#repuesto_data_tbody").html(datos.tbody);
    					limpiar();
    				}
    					//$("#resultados_ajax_msj").html(datos.error);
    				/*

    				$('#cliente_form')[0].reset();
    				$('#clienteModal').modal('hide');

    				$('#resultados_ajax4').html(datos);
    				$('#cliente_data').DataTable().ajax.reload();

    				limpiar();
    				*/
    			}
    		});

    	 }
       function guardarAsociarManoObra(e){
       		//console.log(e);
       		e.preventDefault();
       		var formData = $("#lista_asociar_manoObra_lista_form");

       		$.ajax({
       			url: "/mtaller/modelo/AsociarManoObra",
       			type: "POST",
       			data: formData.serialize(),

       			success: function(datos){

       				declare_editable();
               if(datos.error){
       					$("#resultados_ajax_msj").html(datos.error);
       				}else{
                 $("#manoObra_data_tbody").html(datos.tbody);
       					limpiar();
       				}
       					//$("#resultados_ajax_msj").html(datos.error);
       				/*

       				$('#cliente_form')[0].reset();
       				$('#clienteModal').modal('hide');

       				$('#resultados_ajax4').html(datos);
       				$('#cliente_data').DataTable().ajax.reload();

       				limpiar();
       				*/
       			}
       		});

       	 }
    	 function cambiarEstado(idorden, est){
    		  bootbox.confirm("¿Está seguro de cambiar de estatus?", function(result){
    			 if(result){
    				 $.ajax({
    					 url:"/mtaller/modelo/cambiarestatus",
    					 method:"POST",
    					 data:{idorden:idorden, est:est},
    					 success: function(data){

    						$('#cliente_data').DataTable().ajax.reload();

    					 }

    				 });

    				 }
    		 });//bootbox
    		}

        function cambiarEstadoDeuda(idorden, est){
     		  bootbox.confirm("¿Está seguro que desea procesar el pago?", function(result){
     			 if(result){
     				 $.ajax({
     					 url:"/mtaller/modelo/cambiarestatusdeuda",
     					 method:"POST",
     					 data:{idorden:idorden, est:est},
     					 success: function(data){

     						$('#cliente_data').DataTable().ajax.reload();

     					 }

     				 });

     				 }
     		 });//bootbox
     		}

    		function soloLetrasConEspacio(e) {


            console.log(e.keyCode)

    			 // 1
    			 tecla = (document.all) ? e.keyCode : e.which;
    			 if (tecla==8) return true; // backspace
           if (tecla==32) return true; // espacio
           if (tecla==44) return true; // coma
           if (tecla==46) return true; // punto
    			 //if (e.ctrlKey && tecla==86) { return true;} //Ctrl v
    			 //if (e.ctrlKey && tecla==67) { return true;} //Ctrl c
    			 //if (e.ctrlKey && tecla==88) { return true;} //Ctrl x

    			 patron = /[a-zA-Z]/; //patron

    			 te = String.fromCharCode(tecla);
    			 return patron.test(te); // prueba de patron
    		 }

         function soloLetrasConEspacio(e) {
     			 // 1
     			 tecla = (document.all) ? e.keyCode : e.which;
     			 if (tecla==8) return true; // backspace
            if (tecla==32) return true; // espacio
            if (tecla==44) return true; // coma
            if (tecla==46) return true; // punto
     			 //if (e.ctrlKey && tecla==86) { return true;} //Ctrl v
     			 //if (e.ctrlKey && tecla==67) { return true;} //Ctrl c
     			 //if (e.ctrlKey && tecla==88) { return true;} //Ctrl x

     			 patron = /[a-zA-Z]/; //patron

     			 te = String.fromCharCode(tecla);
     			 return patron.test(te); // prueba de patron
     		 }


         function soloLetrasConEspacioComaPunto(e) {
     			 // 1
     			 tecla = (document.all) ? e.keyCode : e.which;
     			 if (tecla==8) return true; // backspace
            if (tecla==32) return true; // espacio
            if (tecla==44) return true; // coma
            if (tecla==46) return true; // punto
     			 //if (e.ctrlKey && tecla==86) { return true;} //Ctrl v
     			 //if (e.ctrlKey && tecla==67) { return true;} //Ctrl c
     			 //if (e.ctrlKey && tecla==88) { return true;} //Ctrl x

     			 patron = /[a-zA-Z]/; //patron

     			 te = String.fromCharCode(tecla);
     			 return patron.test(te); // prueba de patron
     		 }

    		 function removerRepuestos(id,idorden){
    			$.ajax({
    				url:"/mtaller/modelo/ActualizarEstatus",
    				method:"POST",
    				data:{ id:id, idorden:idorden, estatus:1 },

    				success: function(data){
    					$("#repuesto_data_tbody").html(data);

    					declare_editable();

    					limpiar();



    				}
    			});
    		 }

    		 function ActivarRepuestos(id,idorden){
    			$.ajax({
    				url:"/mtaller/modelo/ActualizarEstatus",
    				method:"POST",
    				data:{ id:id, idorden:idorden, estatus:0 },

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
    				tpl: "<input type='text' class='form-control input-sm' onkeypress='return fnv_soloNumeros(event)' style='padding-right: 10px; width:90px;'>"
    			});

    			$('.editable-update').on('save', function(e, params) {
    				var id         = e.currentTarget.dataset.pkid;
    				var idorden = e.currentTarget.dataset.pkcod;
    				var value 	   = params.newValue;

    				$.ajax({
    					url:"/mtaller/modelo/EditarPrecioManoObra",
    					method:"POST",
    					data:{ id:id, idorden:idorden, value:value },

    					success: function(data){

    						console.log(data);

    					}
    				});
    				console.log(id);
    				console.log(value);

    			});
    }
