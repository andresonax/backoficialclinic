const express = require('express')
execSQLQuery = require('../cadastros/cadastro')

module.exports = function(server) {
    const router = express.Router() 
    //CRUD cadpais

    //READ ALL
    var sql = 'SELECT * FROM cadpais'
    router.get('/cadpais', (req, res) => {execSQLQuery(sql, res)})

    //READ POR ID
    router.get('/cadpais/:id?', (req, res) => {
        let filter = ''
        if(req.params.id) filter = ' WHERE CODPAIS = ' + req.params.id;
        execSQLQuery(sql + filter, res)})

    //DELETE POR ID
    router.delete('/cadpais/:id', (req, res) =>{
        execSQLQuery('DELETE FROM cadpais where CODPAIS = ' + parseInt(req.params.id), res)
    })

    //INSERIR 
    router.post('/cadpais', (req,res) =>{
        const nome = req.body.nome.substring(0,150)
        const gentilico = req.body.gentilico.substring(0,150)
        execSQLQuery(`INSERT INTO cadpais(nome, gentilico) values('${nome}','${gentilico}')`, res)
    })

    //ATUALIZAR
    router.patch('/cadpais/:id', (req,res) =>{
        const id = parseInt(req.params.id)
        const nome = req.body.nome.substring(0,150)
        const gentilico = req.body.gentilico.substring(0,150)
        execSQLQuery(`update cadpais set nome = '${nome}', gentilico = '${gentilico}'  where CODPAIS = ${id}`, res)
    })
    server.use('/', router)
}