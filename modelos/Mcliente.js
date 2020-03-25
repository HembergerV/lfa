const UserModel = require('./conexion')

function get_cliente(next){
    UserModel.query(`SELECT c.direccion, c.idcliente, c.nombre, c.rif, r.abreviatura AS abreviatura, c.tiporif, c.email, c.telefono,c.estatus FROM cliente c INNER JOIN rif r ON c.tiporif = r.id` ,(error, resultado, fields) => {
            next(error, resultado)
    })

  }
function editar_estatus_cliente(idcliente, est, next){
    var estado;

    if(est == 1){
        estado = 0
    } else
        estado = 1;

    UserModel.query('UPDATE cliente SET estatus='+estado+' WHERE idcliente='+idcliente ,(error, resultado, fields) => {
            next(error, resultado)
    })
}

function get_rif_cliente(rif,next){
    UserModel.query("SELECT * FROM cliente where rif='"+rif+"'" ,(error, resultado, fields) => {
            next(error, resultado)
    })
}

function registrar_cliente(tiporif,rif,nombre,direccion,email,telefono, next){
    UserModel.query("INSERT INTO `cliente`(`tiporif`, `rif`, `nombre`,`direccion`, `email`, `telefono`) VALUES ("+tiporif+",'"+rif+"','"+nombre+"','"+direccion+"','"+email+"','"+telefono+"')" ,(error, resultado, fields) => {
            next(error, resultado)
    })
}
function editar_cliente(tiporif,rif,nombre,direccion,email,telefono,idcliente,next){
    UserModel.query("UPDATE cliente SET tiporif="+tiporif+",rif='"+rif+"',nombre='"+nombre+"',email='"+email+"',telefono='"+telefono+"',direccion='"+direccion+"' WHERE idcliente="+idcliente  ,(error, resultado, fields) => {
            next(error, resultado)
    })
}
function get_cliente_por_id(idcliente, next){
    UserModel.query('SELECT c.*, r.abreviatura FROM cliente c INNER JOIN rif r ON r.id = c.tiporif WHERE c.idcliente='+idcliente ,(error, resultado, fields) => {
            next(error, resultado)
    })

  }

module.exports = {
    get_cliente,
    editar_estatus_cliente,
    registrar_cliente,
    get_rif_cliente,
    editar_cliente,
    editar_estatus_cliente,
    get_cliente_por_id
}
