const express = require('express')
execSQLQuery = require('../cadastros/cadastro')

module.exports = function(server) {
    const router = express.Router() 
    //CRUD protocolo

    //READ ALL
    var sql = 'SELECT * FROM protocolo'
    router.get('/protocolo', (req, res) => {execSQLQuery(sql, res)})

    //READ POR ID
    router.get('/protocolo/:id?', (req, res) => {
        let filter = ''
        if(req.params.id) filter = ' WHERE codProtocolo = ' + req.params.id;
        execSQLQuery(sql + filter, res)})

    //DELETE POR ID
    router.delete('/protocolo/:id', (req, res) =>{
        execSQLQuery('DELETE FROM protocolo where codProtocolo = ' + parseInt(req.params.id), res)
    })

    //INSERIR 
    router.post('/protocolo', (req,res) =>{
        const codPaciente = req.body.codPaciente
        const dataEmissaoProt = req.body.dataEmissaoProt
        const dataPrevista = req.body.dataPrevista
        const recebimento = req.body.recebimento
        
        execSQLQuery(`INSERT INTO protocolo(codPaciente, dataEmissaoProt, dataPrevista, recebimento)`+
        ` values(${codPaciente}, '${dataEmissaoProt}', '${dataPrevista}', ${recebimento})`, res)
    })

    //ATUALIZAR
    router.patch('/protocolo/:id', (req,res) =>{
        const id = parseInt(req.params.id)
        const codPaciente = req.body.codPaciente
        const dataEmissaoProt = req.body.dataEmissaoProt
        const dataPrevista = req.body.dataPrevista
        const recebimento = req.body.recebimento
        
        execSQLQuery(`update protocolo set codPaciente = ${codPaciente}, dataEmissaoProt = ${dataEmissaoProt}, dataPrevista = ${dataPrevista}, `+
        ` recebimento = ${recebimento}  where codProtocolo = ${id}`, res)
    })
    server.use('/', router)
}