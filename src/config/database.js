const mysql = require('mysql')
const conection = mysql.createConnection({
    host : 'localhost',
    port : 3306,
    user : 'root',
    password : 'root',
    database : 'sonaxpsicall',
    multipleStatements: true
  })


// const mysql = require('mysql')
// const conection = mysql.createConnection({
//     host : 'clinic.c8tuthxylqic.sa-east-1.rds.amazonaws.com',
//     port : 3306,
//     user : 'admin',
//     password : 'khyo2107',
//     database : '`Rf6mT6?\\?A;tpV*',
//     multipleStatements: true
//   })

module.exports = conection

