const passport = require("passport");

module.exports ={
    startSession : function(req,res,next){
        let usuario = req.session.passport.user;
        return res.render('inicio',{usuario});
    },
    getSignUp : function(req,res,next){
        return res.render('/login');
    },


    logout : function(res,req,next){
             //esta es una llamada a la funcion logout de passport
                    res.logout();
                    req.redirect('/');
    },
    create : function(req,res,next){
        res.render('crearPedido',{
           isAuthenticated : req.isAuthenticated(),
           user : req.user
        });
    },
    isLogged:function(req,res,next){
        if(req.isAuthenticated()){
            next();
         }else{
            res.redirect('/');
        }
    }
}
