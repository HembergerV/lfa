/**
 * Created by Raul Perez on 11/04/2017.
 */
'use strict'

/*const mysql = require('mysql'),
    //dbOptions = require('./config'),
    //myConnection = mysql.createConnection(dbOptions)
    myConnection = mysql.createConnection("mysql://qb2yr0gn8r62bymy:u7z3xtyqvh8r3ro0@ffn96u87j5ogvehy.cbetxkdyhwsb.us-east-1.rds.amazonaws.com:3306/plibo3i14bhoyzc6")

myConnection.connect( err => {
    return (err) ? console.log('Error al conectarse a mysql: '+err.stack) : console.log('Coneccion establecida con mysql')
})

module.exports = myConnection*/

var mysql = require("mysql");
var myConnection = mysql.createConnection({
           host: 'bqps2rbxzko9w8yb1npn-mysql.services.clever-cloud.com',
           user: 'ud9skvs69z7qnnbi',
           password: 'jEHm7GKVQr54cSqqaghn',
           database: 'bqps2rbxzko9w8yb1npn',
           port: '3306'
});


myConnection.connect();
module.exports = myConnection;