const express = require('express')
execSQLQuery = require('../cadastros/cadastro')
const moment = require('moment')

module.exports = function(server) {
    const router = express.Router() 
    //CRUD resultexame

    //READ ALL
    var sql = 'SELECT * FROM resultexame'
    router.get('/resultexame', (req, res) => {execSQLQuery(sql, res)})

    //READ POR ID
    router.get('/resultexame/:id?', (req, res) => {
        let filter = ''
        if(req.params.id) filter = ' WHERE codResultado = ' + req.params.id;
        execSQLQuery(sql + filter, res)})
    //READ para fichas DEPOIS TEMOS QUE OLHAR ISSO! A TABELA É BEM INÚTIL
    router.get('/resultexameficha/:id?', (req, res) => {
        let filter = ''
        //if(req.params.id) filter = ' WHERE codResultado = ' + req.params.id;
        execSQLQuery('select * from resultexame where resultPsicol = 1' + filter, res)})

    //DELETE POR ID
    router.delete('/resultexame/:id', (req, res) =>{
        execSQLQuery('DELETE FROM resultexame where codResultado = ' + parseInt(req.params.id), res)
    })

    //INSERIR 
    router.post('/resultexame', (req,res) =>{
        const descricaoResult = req.body.descricaoResult.substring(0,50)
        const resultMedico = req.body.resultMedico.substring(0,1)
        const resultPsicol = req.body.resultPsicol.substring(0,1)
        
        execSQLQuery(`INSERT INTO resultexame(descricaoResult, resultMedico, resultPsicol) values('${descricaoResult}','${resultMedico}','${resultPsicol}',)`, res)
    })

    //ATUALIZAR
    router.patch('/resultexame/:id', (req,res) =>{
        const id = parseInt(req.params.id)
        const descricaoResult = req.body.descricaoResult.substring(0,50)
        const resultMedico = req.body.resultMedico.substring(0,1)
        const resultPsicol = req.body.resultPsicol.substring(0,1)
        
        execSQLQuery(`update resultexame set descricaoResult = '${descricaoResult}', resultMedico = '${resultMedico}', resultPsicol = '${resultPsicol}', `+
        `  where codResultado = ${id}`, res)
    })
    server.use('/', router)
}