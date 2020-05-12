const express = require('express')
execSQLQuery = require('../cadastros/cadastro')

module.exports = function(server) {
    const router = express.Router() 
    //CRUD cadpais

    //READ ALL
    var sql = 'SELECT * FROM construtos'
    router.get('/construtos', (req, res) => {execSQLQuery(sql, res)})

    // //READ POR ID
    // router.get('/referencias/:id?', (req, res) => {
    //     let filter = ''
    //     if(req.params.id) filter = ' WHERE idreferencias = ' + req.params.id;
    //     execSQLQuery(sql + filter, res)})

    // //DELETE POR ID
    // router.delete('/referencias/:id', (req, res) =>{
    //     execSQLQuery('DELETE FROM referecias where idreferencias = ' + parseInt(req.params.id), res)
    // })

    // //INSERIR 
    // router.post('/referencias', (req,res) =>{
    //     const obrigatoria = req.body.obrigatoria.substring(0,150)
    //     const referencia = req.body.referencia.substring(0,500)
    //     execSQLQuery(`INSERT INTO referecias(nome, gentilico) values('${obrigatoria}','${referencia}')`, res)
    // })

    // //ATUALIZAR
    // router.patch('/referencias/:id', (req,res) =>{
    //     const id = parseInt(req.params.id)
    //     const nome = req.body.nome.substring(0,150)
    //     const gentilico = req.body.gentilico.substring(0,150)
    //     execSQLQuery(`update referencias set nome = '${nome}', gentilico = '${gentilico}'  where idreferencias = ${id}`, res)
    // })
    server.use('/', router)
}