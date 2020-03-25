const passport = require("passport");
const modeloTaller = require('../modelos/Mtaller');

const Utilidad = require('../ayuda/utilidad');

function getTaller(req, res){
    let usuario = req.session.passport.user;

    modeloTaller.get_taller( (error, modelos) => { // si se pudo obtener las listas
            if (error) { // si hubo error
                Utilidad.printError(res, {msg: `Error no se pudieron obtener las listas: ${error}`, tipo: 0});

            }else{
                res.render('mtaller', {modelos, usuario});
            }
        })
};

function mostrar(req,res){
    modeloTaller.get_taller( (error, modelos) => {
        var item = "";
        for(var i = 0; modelos[i]; i++){
          item += '<div class="col-lg-3 col-6">'+
            '<div class="small-box" style="background:'+modelos[i].colorbg+'">'+
              '<div class="inner" style="color:'+modelos[i].colorfont+'">'+
                '<h4>'+modelos[i].nombre+'</h4>'+
                '<p>'+modelos[i].marca+' '+modelos[i].tipo+'</p>'+
              '</div>'+
              '<div class="icon">'+
                '<i class="nav-icon fa '+modelos[i].icono+'"></i>'+
              '</div>'+
              '<a href="/mtaller/modelo?vehiculo='+modelos[i].idmodelo+'" class="small-box-footer">  Ir  <i class="fa fa-arrow-circle-right"></i></a>'+
            '</div>'+
          '</div>';
      }

        if(!error) res.send(item) // se envia el pais seleccionado
    })
}

function guardar(req,res){
    var nombre = req.body.nombre;
    var tipo = req.body.tipo;
    var marca = req.body.marca;
    var colorfont = req.body.colorfont;
    var colorbg = req.body.colorbg;
    var icono;

    switch (tipo) {
      case "AUTO": icono = "fa-car";
        break;
      case "CAMIONETA": icono = "fa-shipping-fast";
        break;
      case "CAMIÓN": icono = "fa-truck-moving";
        break;
    }
    //console.log("Nombre: "+nombre+", Tipo: "+tipo+", Marca: "+marca+", colorfont: "+colorfont+", colorbg: "+colorbg+", Icono: "+icono);
    modeloTaller.get_nombre_modelo(nombre, (error, dato) => {
        if(!dato[0]){
            modeloTaller.registrar_modelo(nombre, tipo, marca, colorfont, colorbg, icono, (error,dato) => {
                modeloTaller.get_taller( (error, modelos) => {
                    if (error) { // si hubo error
                        Utilidad.printError(res, {msg: `Error no se pudieron obtener los vehiculos: ${error}`, tipo: 0});

                    }else{
                        var items = "";
                        for(var i = 0; modelos[i]; i++){
                          items += '<div class="col-lg-3 col-6">'+
                            '<div class="small-box" style="background:'+modelos[i].colorbg+'">'+
                              '<div class="inner" style="color:'+modelos[i].colorfont+'">'+
                                '<h4>'+modelos[i].nombre+'</h4>'+
                                '<p>'+modelos[i].marca+' '+modelos[i].tipo+'</p>'+
                              '</div>'+
                              '<div class="icon">'+
                                '<i class="nav-icon fa '+modelos[i].icono+'"></i>'+
                              '</div>'+
                              '<a href="mtaller/modelo?vehiculo='+modelos[i].idmodelo+'" class="small-box-footer">  Ir  <i class="fa fa-arrow-circle-right"></i></a>'+
                            '</div>'+
                          '</div>';
                        }
                        var msj = '<div class="alert alert-success" role="alert"><button type="button" class="close" data-dismiss="alert">&times;</button> <strong>¡Bien hecho!</strong> El modelo se registró correctamente.</div>';
                        var datos = {
                          msj : msj,
                          items : items,
                          error : false
                        }
                        if(!error) res.send(datos)
                    }
                })
            })
        } else{
            var msj = '<div class="alert alert-danger" role="alert"><button type="button" class="close" data-dismiss="alert">&times;</button> <strong>Error</strong> La modelo ya existe.</div>';
            var datos = {
              msj : msj
            }
            res.send(datos)
        }
    })

}

module.exports = {
    getTaller,
    mostrar,
    guardar
}
