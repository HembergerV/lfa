const UserModel = require('./conexion')

function get_nacionalidad(next){
    UserModel.query(`SELECT * FROM nacionalidad` ,(error, resultado, fields) => {
            next(error, resultado)
    })

  }  

function get_nacionalidad_por_id(idnacionalidad, next){
    UserModel.query('SELECT * FROM nacionalidad WHERE id='+idnacionalidad ,(error, resultado, fields) => {
            next(error, resultado)
    })

  }  
function editar_estatus_nacionalidad(idnacionalidad, est, next){
    var estado;
    
    if(est == 1){
        estado = 0
    } else
        estado = 1;
    
    UserModel.query('UPDATE nacionalidad SET estatus='+estado+' WHERE id='+idnacionalidad ,(error, resultado, fields) => {
            next(error, resultado)
    })
}  

function get_abreviatura_nacionalidad(abreviatura,nombre,next){
    UserModel.query("SELECT * FROM nacionalidad where abreviatura='"+abreviatura+"' OR nombre='"+nombre+"'" ,(error, resultado, fields) => {
            next(error, resultado)
    }) 
}

function get_abreviatura_nacionalidad_EDIT(abreviatura,nombre,next){
    UserModel.query("SELECT * FROM nacionalidad where nombre='"+nombre+"'" ,(error, resultado, fields) => {
            next(error, resultado)
    }) 
}

function registrar_nacionalidad(nombre, abreviatura, next){
    UserModel.query("INSERT INTO nacionalidad( `nombre`, `abreviatura`,`estatus`) VALUES ('"+nombre+"','"+abreviatura+"',1)" ,(error, resultado, fields) => {
            next(error, resultado)
    }) 
}
   
function editar_nacionalidad(nombre,abreviatura,idnacionalidad,next){
    UserModel.query("UPDATE nacionalidad SET nombre='"+nombre+"', abreviatura='"+abreviatura+"' WHERE  id="+idnacionalidad ,(error, resultado, fields) => {
            next(error, resultado)
    }) 
}


module.exports = {
    get_nacionalidad,
    editar_estatus_nacionalidad,
    get_abreviatura_nacionalidad,
    registrar_nacionalidad,
    get_nacionalidad_por_id,
    get_abreviatura_nacionalidad_EDIT,
    editar_nacionalidad
}