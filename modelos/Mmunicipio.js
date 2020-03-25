const UserModel = require('./conexion')

function get_municipio(next){
    UserModel.query("SELECT m.* ,e.nombre AS nombre_estado,p.nombre AS nombre_pais,p.codpais FROM municipio m INNER JOIN estado e ON m.codestado = e.codestado INNER JOIN pais p  ON e.codpais = p.codpais" ,(error, resultado, fields) => {
            next(error, resultado)
    })

  }  

function get_municipio_por_id(codmunicipio, next){
    UserModel.query('SELECT m.* ,e.nombre AS nombre_estado,p.nombre AS nombre_pais,p.codpais FROM municipio m INNER JOIN estado e ON m.codestado = e.codestado INNER JOIN pais p ON e.codpais = p.codpais  WHERE m.codmunicipio='+codmunicipio ,(error, resultado, fields) => {
            next(error, resultado)
    })

  }  
function editar_estatus_municipio(codmunicipio, est, next){
    var municipio;
    
    if(est == 1){
        municipio = 0
    } else
        municipio = 1;
    
    UserModel.query('UPDATE municipio SET estatus='+municipio+' WHERE codmunicipio='+codmunicipio ,(error, resultado, fields) => {
            next(error, resultado)
    })
}  

function get_nombre_municipio(nombre, codestado,next){
    UserModel.query("SELECT * FROM municipio where nombre='"+nombre+"' AND codestado="+codestado ,(error, resultado, fields) => {
            next(error, resultado)
    }) 
}

function registrar_municipio(nombre, codestado, next){
    UserModel.query("INSERT INTO `municipio`( `nombre`, `codestado`, `estatus`) VALUES ('"+nombre+"',"+codestado+",1)" ,(error, resultado, fields) => {
            next(error, resultado)
    }) 
}
   
function editar_municipio(nombre,codestado, codmunicipio,next){
    UserModel.query("UPDATE municipio SET nombre='"+nombre+"',codestado="+codestado+" WHERE codmunicipio="+codmunicipio ,(error, resultado, fields) => {
            next(error, resultado)
    }) 
}


module.exports = {
    get_municipio,
    get_municipio_por_id,
    editar_estatus_municipio,
    get_nombre_municipio,
    registrar_municipio,
    editar_municipio
}