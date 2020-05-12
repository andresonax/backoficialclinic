const express = require('express')
execSQLQuery = require('../cadastros/cadastro')

module.exports = function(server) {
    const router = express.Router() 
    //CRUD categoriacnh

    //READ ALL
    var sql = 'SELECT * FROM categoriacnh'
    router.get('/categoriacnh', (req, res) => {execSQLQuery(sql, res)})

    //READ POR ID
    router.get('/categoriacnh/:id?', (req, res) => {
        let filter = ''
        if(req.params.id) filter = ' WHERE codCategoria = ' + req.params.id;
        execSQLQuery(sql + filter, res)})

    //DELETE POR ID
    router.delete('/categoriacnh/:id', (req, res) =>{
        execSQLQuery('DELETE FROM categoriacnh where codCategoria = ' + parseInt(req.params.id), res)
    })

    //INSERIR 
    router.post('/categoriacnh', (req,res) =>{
        const categoria = req.body.categoria.substring(0,150) 
        const descricaoCat = req.body.descricaoCat.substring(0,150) 
        
        execSQLQuery(`INSERT INTO categoriacnh(categoria, descricaoCat) values('${categoria}', '${descricaoCat}')`, res)
    })

    //ATUALIZAR
    router.patch('/categoriacnh/:id', (req,res) =>{
        const id = parseInt(req.params.id)
        const categoria = req.body.categoria.substring(0,150) 
        const descricaoCat = req.body.descricaoCat.substring(0,150)
        
        execSQLQuery(`update categoriacnh set categoria = '${categoria}', descricaoCat = '${descricaoCat}'  where codCategoria = ${id}`, res)
    })
    server.use('/', router)
}