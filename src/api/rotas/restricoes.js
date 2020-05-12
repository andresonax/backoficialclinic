const express = require('express')
execSQLQuery = require('../cadastros/cadastro')

module.exports = function(server) {
    const router = express.Router() 
    //CRUD restricoes

    //READ ALL
    var sql = 'SELECT * FROM restricoes'
    router.get('/restricoes', (req, res) => {execSQLQuery(sql, res)})

    //READ POR ID
    router.get('/restricoes/:id?', (req, res) => {
        let filter = ''
        if(req.params.id) filter = ' WHERE id = ' + req.params.id;
        execSQLQuery(sql + filter, res)})

    //DELETE POR ID
    router.delete('/restricoes/:id', (req, res) =>{
        execSQLQuery('DELETE FROM restricoes where id = ' + parseInt(req.params.id), res)
    })

    //INSERIR 
    router.post('/restricoes', (req,res) =>{
        const codRestricao = req.body.codRestricao.substring(0,5)
        const descricaoRestr = req.body.descricaoRestr.substring(0,20)
        
        execSQLQuery(`INSERT INTO restricoes(codRestricao, descricaoRestr ) values('${codRestricao}', '${descricaoRestr}')`, res)
    })

    //ATUALIZAR
    router.patch('/restricoes/:id', (req,res) =>{
        const id = parseInt(req.params.id)
        const codRestricao = req.body.codRestricao.substring(0,5)
        const descricaoRestr = req.body.descricaoRestr.substring(0,20)
        
        execSQLQuery(`update restricoes set codRestricao = '${codRestricao}', descricaoRestr = '${descricaoRestr}'  where id = ${id}`, res)
    })
    server.use('/', router)
}