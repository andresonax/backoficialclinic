const express = require('express')
execSQLQuery = require('../cadastros/cadastro')

module.exports = function(server) {
    const router = express.Router() 
    //CRUD tipoexame

    //READ ALL
    var sql = 'SELECT D.codDescExame as "key", D.*, T.*  FROM descexame D INNER JOIN tipoexame T ON D.codTExame = T.codTExame;'
    router.get('/descexame', (req, res) => {execSQLQuery(sql, res)})

    //garrega lista médico
    var sqlListaM = 'SELECT codDescExame, descricaoExame, valorExame from descexame where codTExame = 0 order by descricaoExame'
    router.get('/descexameListaMedico', (req, res) => {execSQLQuery(sqlListaM, res)})
    //garrega lista psico
    var sqlListaP = 'SELECT codDescExame, descricaoExame, valorExame from descexame where codTExame = 1 order by descricaoExame'
    router.get('/descexameListaPsico', (req, res) => {execSQLQuery(sqlListaP, res)})

    //READ POR ID
    router.get('/descexame/:id?', (req, res) => {
        let filter = ''
        if(req.params.id) filter = ' WHERE codDescExame = ' + req.params.id;
        execSQLQuery(sql + filter, res)})

    //DELETE POR ID
    router.delete('/descexame/:id', (req, res) =>{
        execSQLQuery('DELETE FROM descexame where codDescExame = ' + parseInt(req.params.id), res)
    })

    //INSERIR 
    router.post('/descexame', (req,res) =>{
        const descricaoExame = req.body.descricaoExame.substring(0,30)
        const codTExame = req.body.codTExame
        const valorExame = parseFloat(req.body.valorExame)
        const validadeExame = req.body.validadeExame
        const validadeEspecial = req.body.validadeEspecial
        
        execSQLQuery(`INSERT INTO descexame(descricaoExame, codTExame, valorExame, validadeExame, validadeEspecial `+
        `) values('${descricaoExame}', ${codTExame},${valorExame},${validadeExame},${validadeEspecial})`, res)
    })

    //ATUALIZAR
    router.patch('/descexame/:id', (req,res) =>{
        const id = parseInt(req.params.id)
        const descricaoExame = req.body.descricaoExame.substring(0,30)
        const codTExame = req.body.codTExame
        const valorExame = parseFloat(req.body.valorExame)
        const validadeExame = req.body.validadeExame
        const validadeEspecial = req.body.validadeEspecial
        
        execSQLQuery(`update descexame set descricaoExame = '${descricaoExame}', codTExame = ${codTExame}, `+
        ` valorExame = ${valorExame}, validadeExame = ${validadeExame}, validadeEspecial = ${validadeEspecial} where codDescExame = ${id}`, res)
    })
    server.use('/', router)
}