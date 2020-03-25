const UserModel = require('./conexion')

function get_taller(next){
    UserModel.query(`SELECT * FROM modelo` ,(error, resultado, fields) => {
            next(error, resultado)
    })
}

function get_nombre_modelo(nombre,next){
    UserModel.query(`SELECT * FROM modelo WHERE nombre="`+nombre+`"` ,(error, resultado, fields) => {
            next(error, resultado)
    })
}

function registrar_modelo(nombre, tipo, marca, colorfont, colorbg, icono,next){
    UserModel.query("INSERT INTO `modelo`(`nombre`, `marca`, `tipo`, `colorbg`, `colorfont`, `icono`) VALUES ('"+nombre+"','"+marca+"','"+tipo+"','"+colorbg+"','"+colorfont+"','"+icono+"')" ,(error, resultado, fields) => {
            next(error, resultado)
    })
}
module.exports = {
    get_taller,
    get_nombre_modelo,
    registrar_modelo,
}
