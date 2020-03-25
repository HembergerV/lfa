const UserModel = require('./conexion')

function get_parroquia(next){
    UserModel.query(`SELECT pr.* ,m.nombre as nombre_municipio, e.nombre AS nombre_estado, p.nombre AS nombre_pais, p.codpais, e.codestado FROM parroquia pr INNER JOIN municipio m  ON pr.codmunicipio = m.codmunicipio INNER JOIN estado e ON m.codestado = e.codestado INNER JOIN pais p ON e.codpais = p.codpais` ,(error, resultado, fields) => {
            next(error, resultado)
    })

  }  

function get_parroquia_por_id(codparroquia, next){
    UserModel.query("SELECT pr.* ,m.nombre as nombre_municipio ,e.nombre AS nombre_estado ,p.nombre AS nombre_pais ,p.codpais ,e.codestado FROM parroquia pr INNER JOIN municipio m  ON pr.codmunicipio = m.codmunicipio INNER JOIN estado e     ON m.codestado = e.codestado INNER JOIN pais p ON e.codpais = p.codpais WHERE pr.codparroquia="+ codparroquia,(error, resultado, fields) => {
            next(error, resultado)
    })

  }  
function editar_estatus_parroquia(codparroquia, est, next){
    var estado;
    
    if(est == 1){
        estado = 0
    } else
        estado = 1;
    
    UserModel.query('UPDATE parroquia SET estatus='+estado+' WHERE codparroquia='+codparroquia ,(error, resultado, fields) => {
            next(error, resultado)
    })
}  

function get_nombre_parroquia(nombre, codmunicipio,next){
    UserModel.query("SELECT * FROM parroquia where nombre='"+nombre+"' AND codmunicipio="+codmunicipio ,(error, resultado, fields) => {
            next(error, resultado)
    }) 
}

function registrar_parroquia(nombre, codmunicipio, next){
    UserModel.query("INSERT INTO `parroquia`( `nombre`, `codmunicipio`, `estatus`) VALUES ('"+nombre+"',"+codmunicipio+",1)" ,(error, resultado, fields) => {
            next(error, resultado)
    }) 
}
   
function editar_parroquia(nombre,codmunicipio, codparroquia,next){
    UserModel.query("UPDATE parroquia SET nombre='"+nombre+"',codmunicipio="+codmunicipio+" WHERE codparroquia="+codparroquia ,(error, resultado, fields) => {
            next(error, resultado)
    }) 
}


module.exports = {
    get_parroquia,
    get_parroquia_por_id,
    editar_estatus_parroquia,
    get_nombre_parroquia,
    registrar_parroquia,
    editar_parroquia
}