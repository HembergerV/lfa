const controller = require('../controlador/inicio');
const reporte_marcas = require('../controlador/reporte_marcas');
const reporte_sublinea = require('../controlador/reporte_sublinea');
const reporte_proveedor = require('../controlador/reporte_proveedor');
const reporte_lista = require('../controlador/reporte_lista');
const reporte_orden = require('../controlador/reporte_orden');
const reporte_vehiculorecibido = require('../controlador/reporte_vehiculorecibido');
const reporte_vehiculofacturado = require('../controlador/reporte_vehiculofacturado');

module.exports = (app, passport) => {

    app.get('/reporte_sublineas',controller.isLogged, function(req,res){
        let usuario = req.session.passport.user;
        res.render('reporte_sublineas',{usuario})
    });
    app.get('/reporte_marcas',controller.isLogged, function(req,res){
        let usuario = req.session.passport.user;
        res.render('reporte_marcas',{usuario})
    });
    app.get('/reporte_proveedor',controller.isLogged, function(req,res){
        let usuario = req.session.passport.user;
        res.render('reporte_proveedor',{usuario})
    });
    app.get('/reporte_masvendidos',controller.isLogged, function(req,res){
      let usuario = req.session.passport.user;
        res.render('reporte_masvendidos',{usuario})
    });
    app.get('/reporte_clientesfrecuentes',controller.isLogged, function(req,res){
      let usuario = req.session.passport.user;
        res.render('reporte_clientesfrecuentes',{usuario})
    });
    app.get('/reporte_vehiculo',controller.isLogged, function(req,res){
      let usuario = req.session.passport.user;
        res.render('reporte_vehiculo',{usuario})
    });

    app.get('/reportes/control/marca.pdf',controller.isLogged, reporte_marcas.reporte)
    app.get('/reportes/control/sublinea.pdf',controller.isLogged, reporte_sublinea.reporte)
    app.get('/reportes/control/proveedor.pdf',controller.isLogged, reporte_proveedor.reporte)
    app.get('/reportes/control/lista.pdf',controller.isLogged, reporte_lista.reporte)
    app.get('/reportes/control/orden.pdf',controller.isLogged, reporte_orden.reporte)
    app.get('/reportes/control/vehiculosrecibidos.pdf',controller.isLogged, reporte_vehiculorecibido.reporte)
    app.get('/reportes/control/vehiculosfacturados.pdf',controller.isLogged, reporte_vehiculofacturado.reporte)

};
