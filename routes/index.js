const controller = require('../controlador/inicio');

module.exports = (app, passport) => {
    app.get('/inicio', controller.isLogged, controller.startSession);
/*    app.get('/mpais', controller.isLogged, (req, res) => {
        res.render('mpais');
    });*/

    app.get('/', (req, res) => {
        res.render('index', {
            message : req.flash('loginMessage')
        });
        return 'hola'
    }, controller.isLogged,controller.logout);
    app.post('/login', passport.authenticate('local',{
        successRedirect: '/inicio',
        failureRedirect:'/',
        failureFlash: true
    }));
    app.get('/salir', controller.isLogged,controller.logout);

    app.post('/enviar', function(req,res,next){
        var nodemailer = require('nodemailer');

        var user = {
            email : req.body.email,
            nombre : req.body.nombre,
            tlf : req.body.tlf,
            texto : req.body.textarea,
        };

        var transporter = nodemailer.createTransport({
          service: 'Gmail',
          auth: {
            user: 'hembergervasquez@gmail.com',
            pass: '26273401'
          }
        });

        var mailOptions = {
          from: 'hembergervasquez@gmail.com',
          to: user.email,
          text: user.texto,
          subject: "La ford automotriz"
        };

        transporter.sendMail(mailOptions, function(error, info){
          if (error) {
            console.log(error);
          } else {
            console.log('Email sent: ' + info.response);
          }
        });
        return res.redirect('/');

    })
    }
