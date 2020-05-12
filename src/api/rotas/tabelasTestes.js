const express = require('express')
execSQLQuery = require('../cadastros/cadastro')
const conection = require('../../config/database')


module.exports = function(server) {
    const router = express.Router() 
    //CRUD tabelastestes

    //READ ALL
    var sql = 'SELECT * FROM tabelastestes '
    router.get('/tabelastestes', (req, res) => {execSQLQuery(sql, res)})

    //READ POR ID
    router.get('/tabelastestes/:id?', (req, res) => {
        let filter = ''
        if(req.params.id) filter = ` WHERE idTabelasTestes = ${req.params.id};`;
        execSQLQuery(sql + filter, res)})
    //LER TABELA
    //VOU INSERIR NESTA BUSCA AS referencias DO EXAME TAMBÉM
    router.post('/tabelastestesTabela', (req, res) => {
        let filter = req.body.tabelaPontos ?  ` WHERE tabelaPontos =  '${req.body.tabelaPontos}' ;` : 'WHERE idTabelasTestes is null;' //forço o resultado vazio
        let sqlReferencias = ` SELECT R.* FROM referencias R INNER JOIN testesreferencias TR ON R.IDreferencias = TR.KEYreferencias `+
                ` INNER JOIN testespsico TP ON TP.KEY = TR.KEYTESTES WHERE TP.KEY = ${req.body.key};`
       
        conection.query(sql + filter + sqlReferencias, (error, results, fields) => {
            let resultados = {
                    tabela : undefined,
                    referencias : undefined,
                }
            if(error){
                res.json(error)
            }
            if(results){
                resultados.tabela = results[0]
                resultados.referencias = results[1]
                res.json(resultados)
            }
        })
    })
        

    //DELETE POR ID
    router.delete('/tabelastestes/:id', (req, res) =>{
        execSQLQuery('DELETE FROM tabelastestes where idTabelasTestes = ' + parseInt(req.params.id), res)
    })
 
    

    //INSERIR 
    router.post('/tabelastestes', (req,res) =>{
        
        const tabelaPontos = req.body.tabelaPontos.substring(0,150)
        const codEscolararidade = req.body.codEscolararidade.substring(0,150)
        const pontos = req.pontos.idCidade
        const resultado = req.resultado.codPais
        
        execSQLQuery(`INSERT INTO cadcidades(nomeCidade,ufcidade,idCidade,codPais) values('${nomeCidade}', '${ufcidade}',${idCidade},${codPais})`, res)
    })
    //INSERIR 
    router.post('/tabelastestesManual', (req,res) =>{

        let sqlFodao = ''
        tabelasConclusao.tabelaAA.map((e) => {
            sqlFodao += `INSERT INTO tabelastestes(tabelaPontos,codEscolaridade,pontos,resultado) `+
            `VALUES('tabelaAA',${e.codEscolaridade},${e.pontos},'${e.resultado}');`
        })
        tabelasConclusao.tabelaAC.map((e) => {
            sqlFodao += `INSERT INTO tabelastestes(tabelaPontos,codEscolaridade,pontos,resultado) `+
            `VALUES('tabelaAC',${e.codEscolaridade},${e.pontos},'${e.resultado}');`
        })
        tabelasConclusao.tabelaAD.map((e) => {
            sqlFodao += `INSERT INTO tabelastestes(tabelaPontos,codEscolaridade,pontos,resultado) `+
            `VALUES('tabelaAD',${e.codEscolaridade},${e.pontos},'${e.resultado}');`
        })
        tabelasConclusao.tabelaBETA.map((e) => {
            sqlFodao += `INSERT INTO tabelastestes(tabelaPontos,codEscolaridade,pontos,resultado) `+
            `VALUES('tabelaBETA',${e.codEscolaridade},${e.pontos},'${e.resultado}');`
        })
        tabelasConclusao.tabelaPALO.map((e) => {
            sqlFodao += `INSERT INTO tabelastestes(tabelaPontos,codEscolaridade,pontos,resultado) `+
            `VALUES('tabelaPALO',${e.codEscolaridade},${e.pontos},'${e.resultado}');`
        })
        tabelasConclusao.tabelaTEPIC.map((e) => {
            sqlFodao += `INSERT INTO tabelastestes(tabelaPontos,codEscolaridade,pontos,resultado) `+
            `VALUES('tabelaTEPIC',${e.codEscolaridade},${e.pontos},'${e.resultado}');`
        })
 
        execSQLQuery(sqlFodao, res)
    })

    //ATUALIZAR
    router.patch('/tabelastestes/:id', (req,res) =>{
        const id = parseInt(req.params.id)
        const nomeCidade = req.body.nomeCidade.substring(0,150)
        const ufcidade = req.body.ufcidade.substring(0,150)
        const idCidade = req.body.idCidade.substring(0,150)
        const codPais = req.body.codPais.substring(0,150)
        
        execSQLQuery(`update cadcidades set nomeCidade = '${nomeCidade}',  ufcidade = '${ufcidade}',  idCidade = ${idCidade},  codPais = ${codPais} where codcidade = ${id}`, res)
    })
    server.use('/', router)
}