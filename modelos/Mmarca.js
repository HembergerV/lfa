const UserModel = require('./conexion')

function get_marca(next){
    UserModel.query(`SELECT * FROM marca` ,(error, resultado, fields) => {
            next(error, resultado)
    })

  }  
function get_marca_estatus(estatus,next){
    if(estatus == 2){
        UserModel.query(`SELECT * FROM marca` ,(error, resultado, fields) => {
            next(error, resultado)
        })
    } else{
        UserModel.query(`SELECT * FROM marca WHERE estatus=`+estatus ,(error, resultado, fields) => {
                next(error, resultado)
        })
    }
  }  
function get_marca_por_id(idmarca, next){
    UserModel.query('SELECT * FROM marca WHERE id='+idmarca ,(error, resultado, fields) => {
            next(error, resultado)
    })

  }  
function editar_estatus_marca(idmarca, est, next){
    var estado;
    
    if(est == 1){
        estado = 0
    } else
        estado = 1;
    
    UserModel.query('UPDATE marca SET estatus='+estado+' WHERE id='+idmarca ,(error, resultado, fields) => {
            next(error, resultado)
    })
}  

function get_nombre_marca(nombre,next){
    UserModel.query("SELECT * FROM marca where nombre='"+nombre+"'" ,(error, resultado, fields) => {
            next(error, resultado)
    }) 
}

function registrar_marca(nombre, descripcion, next){
    UserModel.query("INSERT INTO marca( `nombre`, `descripcion`,`estatus`) VALUES ('"+nombre+"','"+descripcion+"',1)" ,(error, resultado, fields) => {
            next(error, resultado)
    }) 
}
   
function editar_marca(nombre,descripcion,idmarca,next){
    UserModel.query("UPDATE marca SET nombre='"+nombre+"', descripcion='"+descripcion+"' WHERE  id="+idmarca ,(error, resultado, fields) => {
            next(error, resultado)
    }) 
}


module.exports = {
    get_marca,
    editar_estatus_marca,
    get_nombre_marca,
    registrar_marca,
    get_marca_por_id,
    editar_marca,
    get_marca_estatus
}