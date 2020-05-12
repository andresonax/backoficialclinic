const express = require('express')
execSQLQuery = require('../cadastros/cadastro')

module.exports = function(server) {
    const router = express.Router() 
    //CRUD recibos

    //READ ALL
    var sql = 'SELECT * FROM recibos'
    router.get('/recibos', (req, res) => {execSQLQuery(sql, res)})

    //READ POR ID
    router.get('/recibos/:id?', (req, res) => {
        let filter = ''
        if(req.params.id) filter = ' WHERE codRecibo = ' + req.params.id;
        execSQLQuery(sql + filter, res)})

    //DELETE POR ID
    router.delete('/recibos/:id', (req, res) =>{
        execSQLQuery('DELETE FROM recibos where codRecibo = ' + parseInt(req.params.id), res)
    })

    //INSERIR 
    router.post('/recibos', (req,res) =>{
        const codPaciente = req.body.codPaciente 
        const dataEmissao = req.body.dataEmissao 
        const valorRecibo = req.body.valorRecibo 
        
        execSQLQuery(`INSERT INTO recibos(codPaciente, dataEmissao, valorRecibo) values(${codPaciente}, '${dataEmissao}', ${valorRecibo})`, res)
    })

    //ATUALIZAR
    router.patch('/recibos/:id', (req,res) =>{
        const id = parseInt(req.params.id)
        const codPaciente = req.body.codPaciente 
        const dataEmissao = req.body.dataEmissao 
        const valorRecibo = req.body.valorRecibo
        
        execSQLQuery(`update recibos set codPaciente = ${codPaciente}, dataEmissao = ${dataEmissao}, valorRecibo = ${valorRecibo}  where codRecibo = ${id}`, res)
    })
    server.use('/', router)
}