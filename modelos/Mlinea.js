const UserModel = require('./conexion')

function get_linea(next){
    UserModel.query(`SELECT * FROM linea` ,(error, resultado, fields) => {
            next(error, resultado)
    })

  }  

function get_linea_por_id(idlinea, next){
    UserModel.query('SELECT * FROM linea WHERE idlinea='+idlinea ,(error, resultado, fields) => {
            next(error, resultado)
    })

  }  
function editar_estatus_linea(idlinea, est, next){
    var estado;
    
    if(est == 1){
        estado = 0
    } else
        estado = 1;
    
    UserModel.query('UPDATE linea SET estatus='+estado+' WHERE idlinea='+idlinea ,(error, resultado, fields) => {
            next(error, resultado)
    })
}  

function get_nombre_linea(nombre,next){
    UserModel.query("SELECT * FROM linea where nombre='"+nombre+"'" ,(error, resultado, fields) => {
            next(error, resultado)
    }) 
}

function registrar_linea(nombre, descripcion, next){
    UserModel.query("INSERT INTO linea( `nombre`, `descripcion`,`estatus`) VALUES ('"+nombre+"','"+descripcion+"',1)" ,(error, resultado, fields) => {
            next(error, resultado)
    }) 
}
   
function editar_linea(nombre,descripcion,idlinea,next){
    UserModel.query("UPDATE linea SET nombre='"+nombre+"', descripcion='"+descripcion+"' WHERE  idlinea="+idlinea ,(error, resultado, fields) => {
            next(error, resultado)
    }) 
}


module.exports = {
    get_linea,
    editar_estatus_linea,
    get_nombre_linea,
    registrar_linea,
    get_linea_por_id,
    editar_linea
}