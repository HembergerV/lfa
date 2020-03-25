const UserModel = require('./conexion')

function get_dpto(next){
    UserModel.query(`SELECT * FROM dpto` ,(error, resultado, fields) => {
            next(error, resultado)
    })

  }

function get_dpto_por_id(iddpto, next){
    UserModel.query('SELECT * FROM dpto WHERE id='+iddpto ,(error, resultado, fields) => {
            next(error, resultado)
    })

  }
function editar_estatus_dpto(iddpto, est, next){
    var estado;

    if(est == 1){
        estado = 0
    } else
        estado = 1;

    UserModel.query('UPDATE dpto SET estatus='+estado+' WHERE id='+iddpto ,(error, resultado, fields) => {
            next(error, resultado)
    })
}

function get_nombre_dpto(nombre,coddpto,next){
    if(coddpto && !nombre){
      UserModel.query("SELECT * FROM dpto where coddpto="+coddpto ,(error, resultado, fields) => {
              next(error, resultado)
      })
    }

    if(nombre && !coddpto){
      UserModel.query("SELECT * FROM dpto where nombre='"+nombre+"'" ,(error, resultado, fields) => {
              next(error, resultado)
      })
    }
    if(nombre && coddpto){
      UserModel.query("SELECT * FROM dpto where nombre='"+nombre+"' OR coddpto="+coddpto ,(error, resultado, fields) => {
              next(error, resultado)
      })
    }

}

function registrar_dpto(nombre, coddpto,next){
    UserModel.query("INSERT INTO dpto( `nombre`, `coddpto`,`estatus`) VALUES ('"+nombre+"',"+coddpto+",1)" ,(error, resultado, fields) => {
            next(error, resultado)
    })
}

function editar_dpto(nombre,coddpto, iddpto,next){
    UserModel.query("UPDATE dpto SET nombre='"+nombre+"', coddpto="+coddpto+" WHERE id="+iddpto ,(error, resultado, fields) => {
            next(error, resultado)
    })
}


module.exports = {
    get_dpto,
    editar_estatus_dpto,
    get_nombre_dpto,
    registrar_dpto,
    get_dpto_por_id,
    editar_dpto
}
