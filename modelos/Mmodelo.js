const UserModel = require('./conexion')

function get_modelo_vehiculo(id, next){
    UserModel.query(`SELECT * FROM modelo WHERE idmodelo=`+id ,(error, resultado, fields) => {
            next(error, resultado)
    })
}

function get_ordenesvehiculo(id, next){
    UserModel.query(`SELECT o.*,c.direccion, c.nombre AS nombre_cliente, c.telefono AS tlf_cliente FROM ordenvehiculo o INNER JOIN cliente c ON c.idcliente = o.idcliente WHERE o.idmodelo=`+id ,(error, resultado, fields) => {
            next(error, resultado)
    })
}

function get_placa_cliente(placa, next){
    UserModel.query(`SELECT * FROM ordenvehiculo WHERE placa="`+placa+`"` ,(error, resultado, fields) => {
            next(error, resultado)
    })
}

function registrar_ordenvehiculo(idcliente,idmodelo,modelo,motivo,anio,color,placa,bateria,fecha, next){
    UserModel.query("INSERT INTO `ordenvehiculo`( `idcliente`, `idmodelo`, `motivo`, `modelo`, `anio`, `color`, `placa`, `bateria`,`fecha`) VALUES ("+idcliente+", "+idmodelo+", '"+motivo+"', '"+modelo+"', '"+anio+"', '"+color+"', '"+placa+"', '"+bateria+"','"+fecha+"')" ,(error, resultado, fields) => {
            next(error, resultado)
    })
}

function editar_ordenvehiculo(idcliente,idmodelo,modelo,motivo,anio,color,placa,bateria,idordenvehiculo,next){
    UserModel.query("UPDATE ordenvehiculo SET idcliente="+idcliente+", idmodelo="+idmodelo+", modelo='"+modelo+"', motivo='"+motivo+"', anio='"+anio+"', color='"+color+"', placa='"+placa+"', bateria='"+bateria+"' WHERE  idordenvehiculo="+idordenvehiculo ,(error, resultado, fields) => {
            next(error, resultado)
    })
}

function editar_estatus_orden(idorden, est, next){
    var estado;

    if(est == 1){
        estado = 0
    } else
        estado = 1;

    UserModel.query('UPDATE ordenvehiculo SET estatus='+estado+' WHERE idordenvehiculo='+idorden ,(error, resultado, fields) => {
            next(error, resultado)
    })
}

function editar_estatusdeuda_orden(fecha, idorden, est, next){
    var estado;

    if(est == 1){
        estado = 0
    } else
        estado = 1;

    UserModel.query('UPDATE ordenvehiculo SET fechacobro="'+fecha+'", deuda='+estado+' WHERE idordenvehiculo='+idorden ,(error, resultado, fields) => {
            next(error, resultado)
    })
}

function get_orden_por_id(idorden, next){
    UserModel.query('SELECT o.*, c.* FROM ordenvehiculo o INNER JOIN cliente c ON c.idcliente = o.idcliente WHERE idordenvehiculo='+idorden ,(error, resultado, fields) => {
            next(error, resultado)
    })

}

function get_repuestos_orden(idorden, next){
    UserModel.query('SELECT m.*, v.marca, c.nombre AS nombre_cliente, c.telefono, l.*, r.descripcion, r.numero_parte,r.referencia, i.precio FROM ordenvehiculodetalles l INNER JOIN inventario i ON i.idinventario = l.idinventario INNER JOIN repuesto r ON r.idrepuesto = i.idrepuesto INNER JOIN ordenvehiculo m ON m.idordenvehiculo = l.idordenvehiculo INNER JOIN cliente c ON c.idcliente = m.idcliente INNER JOIN modelo v ON v.idmodelo = m.idmodelo WHERE m.idordenvehiculo='+idorden ,(error, resultado, fields) => {
            next(error, resultado)
    })

}

