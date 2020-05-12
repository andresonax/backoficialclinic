const express = require('express')
execSQLQuery = require('../cadastros/cadastro')

module.exports = function(server) {
    const router = express.Router() 
    //CRUD relrecibolivro

    //READ ALL
    var sql = 'SELECT * FROM relrecibolivro'
    router.get('/relrecibolivro', (req, res) => {execSQLQuery(sql, res)})

    //READ POR ID
    router.get('/relrecibolivro/:id?', (req, res) => {
        let filter = ''
        if(req.params.id) filter = ' WHERE id = ' + req.params.id;
        execSQLQuery(sql + filter, res)})

    //DELETE POR ID
    router.delete('/relrecibolivro/:id', (req, res) =>{
        execSQLQuery('DELETE FROM relrecibolivro where id = ' + parseInt(req.params.id), res)
    })

    //INSERIR 
    router.post('/relrecibolivro', (req,res) =>{
        const codRecibo = req.body.codRecibo.substring(0,150)
        const codLivro = req.body.codLivro.substring(0,150)
        
        execSQLQuery(`INSERT INTO relrecibolivro(codRecibo, codLivro) values(${codRecibo}, ${codLivro})`, res)
    })

    //ATUALIZAR
    router.patch('/relrecibolivro/:id', (req,res) =>{
        const id = parseInt(req.params.id)
        const codRecibo = req.body.codRecibo.substring(0,150)
        const codLivro = req.body.codLivro.substring(0,150)
        execSQLQuery(`update relrecibolivro set codRecibo = ${codRecibo}, codLivro = ${codLivro}  where id = ${id}`, res)
    })
    server.use('/', router)
}