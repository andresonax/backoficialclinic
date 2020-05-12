const conection = require('../../config/database')
const express = require('express')


module.exports = function (server) {
    const router = express.Router()
    //CRUD categoriaProd

    //READ ALL
    router.get('/unidade', (req, res) => { 
        var sql = 'SELECT * FROM unidade'
        conection.query(sql, (error, results, fields) => {
            if (error)
                res.json(error);
            else
                res.json(results);
        });
    })
    server.use('/', router)
}