const UserModel = require('./conexion')

function get_estado(next){
    UserModel.query(`SELECT e.* , p.nombre AS nombre_pais, p.codpais FROM estado e INNER JOIN pais p ON e.codpais = p.codpais` ,(error, resultado, fields) => {
            next(error, resultado)
    })

  }  

function get_estado_por_id(codestado, next){
    UserModel.query('SELECT * FROM estado WHERE codestado='+codestado ,(error, resultado, fields) => {
            next(error, resultado)
    })

  }  
function editar_estatus_estado(codestado, est, next){
    var estado;
    
    if(est == 1){
        estado = 0
    } else
        estado = 1;
    
    UserModel.query('UPDATE estado SET estatus='+estado+' WHERE codestado='+codestado ,(error, resultado, fields) => {
            next(error, resultado)
    })
}  

function get_nombre_estado(nombre, codpais,next){
    UserModel.query("SELECT * FROM estado where nombre='"+nombre+"' AND codpais="+codpais ,(error, resultado, fields) => {
            next(error, resultado)
    }) 
}

function registrar_estado(nombre, codestado, next){
    UserModel.query("INSERT INTO `estado`( `nombre`, `codpais`, `estatus`) VALUES ('"+nombre+"',"+codestado+",1)" ,(error, resultado, fields) => {
            next(error, resultado)
    }) 
}
   
function editar_estado(nombre,codpais, codestado,next){
    UserModel.query("UPDATE estado SET nombre='"+nombre+"',codpais="+codpais+" WHERE codestado="+codestado ,(error, resultado, fields) => {
            next(error, resultado)
    }) 
}


module.exports = {
    get_estado,
    get_estado_por_id,
    editar_estatus_estado,
    get_nombre_estado,
    registrar_estado,
    editar_estado
}