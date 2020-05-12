const express = require('express')
execSQLQuery = require('../cadastros/cadastro')

module.exports = function(server) {
    const router = express.Router() 
    //CRUD tipolog

    //READ ALL
    var sql = 'SELECT * FROM tipolog'
    router.get('/tipolog', (req, res) => {execSQLQuery(sql, res)})

    //READ POR ID
    router.get('/tipolog/:id?', (req, res) => {
        let filter = ''
        if(req.params.id) filter = ' WHERE codTLog = ' + req.params.id;
        execSQLQuery(sql + filter, res)})

    //DELETE POR ID
    router.delete('/tipolog/:id', (req, res) =>{
        execSQLQuery('DELETE FROM tipolog where codTLog = ' + parseInt(req.params.id), res)
    })

    //INSERIR 
    router.post('/tipolog', (req,res) =>{
        const descricaoTLog = req.body.descricaoTLog.substring(0,150)
        
        execSQLQuery(`INSERT INTO tipolog(descricaoTLog) values('${descricaoTLog}')`, res)
    })

    //ATUALIZAR
    router.patch('/tipolog/:id', (req,res) =>{
        const id = parseInt(req.params.id)
        const descricaoTLog = req.body.descricaoTLog.substring(0,150)
        
        execSQLQuery(`update tipolog set descricaoTLog = '${descricaoTLog}'  where codTLog = ${id}`, res)
    })
    server.use('/', router)
}