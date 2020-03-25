const UserModel = require('./conexion')

function get_lista(next){
    UserModel.query(`SELECT * FROM lista` ,(error, resultado, fields) => {
            next(error, resultado)
    })
}

function get_lista_por_id(idlista, next){
    UserModel.query('SELECT * FROM lista WHERE idlista='+idlista ,(error, resultado, fields) => {
            next(error, resultado)
    })

}

function get_nombre_lista(nombre,next){
    UserModel.query("SELECT * FROM lista where nombre='"+nombre+"'" ,(error, resultado, fields) => {
            next(error, resultado)
    })
}

function registrar_lista(nombre, descripcion, next){
    UserModel.query("INSERT INTO lista( `nombre`, `descripcion`,`estatus`) VALUES ('"+nombre+"','"+descripcion+"',1)" ,(error, resultado, fields) => {
            next(error, resultado)
    })
}

function editar_lista(nombre,descripcion,idlista,next){
    UserModel.query("UPDATE lista SET nombre='"+nombre+"', descripcion='"+descripcion+"' WHERE  idlista="+idlista ,(error, resultado, fields) => {
            next(error, resultado)
    })
}

function editar_estatus_lista(idlista, est, next){
    var estado;

    if(est == 1){
        estado = 0
    } else
        estado = 1;

    UserModel.query('UPDATE lista SET estatus='+estado+' WHERE idlista='+idlista ,(error, resultado, fields) => {
            next(error, resultado)
    })
}

function get_repuestos_lista(idlista,next){
    UserModel.query("SELECT m.nombre, m.descripcion AS descripcion_lista, l.*, r.descripcion, r.numero_parte,r.referencia, i.precio FROM listadetalles l INNER JOIN inventario i ON i.idinventario = l.idinventario INNER JOIN repuesto r ON r.idrepuesto = i.idrepuesto INNER JOIN lista m ON m.idlista = l.idlista WHERE m.idlista="+idlista ,(error, resultado, fields) => {
            next(error, resultado)
    })
}


function get_detalle_lista(idlista,idinventario,next){
    UserModel.query("SELECT * FROM listadetalles WHERE idlista="+idlista+" AND idinventario="+idinventario ,(error, resultado, fields) => {
            next(error, resultado)
    })
}

function registrar_detalle(idlista, idinventario,cantidad, next){
    UserModel.query("INSERT INTO `listadetalles`(`idinventario`, `idlista`, `cantidad`) VALUES ("+idinventario+","+idlista+","+cantidad+")" ,(error, resultado, fields) => {
            next(error, resultado)
    })
}

function editar_estatus_detalle(iddetalle, est, next){
    var estado;

    if(est == 1){
        estado = 0
    } else
        estado = 1;

    UserModel.query('UPDATE listadetalles SET estatus='+estado+' WHERE id='+iddetalle,(error, resultado, fields) => {
            next(error, resultado)
    })
}

function editar_cantidad_detalle(iddetalle,cantidad,next){
    UserModel.query("UPDATE listadetalles SET cantidad="+cantidad+" WHERE id="+iddetalle ,(error, resultado, fields) => {
            next(error, resultado)
    })
}


module.exports = {
    get_lista,
    get_lista_por_id,
    get_nombre_lista,
    registrar_lista,
    editar_lista,
    editar_estatus_lista,
    get_repuestos_lista,
    get_detalle_lista,
    registrar_detalle,
    editar_estatus_detalle,
    editar_cantidad_detalle
}
