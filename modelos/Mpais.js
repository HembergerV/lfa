const UserModel = require('./conexion')

function get_pais(next){
    UserModel.query(`SELECT codpais,nombre, estatus FROM pais` ,(error, resultado, fields) => {
            next(error, resultado)
    })

  }  

function get_pais_por_id(codpais, next){
    UserModel.query('SELECT * FROM pais WHERE codpais='+codpais ,(error, resultado, fields) => {
            next(error, resultado)
    })

  }  
function editar_estatus_pais(codpais, est, next){
    var estado;
    
    if(est == 1){
        estado = 0
    } else
        estado = 1;
    
    UserModel.query('UPDATE pais SET estatus='+estado+' WHERE codpais='+codpais ,(error, resultado, fields) => {
            next(error, resultado)
    })
}  

function get_nombre_pais(nombre,next){
    UserModel.query("SELECT * FROM pais where nombre='"+nombre+"'" ,(error, resultado, fields) => {
            next(error, resultado)
    }) 
}

function registrar_pais(nombre, next){
    UserModel.query("INSERT INTO `pais`( `nombre`, `estatus`) VALUES ('"+nombre+"',1)" ,(error, resultado, fields) => {
            next(error, resultado)
    }) 
}
   
function editar_pais(nombre,codpais,next){
    UserModel.query("UPDATE `pais` SET `nombre` = '"+nombre+"' WHERE `pais`.`codpais` = "+codpais ,(error, resultado, fields) => {
            next(error, resultado)
    }) 
}


module.exports = {
    get_pais,
    get_pais_por_id,
    editar_estatus_pais,
    get_nombre_pais,
    registrar_pais,
    editar_pais
}