const express = require('express')
execSQLQuery = require('../cadastros/cadastro')

module.exports = function(server) {
    const router = express.Router() 
    //CRUD escolaridade

    //READ ALL
    var sql = 'SELECT * FROM escolaridade'
    router.get('/escolaridade', (req, res) => {execSQLQuery(sql, res)})

    //READ POR ID
    router.get('/escolaridade/:id?', (req, res) => {
        let filter = ''
        if(req.params.id) filter = ' WHERE codescolaridade = ' + req.params.id;
        execSQLQuery(sql + filter, res)})

    //DELETE POR ID
    router.delete('/escolaridade/:id', (req, res) =>{
        execSQLQuery('DELETE FROM escolaridade where codescolaridade = ' + parseInt(req.params.id), res)
    })

    //INSERIR 
    router.post('/escolaridade', (req,res) =>{
        const descEscolaridade = req.body.descEscolaridade.substring(0,150)
        
        execSQLQuery(`INSERT INTO escolaridade(descEscolaridade) values('${descEscolaridade}')`, res)
    })

    //ATUALIZAR
    router.patch('/escolaridade/:id', (req,res) =>{
        const id = parseInt(req.params.id)
        const descEscolaridade = req.body.descEscolaridade.substring(0,150)
        
        execSQLQuery(`update escolaridade set descEscolaridade = '${descEscolaridade}'  where codescolaridade = ${id}`, res)
    })
    server.use('/', router)
}