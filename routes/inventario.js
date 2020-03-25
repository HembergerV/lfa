const cinventario = require('../controlador/cinventario');
const controller = require('../controlador/inicio');
const crepuesto = require('../controlador/crepuesto');
const cproveedor = require('../controlador/cproveedor');
const clista = require('../controlador/clista');

const combo = require('../controlador/c_combo');

module.exports = (app, passport) => {
    app.get('/mrepuesto',controller.isLogged,controller.isLogged,crepuesto.getRepuesto);
        app.post('/mrepuesto',controller.isLogged,crepuesto.mostrar);
        app.post('/mrepuesto/guardaryeditar',controller.isLogged,crepuesto.guardaryeditar);
        app.post('/mrepuesto/cambiarestatus',controller.isLogged,crepuesto.cambiarestatus);
        app.post('/mrepuesto/mostrarEdit',controller.isLogged,crepuesto.mostrarEdit);
        app.post('/mrepuesto/cargarCombo',controller.isLogged,combo.list_combo);

    app.get('/mproveedor',controller.isLogged,cproveedor.getProveedor);
        app.post('/mproveedor',controller.isLogged,cproveedor.mostrar);
        app.post('/mproveedor/cambiarestatus',controller.isLogged,cproveedor.cambiarestatus);
        app.post('/mproveedor/guardaryeditar',controller.isLogged,cproveedor.guardaryeditar);
        app.post('/mproveedor/mostrarEdit',controller.isLogged,cproveedor.mostrarEdit);

    app.get('/minventario',controller.isLogged,cinventario.getInventario);
        app.get('/minventario/repuesto',controller.isLogged,cinventario.getRepuesto);
        app.post('/minventario',controller.isLogged,cinventario.mostrar);
        app.post('/minventario/mostrarEdit',controller.isLogged,cinventario.mostrarEdit);
        app.post('/minventario/mostrarEditEdit',controller.isLogged,cinventario.mostrarEditEdit);
        app.post('/minventario/guardar',controller.isLogged,cinventario.guardar);
        app.post('/minventario/guardarEditar',controller.isLogged,cinventario.guardarEditar);
        app.post('/minventario/cambiarestatus',controller.isLogged,cinventario.cambiarestatus);
        app.post('/minventario/cambiartasa',controller.isLogged,cinventario.cambiartasa);
        /*app.post('/mrepuesto/mostrarEdit',crepuesto.mostrarEdit);
        app.post('/mrepuesto/cargarCombo',combo.list_combo);*/

    app.get('/mlista',controller.isLogged,clista.getListas);
        app.post('/mlista',controller.isLogged,clista.mostrar);
        app.post('/mlista/mostrarEdit',controller.isLogged,clista.mostrarEdit);
        app.post('/mlista/guardaryeditar',controller.isLogged,clista.guardaryeditar);
        app.post('/mlista/cambiarestatus',controller.isLogged,clista.cambiarestatus);
        app.post('/mlista/cargarRepuestos',controller.isLogged,clista.cargarRepuestos);
        app.post('/mlista/AsociarRepuestos',controller.isLogged,clista.AsociarRepuestos);
        app.post('/mlista/ActualizarEstatus',controller.isLogged,clista.ActualizarEstatus);
        app.post('/mlista/EditarCantidadRepuestos',controller.isLogged,clista.EditarCantidadRepuestos);

};
