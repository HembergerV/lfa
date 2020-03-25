const UserModel = require('./conexion')

function get_pedido(next){
    UserModel.query(`SELECT u.usuario, u.idusuario, t.iddocumento, t.nombre AS nombre_documento, p.fechacreacion, p.codpedido , e.nombre AS nombre_estatus,n.abreviatura FROM pedido p INNER JOIN usuario u ON u.idusuario = p.idusuario INNER JOIN tipodocumento t ON t.iddocumento = p.iddocumento INNER JOIN estatus e on e.idestatus = p.idestatus INNER JOIN nacionalidad n ON n.id = u.nacionalidad` ,(error, resultado, fields) => {
            next(error, resultado)
    })

  }  


function crearPedido(id,iddocumento, observacion, fecha, next){
    UserModel.query("INSERT INTO `pedido`( `idusuario`, `iddocumento`,`descripcion`,`fechacreacion`) VALUES ("+id+","+iddocumento+",'"+observacion+"','"+fecha+"')" ,(error, resultado, fields) => {
            next(error, resultado,fields)
    }) 
}
   

function get_pedido_por_id(id, next){
    UserModel.query('SELECT p.idrepuesto, r.descripcion AS nombre_repuesto, p.idpedido, p.cantidad, p.preciounitario, p.fechaprocesada,n.abreviatura FROM pedido_repuesto p INNER JOIN repuesto r ON p.idrepuesto = r.idrepuesto INNER JOIN pedido pe on pe.codpedido = p.idpedido INNER JOIN usuario u ON pe.idusuario = u.idusuario  INNER JOIN nacionalidad n ON n.id = u.nacionalidad WHERE p.idpedido ='+id ,(error, resultado, fields) => {
            next(error, resultado)
    })
}  



module.exports = {
    get_pedido,
    crearPedido,
    get_pedido_por_id,
}