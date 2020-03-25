var LocalStrategy = require('passport-local').Strategy;

module.exports = function(passport){
    passport.serializeUser(function(user, done){
        done(null, user);
    });

    passport.deserializeUser(function(obj,done){
        done(null,obj);
    });

    passport.use('local',new LocalStrategy({
        passReqToCallback: true

        }, function(req,username,password,done){
        const mysql= require('mysql');
        const connection = require(".././modelos/conexion");

        connection.query('SELECT u.*,r.idroles FROM usuario u INNER JOIN usersroles r ON u.idusuario = r.idusuario WHERE email = ?',username, function(err,rows,fields){
            if(err) throw err;

            if(rows.length > 0){
                var user = rows[0];
                if (password == user.password) {
                    return done (null,{
                        id: user.idusuario,
                        nombre: user.nombre,
                        usuario: user.usuario,
                        email: user.email,
                        password: user.password,
                        bobi: user.telefono,
                        estatus: user.estatus,
                        cedula: user.cedula,
                        nacionalidad: user.nacionalidad,
                        rol: user.idroles
                    });
                }
                else{
                    return done(null,false, req.flash('loginMessage','Datos inválidos, vuelva a intentarlo'));
                }
        }

        return done(null,false, req.flash('loginMessage','Usuario desconocido, vuelva a intentarlo'));
        });
        }

        ));

};
