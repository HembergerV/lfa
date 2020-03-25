const UserModel = require('./conexion')

function get_estatus(next){
    UserModel.query(`SELECT * FROM estatus` ,(error, resultado, fields) => {
            next(error, resultado)
    })

  }  

function get_estatus_por_id(idestatus, next){
    UserModel.query('SELECT * FROM estatus WHERE idestatus='+idestatus ,(error, resultado, fields) => {
            next(error, resultado)
    })

  }  
function editar_estatus_estatus(idestatus, est, next){
    var estado;
    
    if(est == 1){
        estado = 0
    } else
        estado = 1;
    
    UserModel.query('UPDATE estatus SET estatus='+estado+' WHERE idestatus='+idestatus ,(error, resultado, fields) => {
            next(error, resultado)
    })
}  

function get_nombre_estatus(nombre,next){
    UserModel.query("SELECT * FROM estatus where nombre='"+nombre+"'" ,(error, resultado, fields) => {
            next(error, resultado)
    }) 
}

function registrar_estatus(codestatus, nombre, descripcion, next){
    UserModel.query("INSERT INTO estatus (codestatus,nombre,descripcion,estatus) values("+codestatus+",'"+nombre+"','"+descripcion+"',1)" ,(error, resultado, fields) => {
            next(error, resultado)
    }) 
}
   
function editar_estatus(codestatus,nombre,descripcion,idestatus,next){
    UserModel.query("update estatus set codestatus="+codestatus+", nombre='"+nombre+"', descripcion='"+descripcion+"' where  idestatus="+ idestatus,(error, resultado, fields) => {
            next(error, resultado)
    }) 
}


module.exports = {
    get_estatus,
    editar_estatus_estatus,
    get_nombre_estatus,
    registrar_estatus,
    get_estatus_por_id,
    editar_estatus
}