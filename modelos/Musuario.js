const UserModel = require('./conexion')

function get_usuario(next){
    UserModel.query(`SELECT  u.idusuario,
                      u.nombre,
                      u.apellido,
                      u.nacionalidad,
                      u.cedula,
                      u.fechanacimiento,
                      u.telefono,
                      u.email,
                      u.direccion,
                      u.fechaingreso,
                      u.coddpto,
                      u.cargo,
                      u.usuario, 
                      u.password, 
                      u.password2, 
                      u.estatus, 
                      n.abreviatura AS nacionalidad,
                      c.nombre AS cargo,
                      d.nombre AS coddpto
              FROM usuario u
              INNER JOIN nacionalidad n ON u.nacionalidad = n.id
              INNER JOIN cargo c        ON u.cargo        = c.idcargo
              INNER JOIN dpto d         ON u.coddpto      = d.id` ,(error, resultado, fields) => {
            next(error, resultado)
    })

  }  

function get_usuario_por_id(idusuario, next){
    UserModel.query('SELECT * FROM usuario WHERE idusuario='+idusuario ,(error, resultado, fields) => {
            next(error, resultado)
    })

  }  
function editar_estatus_usuario(idusuario, est, next){
    var estado;
    
    if(est == 1){
        estado = 0
    } else
        estado = 1;
    
    UserModel.query('UPDATE usuario SET estatus='+estado+' WHERE idusuario='+idusuario ,(error, resultado, fields) => {
            next(error, resultado)
    })
}  

function get_cedula_correo(cedula,correo,next){
    UserModel.query("SELECT * FROM usuario where cedula='"+cedula+"' OR email='"+correo+"'" ,(error, resultado, fields) => {
            next(error, resultado)
    }) 
}

function registrar_usuario(nombre,apellido,nacionalidad,cedula,fechanacimiento,telefono,email,direccion,coddpto,cargo,usuario,password,password2, next){
    UserModel.query("INSERT INTO usuario(nombre,apellido,nacionalidad,cedula,fechanacimiento,telefono,email,direccion,coddpto,cargo,usuario,password,password2) VALUES('"+nombre+"','"+apellido+"',"+nacionalidad+",'"+cedula+"','"+fechanacimiento+"','"+telefono+"','"+email+"','"+direccion+"',"+coddpto+","+cargo+",'"+usuario+"','"+password+"','"+password2+"')" ,(error, resultado, fields) => {
            next(error, resultado)
    }) 
}
   
function editar_usuario(nombre,apellido,nacionalidad,cedula,fechanacimiento,telefono,email,direccion,coddpto,cargo,usuario,password,password2,idusuario,next){
    UserModel.query("UPDATE usuario SET nombre='"+nombre+"', apellido='"+apellido+"', nacionalidad="+nacionalidad+", cedula='"+cedula+"',fechanacimiento='"+fechanacimiento+"', telefono='"+telefono+"', email='"+email+"', direccion='"+direccion+"', coddpto="+coddpto+", cargo="+cargo+", usuario='"+usuario+"', password='"+password+"', password2='"+password2+"' WHERE idusuario="+idusuario ,(error, resultado, fields) => {
            next(error, resultado)
    }) 
}


module.exports = {
    get_usuario,
    get_usuario_por_id,
    editar_estatus_usuario,
    get_cedula_correo,
    registrar_usuario,
    editar_usuario
}