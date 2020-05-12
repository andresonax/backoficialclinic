const express = require('express')
execSQLQuery = require('../cadastros/cadastro')
const conection = require('../../config/database')


module.exports = function(server) {
    const router = express.Router() 
    //CRUD cadcidades

    //READ ALL
    var sql = 'SELECT * FROM cadcidades INNER JOIN cadpais ON cadcidades.CODPAIS = cadpais.CODPAIS'
    router.get('/cadcidades', (req, res) => {execSQLQuery(sql, res)})

    //READ POR ID
    router.get('/cadcidades/:id?', (req, res) => {
        let filter = ''
        if(req.params.id) filter = ' WHERE codcidade = ' + req.params.id;
        execSQLQuery(sql + filter, res)})

    //DELETE POR ID
    router.delete('/cadcidades/:id', (req, res) =>{
        execSQLQuery('DELETE FROM cadcidades where codcidade = ' + parseInt(req.params.id), res)
    })

    //BUSCA cidades PARA LISTA
    router.post('/cidadeBusca/:busca?', (req, res) =>{
        let sqlBusca = 'SELECT * FROM cadcidades C INNER JOIN cadpais P ON C.CODPAIS = P.CODPAIS '
        let filter = ''
        if(req.params.busca) filter = ` WHERE C.nomeCidade LIKE '%${req.params.busca}%'`
        conection.query(sqlBusca + filter, function(error, results, fields){
            var options = []
            if(error)
              res.json(error)
            else{
                results.map(e => {
                    options.push({codCidade : e.codCidade, nomeCidade : e.nomeCidade})
                    
                    
                })
                res.json(options)
            }
              
          })
    })

    //INSERIR 
    router.post('/cadcidades', (req,res) =>{
        const nomeCidade = req.body.nomeCidade.substring(0,150)
        const ufcidade = req.body.ufcidade.substring(0,150)
        const idCidade = req.body.idCidade
        const codPais = req.body.codPais
        
        execSQLQuery(`INSERT INTO cadcidades(nomeCidade,ufcidade,idCidade,codPais) values('${nomeCidade}', '${ufcidade}',${idCidade},${codPais})`, res)
    })

    //ATUALIZAR
    router.patch('/cadcidades/:id', (req,res) =>{
        const id = parseInt(req.params.id)
        const nomeCidade = req.body.nomeCidade.substring(0,150)
        const ufcidade = req.body.ufcidade.substring(0,150)
        const idCidade = req.body.idCidade.substring(0,150)
        const codPais = req.body.codPais.substring(0,150)
        
        execSQLQuery(`update cadcidades set nomeCidade = '${nomeCidade}',  ufcidade = '${ufcidade}',  idCidade = ${idCidade},  codPais = ${codPais} where codcidade = ${id}`, res)
    })
    server.use('/', router)
}