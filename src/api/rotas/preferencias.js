const express = require('express')
execSQLQuery = require('../cadastros/cadastro')

module.exports = function(server) {
    const router = express.Router() 
    //CRUD cadpais

    //READ ALL
    var sql = 'SELECT * FROM preferencias'
    router.get('/preferencias', (req, res) => {execSQLQuery(sql, res)})

    //READ POR ID
    router.get('/preferencias/:id?', (req, res) => {
        let filter = ''
        if(req.params.id) filter = ' WHERE id = ' + req.params.id;
        execSQLQuery(sql + filter, res)})

    //DELETE POR ID
    // router.delete('/perfis/:id', (req, res) =>{
    //     execSQLQuery('DELETE FROM perfis where codPerfil = ' + parseInt(req.params.id), res)
    // })

    // //INSERIR 
    // router.post('/perfis', (req,res) =>{
    //     const descPerfil = req.body.descPerfil.substring(0,150)
       
    //     execSQLQuery(`INSERT INTO perfis(descPerfil) values('${descPerfil}')`, res)
    // })

    // //ATUALIZAR
    // router.patch('/perfis/:id', (req,res) =>{
    //     const id = parseInt(req.params.id)
    //     const descPerfil = req.body.descPerfil.substring(0,150)
    //     execSQLQuery(`update perfis set descPerfil = '${descPerfil}'  where codPerfil = ${id}`, res)
    // })
    server.use('/', router)
}