const passport = require("passport");
const Utilidad = require('../ayuda/utilidad');
const UserModel = require('../modelos/conexion')
/*
        Array
            (
                [id] => 8
                [field_foreign] => codestado
                [table] => estado
                [value] => codestado
                [description] => nombre
            )

    */
function list_combo(req, res){
    var add = "<option value='' selected>Seleccione una opcion</option>";
    var sql;
    var rest;
    //console.log(req.body.id,req.body.field_foreign,req.body.table,req.body.value,req.body.description,req.body.selected);
    if(req.body.id == "" && req.body.field_foreign == ""){
        UserModel.query("SELECT * FROM "+req.body.table+" WHERE estatus = 1" ,(error, resultado, fields) => {
            rest = resultado;
            for(var i = 0; rest[i]; i++){
                if(req.body.selected == eval("rest[i]."+req.body.value)){
                    add += "<option value='"+eval("rest[i]."+req.body.value)+"' selected>"+rest[i].nombre+"</option>";
                } else{
                    add += "<option value='"+eval("rest[i]."+req.body.value)+"'>"+rest[i].nombre+"</option>";
                }
            }
            res.send(add)
            
        })
    } else {
        UserModel.query( "SELECT * FROM "+req.body.table+" WHERE "+req.body.field_foreign+"="+req.body.id+" AND estatus = 1" ,(error, resultado, fields) => {
            rest = resultado;
            for(var i = 0; rest[i]; i++){
                if(req.body.selected == eval("rest[i]."+req.body.value)){
                    add += "<option value='"+eval("rest[i]."+req.body.value)+"' selected>"+rest[i].nombre+"</option>";
                } else{
                    add += "<option value='"+eval("rest[i]."+req.body.value)+"'>"+rest[i].nombre+"</option>";
                }
    }
            res.send(add)
            
        })
    }
    
};


module.exports = {
    list_combo
}
