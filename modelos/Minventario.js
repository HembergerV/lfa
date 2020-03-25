const UserModel = require('./conexion')

function get_inventario(next){
    UserModel.query(`SELECT t.monto, i.idinventario, i.cantidad, i.precio, r.idrepuesto, r.idsublinea, r.idmarca, r.minimo, r.numero_parte, r.referencia, r.descripcion, r.estatus, i.estatus AS estatus_inventario, s.nombre AS nombre_sublinea, l.nombre AS nombre_linea, m.nombre AS nombre_marca from inventario i  INNER JOIN repuesto r ON i.idrepuesto = r.idrepuesto INNER JOIN marca m ON r.idmarca = m.id INNER JOIN sublinea s ON r.idsublinea = s.idsublinea INNER JOIN linea l ON s.idlinea = l.idlinea INNER JOIN tasa t` ,(error, resultado, fields) => {
            next(error, resultado)
    })

  }


function get_repuesto_por_id(idrepuesto, next){
    UserModel.query('SELECT i.*, t.monto FROM inventario i INNER JOIN tasa t WHERE idrepuesto='+idrepuesto ,(error, resultado, fields) => {
            next(error, resultado)
    })

  }

function editar_inventario(estante,fila,columna,idrepuesto,cantidad,precio, next){
    UserModel.query("UPDATE inventario SET estante="+estante+",fila="+fila+",columna="+columna+",cantidad="+cantidad+",precio="+precio+" WHERE idrepuesto="+idrepuesto  ,(error, resultado, fields) => {
            next(error, resultado)
    })

  }
function editar_estatus_repuesto(idinventario, est, next){
    var estado;

    if(est == 1){
        estado = 0
    } else
        estado = 1;

    UserModel.query('UPDATE inventario SET estatus='+estado+' WHERE idinventario='+idinventario ,(error, resultado, fields) => {
            next(error, resultado)
    })
}

function get_cantidad(idrepuesto,next){
    UserModel.query("SELECT cantidad FROM inventario where idrepuesto="+idrepuesto,(error, resultado, fields) => {
            next(error, resultado)
    })
}

function cargar_inventario(idrepuesto,cantidad, precio, estante, fila, columna, next){
    UserModel.query("INSERT INTO `inventario`(`idrepuesto`, `cantidad`,`precio`,`estante`,`fila`,`columna`) VALUES ("+idrepuesto+","+cantidad+","+precio+","+estante+","+fila+","+columna+")" ,(error, resultado, fields) => {
            next(error, resultado)
    })
}

function sumar_inventario(idrepuesto,cantidad,stock,next){
    var unacantidad = eval(cantidad) + eval(stock);
    UserModel.query("UPDATE inventario SET cantidad="+unacantidad+" WHERE idrepuesto="+idrepuesto ,(error, resultado, fields) => {
            next(error, resultado)
    })
}

function get_tasa(next){
    UserModel.query(`select * from tasa` ,(error, resultado, fields) => {
            next(error, resultado)
    })

  }

function cambiar_tasa(tasa, next){
    UserModel.query("UPDATE tasa SET monto="+tasa+" WHERE 1" ,(error, resultado, fields) => {
            next(error, resultado,fields)
    })
}

function registrar_movimiento(concepto,idrepuesto,idusuario,fecha,cantidad,tipodocumento,nota, next){
    UserModel.query("INSERT INTO `movimiento`(`concepto`,`idrepuesto`, `idusuario`, `fecha`, `cantidad`, `tipomovimiento`, `nota`) VALUES ('"+concepto+"',"+idrepuesto+","+idusuario+",'"+fecha+"',"+cantidad+","+tipodocumento+",'"+nota+"')" ,(error, resultado, fields) => {
            next(error, resultado)
    })
}
function prov_repuesto(idproveedor,idrepuesto, cantidad, fecha,next){
    UserModel.query("INSERT INTO `prov_repuesto`(`idproveedor`, `idrepuesto`,`cantidad`,`fecha`) VALUES ("+idproveedor+","+idrepuesto+","+cantidad+",'"+fecha+"')" ,(error, resultado, fields) => {
            next(error, resultado)
    })
}

function get_movimiento_por_id(id,next){
    UserModel.query(`select m.*, u.usuario from movimiento m INNER JOIN usuario u ON u.idusuario = m.idusuario WHERE idrepuesto=`+id ,(error, resultado, fields) => {
            next(error, resultado)
    })

  }

module.exports = {
    get_inventario,
    get_repuesto_por_id,
    editar_estatus_repuesto,
    get_cantidad,
    cargar_inventario,
    sumar_inventario,
    editar_inventario,
    cambiar_tasa,
    get_tasa,
    registrar_movimiento,
    prov_repuesto,
    get_movimiento_por_id
}
