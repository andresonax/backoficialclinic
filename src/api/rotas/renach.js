const express = require('express')
execSQLQuery = require('../cadastros/cadastro')

module.exports = function(server) {
    const router = express.Router() 
    //CRUD renach

    //READ ALL
    var sql = 'SELECT * FROM renach'
    router.get('/renach', (req, res) => {execSQLQuery(sql, res)})

    //READ POR ID
    router.get('/renach/:id?', (req, res) => {
        let filter = ''
        if(req.params.id) filter = ' WHERE codRenach = ' + req.params.id;
        execSQLQuery(sql + filter, res)})

    //DELETE POR ID
    router.delete('/renach/:id', (req, res) =>{
        execSQLQuery('DELETE FROM renach where codRenach = ' + parseInt(req.params.id), res)
    })

    //INSERIR 
    router.post('/renach', (req,res) =>{
        const codPaciente = req.body.codPaciente
        const motivoImpressao = req.body.motivoImpressao
        const pgu = req.body.pgu.substring(0,20)
        const ufpgu = req.body.ufpgu.substring(0,2)
        const dataEmissao = req.body.dataEmissao
        
        execSQLQuery(`INSERT INTO renach(codPaciente, motivoImpressao, pgu, ufpgu, dataEmissao) `+
            ` values(${codPaciente}, ${motivoImpressao}, '${pgu}', '${ufpgu}', '${dataEmissao}', )`, res)
    })

    //ATUALIZAR
    router.patch('/renach/:id', (req,res) =>{
        const id = parseInt(req.params.id)
        const codPaciente = req.body.codPaciente
        const motivoImpressao = req.body.motivoImpressao
        const pgu = req.body.pgu
        const ufpgu = req.body.ufpgu
        const dataEmissao = req.body.dataEmissao
        
        execSQLQuery(`update renach set codPaciente = ${codPaciente}, motivoImpressao = ${motivoImpressao}, pgu = '${pgu}', `+
        ` ufpgu = '${ufpgu}', dataEmissao = '${dataEmissao}'  where codRenach = ${id}`, res)
    })
    server.use('/', router)
}