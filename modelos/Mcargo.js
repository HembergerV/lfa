const UserModel = require('./conexion')

function get_cargo(next){
    UserModel.query(`SELECT * FROM cargo` ,(error, resultado, fields) => {
            next(error, resultado)
    })

  }  

function get_cargo_por_id(idcargo, next){
    UserModel.query('SELECT * FROM cargo WHERE idcargo='+idcargo ,(error, resultado, fields) => {
            next(error, resultado)
    })

  }  
function editar_estatus_cargo(idcargo, est, next){
    var estado;
    
    if(est == 1){
        estado = 0
    } else
        estado = 1;
    
    UserModel.query('UPDATE cargo SET estatus='+estado+' WHERE idcargo='+idcargo ,(error, resultado, fields) => {
            next(error, resultado)
    })
}  

function get_nombre_cargo(nombre,next){
    UserModel.query("SELECT * FROM cargo where nombre='"+nombre+"'" ,(error, resultado, fields) => {
            next(error, resultado)
    }) 
}

function registrar_cargo(nombre, descripcion, next){
    UserModel.query("INSERT INTO cargo( `nombre`, `descripcion`,`estatus`) VALUES ('"+nombre+"','"+descripcion+"',1)" ,(error, resultado, fields) => {
            next(error, resultado)
    }) 
}
   
function editar_cargo(nombre,descripcion,idcargo,next){
    UserModel.query("UPDATE cargo SET nombre='"+nombre+"', descripcion='"+descripcion+"' WHERE  idcargo="+idcargo ,(error, resultado, fields) => {
            next(error, resultado)
    }) 
}


module.exports = {
    get_cargo,
    editar_estatus_cargo,
    get_nombre_cargo,
    registrar_cargo,
    get_cargo_por_id,
    editar_cargo
}