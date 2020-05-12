const express = require('express')
execSQLQuery = require('../cadastros/cadastro')
const moment = require('moment')
const conection = require('../../config/database')

module.exports = function(server) {
    const router = express.Router() 
    //CRUD cadpais

    //READ ALL
    
    router.get('/bakupagend', (req, res) => {
        var sql = 'SELECT * FROM bakupagend'
        execSQLQuery(sql, res)
    
    })

    //READ POR ID
    router.get('/bakupagend/:id?', (req, res) => {
        let filter = ''
        if(req.params.id) filter = ' WHERE id = ' + req.params.id;
        execSQLQuery(sql + filter, res)})

    //DELETE POR ID
    router.delete('/bakupagend/:id', (req, res) =>{
        execSQLQuery('DELETE FROM bakupagend where id = ' + parseInt(req.params.id), res)
    })

    router.post('/bakupagend', (req, res) => {
        const {caminho, horarios, dias} = req.body
        var sql = 'delete from bakupagend;'
        for(var i = 0; i<dias.length ; i++){
            for(var j=0; j<horarios.length; j++){
                sql += `insert into bakupagend(local, dia, horario) values('${caminho}', '${i}', '${horarios[j]}');`
            }
        }
        conection.query(sql, (error, results, fields) => {
            if(error){
                send.json(error)
            }
            if(results){
                res.send("ok")
            }
        })
    })

    
    //ATUALIZAR
    router.patch('/bakupagend/:id', (req,res) =>{
        const id = parseInt(req.params.id)
        const local = req.body.local.substring(0,200)
        const dia = req.body.dia.substring(0,14)
        const horario = req.body.horario.substring(0,14)
        
        execSQLQuery(`update bakupagend set local = '${local}', dia = '${dia}', horario = '${horario}'  where id = ${id}`, res)
    })
    server.use('/', router)
}