function get_repuestos_orden_only(idorden, next){
    UserModel.query('SELECT o.*, i.precio, r.* FROM `ordenvehiculodetalles` o  INNER JOIN inventario i ON i.idinventario = o.idinventario INNER JOIN repuesto r ON r.idrepuesto = i.idrepuesto  where o.idordenvehiculo ='+idorden ,(error, resultado, fields) => {
            next(error, resultado)
    })

}
function get_detalle_orden(idorden,idinventario,next){
    UserModel.query("SELECT * FROM ordenvehiculodetalles WHERE idordenvehiculo="+idorden+" AND idinventario="+idinventario ,(error, resultado, fields) => {
            next(error, resultado)
    })
}

function registrar_detalle(idorden, idinventario,cantidad, next){
    UserModel.query("INSERT INTO `ordenvehiculodetalles`(`idinventario`, `idordenvehiculo`, `cantidad`) VALUES ("+idinventario+","+idorden+","+cantidad+")" ,(error, resultado, fields) => {
            next(error, resultado)
    })
}

function registrar_manoObra(idorden, descripcion,precio, next){
    UserModel.query("INSERT INTO `manoobra`(`idordenvehiculo`, `descripcion`,`precio`) VALUES ("+idorden+",'"+descripcion+"','"+precio+"')" ,(error, resultado, fields) => {
            next(error, resultado)
    })
}

function editar_estatus_detalle(iddetalle, est, next){
    var estado;

    if(est == 1){
        estado = 0
    } else
        estado = 1;

    UserModel.query('UPDATE ordenvehiculodetalles SET estatus='+estado+' WHERE id='+iddetalle,(error, resultado, fields) => {
            next(error, resultado)
    })
}

function editar_cantidad_detalle(iddetalle,cantidad,next){
    UserModel.query("UPDATE ordenvehiculodetalles SET cantidad="+cantidad+" WHERE id="+iddetalle ,(error, resultado, fields) => {
            next(error, resultado)
    })
}

function editar_precio_manoObra(iddetalle,precio,next){
    UserModel.query("UPDATE manoobra SET precio='"+precio+"' WHERE id="+iddetalle ,(error, resultado, fields) => {
            next(error, resultado)
    })
}

function get_manoObra_orden(idorden, next){
    UserModel.query('SELECT m.* from manoobra m WHERE m.idordenvehiculo='+idorden ,(error, resultado, fields) => {
            next(error, resultado)
    })

}

function get_vehiculo_recibido(fechadesde,  fechahasta, next){
    UserModel.query("SELECT o.*,c.nombre,c.telefono FROM ordenvehiculo o inner join cliente c on c.idcliente = o.idcliente WHERE o.fecha > '"+fechadesde+"' AND o.fecha < '"+fechahasta+"'" ,(error, resultado, fields) => {
            next(error, resultado)
    })

}

function get_vehiculo_facturado(fechadesde,  fechahasta, next){
    UserModel.query("SELECT o.*,c.nombre,c.telefono FROM ordenvehiculo o inner join cliente c on c.idcliente = o.idcliente WHERE o.fechacobro > '"+fechadesde+"' AND o.fechacobro < '"+fechahasta+"' AND o.deuda = 0" ,(error, resultado, fields) => {
            next(error, resultado)
    })

}

module.exports = {
    get_modelo_vehiculo,
    get_ordenesvehiculo,
    get_placa_cliente,
    registrar_ordenvehiculo,
    editar_ordenvehiculo,
    editar_estatus_orden,
    get_orden_por_id,
    get_repuestos_orden,
    get_detalle_orden,
    registrar_detalle,
    editar_estatus_detalle,
    get_repuestos_orden_only,
    get_manoObra_orden,
    editar_cantidad_detalle,
    editar_precio_manoObra,
    registrar_manoObra,
    editar_estatusdeuda_orden,
    get_vehiculo_recibido,
    get_vehiculo_facturado

}
