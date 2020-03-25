const cusuario = require('../controlador/usuario');
const croles = require('../controlador/croles');
const cuseroles = require('../controlador/cuseroles');
const controller = require('../controlador/inicio');

module.exports = (app, passport) => {
    app.get('/musuario',controller.isLogged,cusuario.getUsuario);
        app.post('/musuario',controller.isLogged,cusuario.mostrar);
        app.post('/musuario/registraryeditar',controller.isLogged,cusuario.registraryeditar);
        app.post('/musuario/mostrarEdit',controller.isLogged,cusuario.mostrarEdit);
        app.post('/musuario/cambiarestatus',controller.isLogged,cusuario.cambiarestatus);

    app.get('/mroles',controller.isLogged,croles.getRoles);
        app.post('/mroles',controller.isLogged,croles.mostrar);
        app.post('/mroles/guardaryeditar',controller.isLogged,croles.guardaryeditar);
        app.post('/mroles/mostrarEdit',controller.isLogged,croles.mostrarEdit);
        app.post('/mroles/cambiarestatus',controller.isLogged,croles.cambiarestatus);

    app.get('/museroles',controller.isLogged,cuseroles.getUseroles);
        app.post('/museroles',controller.isLogged,cuseroles.mostrar);
        app.post('/museroles/guardaryeditar',controller.isLogged,cuseroles.guardaryeditar);
        app.post('/museroles/mostrarEdit',controller.isLogged,cuseroles.mostrarEdit);
        app.post('/museroles/cambiarestatus',controller.isLogged,cuseroles.cambiarestatus);
};
