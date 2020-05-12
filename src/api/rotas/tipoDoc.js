const express = require('express')
execSQLQuery = require('../cadastros/cadastro')

module.exports = function(server) {
    const router = express.Router() 
    //CRUD tipodoc

    //READ ALL
    var sql = 'SELECT * FROM tipodoc'
    router.get('/tipodoc', (req, res) => {execSQLQuery(sql, res)})

    //READ POR ID
    router.get('/tipodoc/:id?', (req, res) => {
        let filter = ''
        if(req.params.id) filter = ' WHERE codTipo = ' + req.params.id;
        execSQLQuery(sql + filter, res)})

    //DELETE POR ID
    router.delete('/tipodoc/:id', (req, res) =>{
        execSQLQuery('DELETE FROM tipodoc where codTipo = ' + parseInt(req.params.id), res)
    })

    //INSERIR 
    router.post('/tipodoc', (req,res) =>{
        const descricaoTipo = req.body.descricaoTipo.substring(0,20)
        
        execSQLQuery(`INSERT INTO tipodoc(descricaoTipo) values('${descricaoTipo}')`, res)
    })

    //ATUALIZAR
    router.patch('/tipodoc/:id', (req,res) =>{
        const id = parseInt(req.params.id)
        const descricaoTipo = req.body.descricaoTipo.substring(0,20)
        
        execSQLQuery(`update tipodoc set descricaoTipo = '${descricaoTipo}'  where codTipo = ${id}`, res)
    })
    server.use('/', router)
}