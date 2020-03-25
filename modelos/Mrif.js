const UserModel = require('./conexion')

function get_rif(next){
    UserModel.query(`SELECT * FROM rif` ,(error, resultado, fields) => {
            next(error, resultado)
    })

  }  

function get_rif_por_id(idrif, next){
    UserModel.query('SELECT * FROM rif WHERE id='+idrif ,(error, resultado, fields) => {
            next(error, resultado)
    })

  }  
function editar_estatus_rif(idrif, est, next){
    var estado;
    
    if(est == 1){
        estado = 0
    } else
        estado = 1;
    
    UserModel.query('UPDATE rif SET estatus='+estado+' WHERE id='+idrif ,(error, resultado, fields) => {
            next(error, resultado)
    })
}  

function get_abreviatura_rif(nombre, abreviatura,next){
    UserModel.query("SELECT * FROM rif where nombre='"+nombre+"' OR abreviatura='"+abreviatura+"'" ,(error, resultado, fields) => {
            next(error, resultado)
    }) 
}
function get_abreviatura_rif_EDIT(nombre,next){
    UserModel.query("SELECT * FROM rif where nombre='"+nombre+"'" ,(error, resultado, fields) => {
            next(error, resultado)
    }) 
}
function registrar_rif(nombre, abreviatura, next){
    UserModel.query("INSERT INTO rif( `nombre`, `abreviatura`,`estatus`) VALUES ('"+nombre+"','"+abreviatura+"',1)" ,(error, resultado, fields) => {
            next(error, resultado)
    }) 
}
   
function editar_rif(nombre,abreviatura,idrif,next){
    UserModel.query("UPDATE rif SET nombre='"+nombre+"', abreviatura='"+abreviatura+"' WHERE  id="+idrif ,(error, resultado, fields) => {
            next(error, resultado)
    }) 
}


module.exports = {
    get_rif,
    editar_estatus_rif,
    get_abreviatura_rif,
    get_abreviatura_rif_EDIT,
    registrar_rif,
    get_rif_por_id,
    editar_rif
}