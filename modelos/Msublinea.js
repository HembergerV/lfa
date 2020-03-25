const UserModel = require('./conexion')

function get_sublinea(next){
    UserModel.query(`SELECT s.* , l.nombre AS nombre_linea, l.idlinea FROM sublinea s INNER JOIN linea l ON s.idlinea = l.idlinea` ,(error, resultado, fields) => {
            next(error, resultado)
    })

  }  

function get_sublinea_estatus(estatus, next){
    if(estatus == 2){
        UserModel.query(`SELECT s.* , l.nombre AS nombre_linea FROM sublinea s INNER JOIN linea l ON s.idlinea = l.idlinea` ,(error, resultado, fields) => {
            next(error, resultado)
        })
    } else{
        UserModel.query(`SELECT s.* , l.nombre AS nombre_linea FROM sublinea s INNER JOIN linea l ON s.idlinea = l.idlinea WHERE s.estatus=`+estatus ,(error, resultado, fields) => {
                next(error, resultado)
        })
    }
  } 

function get_sublinea_por_id(idsublinea, next){
    UserModel.query('SELECT s.* ,l.nombre AS nombre_linea, l.idlinea AS idlinea, l.descripcion AS descripcion_linea FROM sublinea s INNER JOIN linea l ON s.idlinea = l.idlinea WHERE s.idsublinea='+idsublinea ,(error, resultado, fields) => {
            next(error, resultado)
    })

  }  
function editar_estatus_sublinea(idsublinea, est, next){
    var estado;
    
    if(est == 1){
        estado = 0
    } else
        estado = 1;
    
    UserModel.query('UPDATE sublinea SET estatus='+estado+' WHERE idsublinea='+idsublinea ,(error, resultado, fields) => {
            next(error, resultado)
    })
}  

function get_nombre_sublinea(nombre, idlinea,next){
    UserModel.query("SELECT * FROM sublinea where nombre='"+nombre+"' AND idlinea="+idlinea ,(error, resultado, fields) => {
            next(error, resultado)
    }) 
}

function registrar_sublinea(nombre,descripcion, idlinea, next){
    UserModel.query("INSERT INTO `sublinea`( `nombre`, `descripcion`, `idlinea`, `estatus`) VALUES ('"+nombre+"','"+descripcion+"',"+idlinea+",1)" ,(error, resultado, fields) => {
            next(error, resultado)
    }) 
}
   
function editar_sublinea(nombre,descripcion,idlinea, idsublinea,next){
    UserModel.query("UPDATE sublinea SET nombre='"+nombre+"',descripcion='"+descripcion+"',idlinea="+idlinea+" WHERE idsublinea="+idsublinea ,(error, resultado, fields) => {
            next(error, resultado)
    }) 
}


module.exports = {
    get_sublinea,
    get_sublinea_por_id,
    editar_estatus_sublinea,
    get_nombre_sublinea,
    registrar_sublinea,
    editar_sublinea,
    get_sublinea_estatus
}