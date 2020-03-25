const UserModel = require('./conexion')

function get_sector(next){
    UserModel.query(`SELECT 
              s.*
              ,pr.nombre AS nombre_parroquia
              ,m.nombre AS nombre_municipio
              ,e.nombre AS nombre_estado
              ,p.nombre AS nombre_pais
              ,p.codpais
              ,e.codestado
              ,m.codmunicipio
              ,pr.codparroquia
              ,s.codsector
              FROM sector s
              INNER JOIN parroquia pr ON s.codparroquia = pr.codparroquia
              INNER JOIN municipio m ON pr.codmunicipio = m.codmunicipio
              INNER JOIN estado e ON m.codestado = e.codestado
              INNER JOIN pais p   ON e.codpais   = p.codpais` ,(error, resultado, fields) => {
            next(error, resultado)
    })

  }  

function get_sector_por_id(codsector, next){
    UserModel.query(`SELECT 
              s.*
              ,pr.nombre AS nombre_parroquia
              ,m.nombre AS nombre_municipio
              ,e.nombre AS nombre_estado
              ,p.nombre AS nombre_pais
              ,p.codpais
              ,e.codestado
              ,m.codmunicipio
              ,pr.codparroquia
              ,s.codsector
              FROM sector s
              INNER JOIN parroquia pr ON s.codparroquia = pr.codparroquia
              INNER JOIN municipio m ON pr.codmunicipio = m.codmunicipio
              INNER JOIN estado e ON m.codestado = e.codestado
              INNER JOIN pais p   ON e.codpais   = p.codpais
              WHERE s.codsector=`+ codsector,(error, resultado, fields) => {
            next(error, resultado)
    })

  }  
function editar_estatus_sector(codsector, est, next){
    var estado;
    
    if(est == 1){
        estado = 0
    } else
        estado = 1;
    
    UserModel.query('UPDATE sector SET estatus='+estado+' WHERE codsector='+codsector ,(error, resultado, fields) => {
            next(error, resultado)
    })
}  

function get_nombre_sector(nombre, codparroquia,next){
    UserModel.query("SELECT * FROM sector where nombre='"+nombre+"' AND codparroquia="+codparroquia ,(error, resultado, fields) => {
            next(error, resultado)
    }) 
}

function registrar_sector(nombre, codparroquia, next){
    UserModel.query("INSERT INTO `sector`( `nombre`, `codparroquia`, `estatus`) VALUES ('"+nombre+"',"+codparroquia+",1)" ,(error, resultado, fields) => {
            next(error, resultado)
    }) 
}
   
function editar_sector(nombre,codparroquia, codsector,next){
    UserModel.query("UPDATE sector SET nombre='"+nombre+"',codparroquia="+codparroquia+" WHERE codsector="+codsector ,(error, resultado, fields) => {
            next(error, resultado)
    }) 
}


module.exports = {
    get_sector,
    get_sector_por_id,
    editar_estatus_sector,
    get_nombre_sector,
    registrar_sector,
    editar_sector
}