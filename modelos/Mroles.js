const UserModel = require('./conexion')

function get_roles(next){
    UserModel.query(`SELECT * FROM roles` ,(error, resultado, fields) => {
            next(error, resultado)
    })

  }  

function editar_estatus_roles(idroles, est, next){
    var estado;
    
    if(est == 1){
        estado = 0
    } else
        estado = 1;
    
    UserModel.query('UPDATE roles SET estatus='+estado+' WHERE idroles='+idroles ,(error, resultado, fields) => {
            next(error, resultado)
    })
}  

function get_nombre_roles(nombre,next){
    UserModel.query("SELECT * FROM roles where nombre='"+nombre+"'" ,(error, resultado, fields) => {
            next(error, resultado)
    }) 
}

function registrar_roles(nombre,descripcion, next){
    UserModel.query("INSERT INTO `roles`( `nombre`, `descripcion`) VALUES ('"+nombre+"','"+descripcion+"')" ,(error, resultado, fields) => {
            next(error, resultado)
    }) 
}

function editar_roles(nombre,descripcion,idroles,next){
    UserModel.query("UPDATE roles SET nombre='"+nombre+"', descripcion='"+descripcion+"' WHERE  idroles="+idroles ,(error, resultado, fields) => {
            next(error, resultado)
    }) 
}

function get_roles_por_id(idroles, next){
    UserModel.query('SELECT * FROM roles WHERE idroles='+idroles ,(error, resultado, fields) => {
            next(error, resultado)
    })

  }  

module.exports = {
    get_roles,
    editar_estatus_roles,
    get_nombre_roles,
    registrar_roles,
    editar_roles,
    get_roles_por_id
}