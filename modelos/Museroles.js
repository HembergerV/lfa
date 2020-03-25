const UserModel = require('./conexion')

function get_useroles(next){
    UserModel.query(`SELECT u.id, s.nombre AS nombre_usuario,s.idusuario, r.nombre AS nombre_rol, u.fechainicio, u.estatus FROM usersroles u INNER JOIN usuario s on u.idusuario = s.idusuario INNER JOIN roles r on r.idroles = u.idroles` ,(error, resultado, fields) => {
            next(error, resultado)
    })

  }  

function editar_estatus_useroles(iduseroles, est, next){
    var estado;
    
    if(est == 1){
        estado = 0
    } else
        estado = 1;
    
    UserModel.query('UPDATE usersroles SET estatus='+estado+' WHERE id='+iduseroles ,(error, resultado, fields) => {
            next(error, resultado)
    })
}  

function registrar_useroles(idusuario, idroles, next){
    UserModel.query("INSERT INTO `usersroles`( `idusuario`, `idroles`) VALUES ("+idusuario+","+idroles+")" ,(error, resultado, fields) => {
            next(error, resultado)
    }) 
}

function editar_useroles(idusuario, idroles, id,next){
    UserModel.query("UPDATE usersroles SET idroles="+idroles+" WHERE  id="+id ,(error, resultado, fields) => {
            next(error, resultado)
    }) 
}

function get_idusuario_useroles(idusuario, next){
    UserModel.query('SELECT * FROM usersroles WHERE idusuario='+idusuario ,(error, resultado, fields) => {
            next(error, resultado)
    })

  }  

function get_useroles_por_id(id, next){
    UserModel.query('SELECT * FROM usersroles WHERE id='+id ,(error, resultado, fields) => {
            next(error, resultado)
    })

  }  

module.exports = {
    get_useroles,
    editar_estatus_useroles,
    registrar_useroles,
    editar_useroles,
    get_idusuario_useroles,
    get_useroles_por_id
}