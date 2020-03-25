'use strict'

const express = require('express'),
    bodyParser = require('body-parser'),
    ejs = require('ejs'),
    restFul = require('method-override')('_method'),
    config = require('./config'),
    cookieSession = require("cookie-session"),

    passport = require("passport"),
    path = require("path"),
    flash = require("connect-flash"),

app = express()

app
    // configuracion app
    .set("view engine","ejs")
    .set("views", path.join(__dirname,"views"))
    .set('port',process.env.PORT || 3000)
    // ejecutando middleware
    .use( config.PUBLIC, express.static('public') )
    // parse application/json
    .use( bodyParser.json())
    // parse applicaction/x-www-form-urlencoded
    .use( bodyParser.urlencoded({extended:false}) )
    // para put y delete
    .use( restFul )
    .use(cookieSession({
        name: "session",
        keys: ["ford","time"]
    }))

    .use(flash())
    .use(passport.initialize())
    .use(passport.session());


//requires
require('./controlador/passport')(passport);
process.on('uncaughtException', function (err) {
    console.log(err);
}); 
//routes
const rutaIndex = require("./routes/index")(app, passport);
const rutaUsuario = require("./routes/usuario")(app, passport);
const rutaAreaGeo = require("./routes/areageo")(app, passport);
const rutaAreaOrg = require("./routes/areaorg")(app, passport);
const rutaProcesos = require("./routes/procesos")(app, passport);
const rutaInventario = require("./routes/inventario")(app, passport);
const rutaReportes = require("./routes/reportes")(app, passport);

const rutaSeguridad = require("./routes/seguridad")(app, passport);

module.exports = app
