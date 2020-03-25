var formularioTaller;

$(function(){
    // obtengo el formulario del almacen
    formularioTaller = $('#vehiculo_data');
    listar();

    //cuando se da click al boton submit entonces se ejecuta la funcion guardaryeditar(e);
    $("#vehiculoForm").on("submit",function(e){

        guardar(e);
    })

});

function limpiar(){
		$('#nombre').val("");


}

function guardar(e){
    e.preventDefault();
    var formData = $("#vehiculoForm");

		 $.ajax({
			 url: "/mtaller/guardar",
			 type: "POST",
			 data: formData.serialize(),

			 success: function(data){
          if(data.error){
   				      $("#resultados_ajax10").html(data.msj);
   				}else{
                $('#vehiculoForm')[0].reset();
                $('#vehiculoModal').modal('hide');

                $("#resultados_ajax10").html(data.msj);
                $("#vehiculo_data").html(data.items);
   					    limpiar();
   				}
			 }
		 });
}

function listar(){
      $.ajax({
        url:"/mtaller",
        method:"post",
        success: function(data){
           $("#vehiculo_data").html(data);

        }

      });
 }
