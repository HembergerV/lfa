const UserModel = require('./conexion')

function get_proveedor(next){
    UserModel.query(`SELECT p.idproveedor, p.nombre, p.rif, r.abreviatura AS abreviatura, p.tiporif, p.email, p.telefono,p.estatus FROM proveedor p INNER JOIN rif r ON p.tiporif = r.id` ,(error, resultado, fields) => {
            next(error, resultado)
    })

  }

function get_proveedor_por_id(idproveedor, next){
    UserModel.query('SELECT * FROM proveedor WHERE idproveedor='+idproveedor ,(error, resultado, fields) => {
            next(error, resultado)
    })

  }
function editar_estatus_proveedor(idproveedor, est, next){
    var estado;

    if(est == 1){
        estado = 0
    } else
        estado = 1;

    UserModel.query('UPDATE proveedor SET estatus='+estado+' WHERE idproveedor='+idproveedor ,(error, resultado, fields) => {
            next(error, resultado)
    })
}

function get_nombre_rif_proveedor(nombre,rif,next){
    UserModel.query("SELECT * FROM proveedor where nombre='"+nombre+"' OR rif='"+rif+"'" ,(error, resultado, fields) => {
            next(error, resultado)
    })
}

function registrar_proveedor(tiporif,rif,nombre,email,telefono,nota, next){
    UserModel.query("INSERT INTO `proveedor`(`tiporif`, `rif`, `nombre`, `email`, `telefono`, `nota`) VALUES ("+tiporif+",'"+rif+"','"+nombre+"','"+email+"','"+telefono+"','"+nota+"')" ,(error, resultado, fields) => {
            next(error, resultado)
    })
}

function editar_proveedor(tiporif,rif,nombre,email,telefono,nota,idproveedor,next){
    UserModel.query("UPDATE proveedor SET tiporif="+tiporif+",rif='"+rif+"',nombre='"+nombre+"',email='"+email+"',telefono='"+telefono+"',nota='"+nota+"' WHERE idproveedor="+idproveedor  ,(error, resultado, fields) => {
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
function get_proveedor_estatus(estatus,next){
    if(estatus == 2){
        UserModel.query(`SELECT p.*, r.abreviatura FROM proveedor p INNER JOIN rif r ON r.id = p.tiporif` ,(error, resultado, fields) => {
            next(error, resultado)
        })
    } else{
        UserModel.query("SELECT p.*, r.abreviatura FROM proveedor p INNER JOIN rif r ON r.id = p.tiporif WHERE p.estatus="+estatus ,(error, resultado, fields) => {
                next(error, resultado)
        })
    }
}

module.exports = {
    get_proveedor,
    editar_estatus_proveedor,
    get_nombre_rif_proveedor,
    registrar_proveedor,
    get_proveedor_por_id,
    editar_proveedor,
    get_proveedor_estatus
}
