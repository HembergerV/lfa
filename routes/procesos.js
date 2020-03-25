const cpedido = require('../controlador/cpedido');
const ccrearpedido = require('../controlador/ccrearpedido');
const cinventario = require('../controlador/ccatalogo');
const ctaller = require('../controlador/ctaller');
const cmodelo = require('../controlador/cmodelo');
const ccliente = require('../controlador/ccliente');

const combo = require('../controlador/c_combo');
const controller = require('../controlador/inicio');

module.exports = (app, passport) => {
    app.get('/mpedido',controller.isLogged,cpedido.getPedido);
        app.get('/mpedido/listar',controller.isLogged,cpedido.mostrar);
        app.post('/mpedido/ir_a_pedido',controller.isLogged,cpedido.ir_a_pedido);

    app.get('/mcrearpedido',controller.isLogged,ccrearpedido.getCrearpedido);
        app.post('/mcrearpedido',controller.isLogged,ccrearpedido.mostrar);
        app.get('/mcontinuar_pedido',controller.isLogged,ccrearpedido.continuar_pedido);

    app.get('/mcatalogo',controller.isLogged,cinventario.getInventario);
        app.post('/mcatalogo',controller.isLogged,cinventario.mostrar);
        app.post('/mcatalogo/guardar',controller.isLogged,cinventario.guardar);

    app.get('/mtaller',controller.isLogged, ctaller.getTaller);
        app.post('/mtaller',controller.isLogged,ctaller.mostrar);
        app.post('/mtaller/guardar',controller.isLogged,ctaller.guardar);
    app.get('/mtaller/modelo',controller.isLogged,cmodelo.getVehiculo);
        app.post('/mtaller/modelo',controller.isLogged,cmodelo.mostrar);
        app.post('/mtaller/modelo/guardaryeditar',controller.isLogged,cmodelo.guardaryeditar);
        app.post('/mtaller/modelo/cambiarestatus',controller.isLogged,cmodelo.cambiarestatus);
        app.post('/mtaller/modelo/cambiarestatusdeuda',controller.isLogged,cmodelo.cambiarestatusdeuda);
        app.post('/mtaller/modelo/mostrarEdit',controller.isLogged,cmodelo.mostrarEdit);
        app.post('/mtaller/modelo/cargarRepuestos',controller.isLogged,cmodelo.cargarRepuestos);
        app.post('/mtaller/modelo/AsociarRepuestos',controller.isLogged,cmodelo.AsociarRepuestos);
        app.post('/mtaller/modelo/ActualizarEstatus',controller.isLogged,cmodelo.ActualizarEstatus);
        app.post('/mtaller/modelo/EditarCantidadRepuestos',controller.isLogged,cmodelo.EditarCantidadRepuestos);
    app.post('/mtaller/modelo/cargarManoObra',controller.isLogged,cmodelo.cargarManoObra);
        app.post('/mtaller/modelo/EditarPrecioManoObra',controller.isLogged,cmodelo.EditarPrecioManoObra);
        app.post('/mtaller/modelo/AsociarManoObra',controller.isLogged,cmodelo.AsociarManoObra);


    app.get('/mtaller/orden',controller.isLogged,cmodelo.getOrdenvehiculo);

    app.get('/mcliente',controller.isLogged, ccliente.getCliente);
        app.post('/mcliente',controller.isLogged,ccliente.mostrar);
        app.post('/mcliente/cambiarestatus',controller.isLogged,ccliente.cambiarestatus);
        app.post('/mcliente/guardaryeditar',controller.isLogged,ccliente.guardaryeditar);
        app.post('/mcliente/mostrarEdit',controller.isLogged,ccliente.mostrarEdit);

};
