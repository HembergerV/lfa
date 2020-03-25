const ccargo = require('../controlador/ccargo');
const cestatus = require('../controlador/cestatus');
const cdpto = require('../controlador/cdpto');
const cnacionalidad = require('../controlador/cnacionalidad');
const crif = require('../controlador/crif');
const cmarca = require('../controlador/cmarca');
const clinea = require('../controlador/clinea');
const csublinea = require('../controlador/csublinea');
const cproveedor = require('../controlador/cproveedor');

const combo = require('../controlador/c_combo');
const controller = require('../controlador/inicio');

module.exports = (app, passport) => {
    app.get('/mcargo',controller.isLogged,ccargo.getCargo);
        app.post('/mcargo',controller.isLogged,ccargo.mostrar);
        app.post('/mcargo/cambiarestatus',controller.isLogged,ccargo.cambiarestatus);
        app.post('/mcargo/guardaryeditar',controller.isLogged,ccargo.guardaryeditar);
        app.post('/mcargo/mostrarEdit',controller.isLogged,ccargo.mostrarEdit);

    app.get('/mestatus',controller.isLogged,cestatus.getEstatus);
        app.post('/mestatus',controller.isLogged,controller.isLogged,cestatus.mostrar);
        app.post('/mestatus/cambiarestatus',controller.isLogged,controller.isLogged,cestatus.cambiarestatus);
        app.post('/mestatus/guardaryeditar',controller.isLogged,controller.isLogged,cestatus.guardaryeditar);
        app.post('/mestatus/mostrarEdit',controller.isLogged,controller.isLogged,cestatus.mostrarEdit);

    app.get('/mdpto',controller.isLogged,controller.isLogged,cdpto.getDpto);
        app.post('/mdpto',controller.isLogged,cdpto.mostrar);
        app.post('/mdpto/cambiarestatus',controller.isLogged,cdpto.cambiarestatus);
        app.post('/mdpto/guardaryeditar',controller.isLogged,cdpto.guardaryeditar);
        app.post('/mdpto/mostrarEdit',controller.isLogged,cdpto.mostrarEdit);

    app.get('/mnacionalidad',controller.isLogged,cnacionalidad.getNacionalidad);
        app.post('/mnacionalidad',controller.isLogged,cnacionalidad.mostrar);
        app.post('/mnacionalidad/cambiarestatus',controller.isLogged,cnacionalidad.cambiarestatus);
        app.post('/mnacionalidad/guardaryeditar',controller.isLogged,cnacionalidad.guardaryeditar);
        app.post('/mnacionalidad/mostrarEdit',controller.isLogged,cnacionalidad.mostrarEdit);

    app.get('/mrif',controller.isLogged,crif.getRif);
        app.post('/mrif',controller.isLogged,crif.mostrar);
        app.post('/mrif/cambiarestatus',controller.isLogged,crif.cambiarestatus);
        app.post('/mrif/guardaryeditar',controller.isLogged,crif.guardaryeditar);
        app.post('/mrif/mostrarEdit',controller.isLogged,crif.mostrarEdit);

    app.get('/mmarca',controller.isLogged,cmarca.getMarca);
        app.post('/mmarca',controller.isLogged,cmarca.mostrar);
        app.post('/mmarca/cambiarestatus',controller.isLogged,cmarca.cambiarestatus);
        app.post('/mmarca/guardaryeditar',controller.isLogged,cmarca.guardaryeditar);
        app.post('/mmarca/mostrarEdit',controller.isLogged,cmarca.mostrarEdit);

    app.get('/mlinea',controller.isLogged,clinea.getLinea);
        app.post('/mlinea',controller.isLogged,clinea.mostrar);
        app.post('/mlinea/cambiarestatus',controller.isLogged,clinea.cambiarestatus);
        app.post('/mlinea/guardaryeditar',controller.isLogged,clinea.guardaryeditar);
        app.post('/mlinea/mostrarEdit',controller.isLogged,clinea.mostrarEdit);

    app.get('/msublinea',controller.isLogged,csublinea.getSublinea);
        app.post('/msublinea',controller.isLogged,csublinea.mostrar);
        app.post('/msublinea/cambiarestatus',controller.isLogged,csublinea.cambiarestatus);
        app.post('/msublinea/cargarCombo',controller.isLogged,combo.list_combo);
        app.post('/msublinea/guardaryeditar',controller.isLogged,csublinea.guardaryeditar);
        app.post('/msublinea/mostrarEdit',controller.isLogged,csublinea.mostrarEdit);

    //app.get('/mproveedor',controller.isLogged,cproveedor.getProveedor);
    /*app.post('/mproveedor',controller.isLogged,cproveedor.mostrar);
    app.post('/mproveedor/cambiarestatus',controller.isLogged,cproveedor.cambiarestatus);
    app.post('/mproveedor/cargarCombo',controller.isLogged,combo.list_combo);
    app.post('/mproveedor/guardaryeditar',controller.isLogged,cproveedor.guardaryeditar);
    app.post('/mproveedor/mostrarEdit',controller.isLogged,cproveedor.mostrarEdit);*/
};
