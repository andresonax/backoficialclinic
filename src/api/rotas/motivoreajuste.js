const express = require('express')
execSQLQuery = require('../cadastros/cadastro')

module.exports = function(server) {
    const router = express.Router() 
    //CRUD motivoreajuste

    //READ ALL
    var sql = 'SELECT * FROM motivoreajuste'
    router.get('/motivoreajuste', (req, res) => {execSQLQuery(sql, res)})

    //READ POR ID
    router.get('/motivoreajuste/:id?', (req, res) => {
        let filter = ''
        if(req.params.id) filter = ' WHERE codReajuste = ' + req.params.id;
        execSQLQuery(sql + filter, res)})

    //DELETE POR ID
    router.delete('/motivoreajuste/:id', (req, res) =>{
        execSQLQuery('DELETE FROM motivoreajuste where codReajuste = ' + parseInt(req.params.id), res)
    })

    //INSERIR 
    router.post('/motivoreajuste', (req,res) =>{
        const descReajuste = req.body.descReajuste.substring(0,20)
        const creditoDesconto = req.body.descReajuste.substring(0,1)
        
        execSQLQuery(`INSERT INTO motivoreajuste(descReajuste, creditoDesconto) values('${descReajuste}', '${creditoDesconto}', )`, res)
    })

    //ATUALIZAR
    router.patch('/motivoreajuste/:id', (req,res) =>{
        const id = parseInt(req.params.id)
        const descReajuste = req.body.descReajuste.substring(0,20)
        const creditoDesconto = req.body.descReajuste.substring(0,1)
        
        execSQLQuery(`update motivoreajuste set descReajuste = '${descReajuste}', creditoDesconto = '${creditoDesconto}',   where codReajuste = ${id}`, res)
    })
    server.use('/', router)
}