const controller = require('../controlador/inicio');
const cpais = require('../controlador/cpais');
const cestado = require('../controlador/cestado');
const cmunicipio = require('../controlador/cmunicipio');
const cparroquia = require('../controlador/cparroquia');
const csector = require('../controlador/csector');

const combo = require('../controlador/c_combo');

module.exports = (app, passport) => {

    app.get('/mpais',controller.isLogged,cpais.getPais);
    app.post('/mpais',controller.isLogged,cpais.mostrar);
    app.post('/mpais/cambiarestatus',controller.isLogged,cpais.cambiarestatus);
    app.post('/mpais/guardaryeditar',controller.isLogged,cpais.guardaryeditar);
    app.post('/mpais/mostrarEdit',controller.isLogged,cpais.mostrarEdit);
    
    app.get('/mestado',controller.isLogged,cestado.getEstado);
    app.post('/mestado',controller.isLogged,cestado.mostrar);
    app.post('/mestado/cambiarestatus',controller.isLogged,cestado.cambiarestatus);
    app.post('/mestado/cargarCombo',controller.isLogged,combo.list_combo);
    app.post('/mestado/mostrarEdit',controller.isLogged,cestado.mostrarEdit);
    app.post('/mestado/guardaryeditar',controller.isLogged,cestado.guardaryeditar);
    
    app.get('/mmunicipio',controller.isLogged,cmunicipio.getMunicipio);
    app.post('/mmunicipio',controller.isLogged,cmunicipio.mostrar);
    app.post('/mmunicipio/cambiarestatus',controller.isLogged,cmunicipio.cambiarestatus);
    app.post('/mmunicipio/cargarCombo',controller.isLogged,combo.list_combo);
    app.post('/mmunicipio/mostrarEdit',controller.isLogged,cmunicipio.mostrarEdit);
    app.post('/mmunicipio/guardaryeditar',controller.isLogged,cmunicipio.guardaryeditar);
   
    app.get('/mparroquia',controller.isLogged,cparroquia.getParroquia);
    app.post('/mparroquia',controller.isLogged,cparroquia.mostrar);
    
    app.post('/mparroquia/cambiarestatus',controller.isLogged,cparroquia.cambiarestatus);
    app.post('/mparroquia/cargarCombo',controller.isLogged,combo.list_combo);
    app.post('/mparroquia/mostrarEdit',controller.isLogged,cparroquia.mostrarEdit);
    app.post('/mparroquia/guardaryeditar',controller.isLogged,cparroquia.guardaryeditar);
    
    app.get('/msector',controller.isLogged,csector.getSector);
    app.post('/msector',controller.isLogged,csector.mostrar);
    app.post('/msector/cambiarestatus',controller.isLogged,csector.cambiarestatus);
    app.post('/msector/cargarCombo',controller.isLogged,combo.list_combo);
    app.post('/msector/mostrarEdit',controller.isLogged,csector.mostrarEdit);
    app.post('/msector/guardaryeditar',controller.isLogged,csector.guardaryeditar);

};