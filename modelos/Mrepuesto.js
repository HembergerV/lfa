const UserModel = require('./conexion')

function get_repuesto(next){
    UserModel.query(`SELECT r.idrepuesto, r.idsublinea, r.idmarca, r.minimo, r.numero_parte,r.numero_parte_secundario, r.referencia, r.descripcion, r.estatus, s.nombre AS nombre_sublinea, l.nombre AS nombre_linea, m.nombre AS nombre_marca from repuesto r INNER JOIN marca m ON r.idmarca = m.id INNER JOIN sublinea s ON r.idsublinea = s.idsublinea INNER JOIN linea l ON s.idlinea = l.idlinea` ,(error, resultado, fields) => {
            next(error, resultado)
    })

  }

function get_repuesto_por_referencia(referencia,numero_parte, next){
    UserModel.query("SELECT * FROM repuesto WHERE referencia='"+referencia+"'" ,(error, resultado, fields) => {
            next(error, resultado)
    })

  }

function get_repuesto_por_id(idrepuesto, next){
    UserModel.query('SELECT r.idrepuesto, r.idsublinea, r.idmarca, r.minimo, r.numero_parte, r.numero_parte_secundario,r.referencia, r.descripcion, r.estatus, s.idsublinea,s.nombre AS nombre_sublinea,l.idlinea ,l.nombre AS nombre_linea, m.nombre AS nombre_marca from repuesto r INNER JOIN marca m ON r.idmarca = m.id INNER JOIN sublinea s ON r.idsublinea = s.idsublinea INNER JOIN linea l ON s.idlinea = l.idlinea WHERE idrepuesto='+idrepuesto ,(error, resultado, fields) => {
            next(error, resultado)
    })

  }
  function get_repuestoUbicacion_por_id(idrepuesto, next){
      UserModel.query('SELECT i.estante, i.fila, i.columna, r.idrepuesto, r.idsublinea, r.idmarca, r.minimo, r.numero_parte, r.numero_parte_secundario,r.referencia, r.descripcion, r.estatus, s.idsublinea,s.nombre AS nombre_sublinea,l.idlinea ,l.nombre AS nombre_linea, m.nombre AS nombre_marca from repuesto r INNER JOIN marca m ON r.idmarca = m.id INNER JOIN sublinea s ON r.idsublinea = s.idsublinea INNER JOIN linea l ON s.idlinea = l.idlinea inner join inventario i on i.idrepuesto = r.idrepuesto WHERE i.idrepuesto='+idrepuesto ,(error, resultado, fields) => {
              next(error, resultado)
      })

    }
function editar_estatus_repuesto(idrepuesto, est, next){
    var estado;

    if(est == 1){
        estado = 0
    } else
        estado = 1;

    UserModel.query('UPDATE repuesto SET estatus='+estado+' WHERE idrepuesto='+idrepuesto ,(error, resultado, fields) => {
            next(error, resultado)
    })
}

function get_nombre_repuesto(nombre, codpais,next){
    UserModel.query("SELECT * FROM estado where nombre='"+nombre+"' AND codpais="+codpais ,(error, resultado, fields) => {
            next(error, resultado)
    })
}

function registrar_repuesto(idsublinea,idmarca,minimo,numero_parte,numero_parte_secundario,referencia, descripcion, next){
    UserModel.query("INSERT INTO `repuesto`( `idsublinea`, `idmarca`, `minimo`, `numero_parte`, `numero_parte_secundario`, `referencia`, `descripcion`) VALUES ("+idsublinea+","+idmarca+","+minimo+",'"+numero_parte+"','"+numero_parte_secundario+"','"+referencia+"','"+descripcion+"')" ,(error, resultado, fields) => {
            next(error, resultado)
    })
}

function editar_repuesto(idsublinea,idmarca,minimo,numero_parte,numero_parte_secundario,referencia, descripcion, idrepuesto,next){
    UserModel.query("UPDATE repuesto SET idsublinea="+idsublinea+",idmarca="+idmarca+",minimo="+minimo+",numero_parte='"+numero_parte+"',numero_parte_secundario='"+numero_parte_secundario+"',referencia='"+referencia+"',descripcion='"+descripcion+"' WHERE idrepuesto="+idrepuesto ,(error, resultado, fields) => {
            next(error, resultado)
    })
}


module.exports = {
    get_repuesto,
    get_repuesto_por_referencia,
    editar_estatus_repuesto,
    get_nombre_repuesto,
    registrar_repuesto,
    editar_repuesto,
    get_repuesto_por_id,
    get_repuestoUbicacion_por_id
}
