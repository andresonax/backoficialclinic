const express = require('express')
execSQLQuery = require('../cadastros/cadastro')

module.exports = function(server) {
    const router = express.Router() 
    //CRUD reajustelivro

    //READ ALL
    var sql = 'SELECT * FROM reajustelivro'
    router.get('/reajustelivro', (req, res) => {execSQLQuery(sql, res)})

    //READ POR ID
    router.get('/reajustelivro/:id?', (req, res) => {
        let filter = ''
        if(req.params.id) filter = ' WHERE codInterno = ' + req.params.id;
        execSQLQuery(sql + filter, res)})

    //DELETE POR ID
    router.delete('/reajustelivro/:id', (req, res) =>{
        execSQLQuery('DELETE FROM reajustelivro where codInterno = ' + parseInt(req.params.id), res)
    })

    //INSERIR 
    router.post('/reajustelivro', (req,res) =>{
        const codlivro = req.body.codlivro
        const codMotivo = req.body.codMotivo
        const valorMotivo = req.body.valorMotivo
        const codUsuario = req.body.codUsuario
        const datareaj = req.body.datareaj
        
        execSQLQuery(`INSERT INTO reajustelivro(codlivro, codMotivo, valorMotivo, codUsuario, datareaj) `+
        ` values(${codlivro}, ${codMotivo}, ${valorMotivo}, ${codUsuario}, '${datareaj}', )`, res)
    })

    //ATUALIZAR
    router.patch('/reajustelivro/:id', (req,res) =>{
        const id = parseInt(req.params.id)
        const codlivro = req.body.codlivro
        const codMotivo = req.body.codMotivo
        const valorMotivo = req.body.valorMotivo
        const codUsuario = req.body.codUsuario
        const datareaj = req.body.datareaj
        
        execSQLQuery(`update reajustelivro set codlivro = ${codlivro},codMotivo = ${codMotivo},valorMotivo = ${valorMotivo}, `+
        ` codUsuario = ${codUsuario},datareaj = ${datareaj}  where codInterno = ${id}`, res)
    })
    server.use('/', router)
}