const express = require('express')
execSQLQuery = require('../cadastros/cadastro')
const conection = require('../../config/database')
const moment = require('moment')
const {front, back} = require('../../config/variaveis')

module.exports = function(server) {
    const router = express.Router() 
    //CRUD livrofinanceiro

    //READ ALL
    var sql = 'SELECT * FROM livrofinanceiro'
    router.get('/livrofinanceiro', (req, res) => {execSQLQuery(sql, res)})

    //READ POR ID
    router.get('/livrofinanceiro/:id?', (req, res) => {
        let filter = ''
        if(req.params.id) filter = ' WHERE codLivro = ' + req.params.id;
        execSQLQuery(sql + filter, res)})
    //READ POR paciente
    var sqlPaciente = 'SELECT codLivro, codPaciente, codDescExame, descricaoTExame, valorTotal, dataLancamento FROM livrofinanceiro inner join descexame on livrofinanceiro.codTipoExame = descexame.codDescExame '+
                        ' inner join tipoexame on descexame.codTExame = tipoexame.codTExame '
    router.get('/livrofinanceiroPaciente/:id?', (req, res) => {
        let filter = ''
        if(req.params.id) filter = ' WHERE codPaciente = ' + req.params.id + ' and dataCancel is null';
        execSQLQuery(sqlPaciente + filter, res)})

    //DELETE POR ID
    router.delete('/livrofinanceiro/:id', (req, res) =>{
        execSQLQuery('DELETE FROM livrofinanceiro where codLivro = ' + parseInt(req.params.id), res)
    })

    //estornar livro
    router.post('/estornaLivro', (req, res) => {
       let sqlLivro = `update livrofinanceiro set dataCancel = '${moment(new Date()).format('YYYY-MM-DD HH:MM')}' where codLivro = ${req.body.codLivro};`
       let sqlFila = `delete from filaatendimento where codPaciente = ${req.body.codPaciente} and codDescExame = ${req.body.codDescExame} and CONVERT(codDataPrev, date) = CONVERT('${req.body.dataLancamento}', date);`
       conection.query(sqlLivro + sqlFila,(error, results, fields) => {
           let resultado = {
               status : '',
               info : ''
           }
           if(error){
               resultado.status = 'erro'
               resultado.info = 'Erro de conexão, favor tentar novamente'
              
               res.setHeader('Access-Control-Allow-Origin', front)
               res.setHeader('Access-Control-Allow-Headers', 'Content-Type')
               res.send(resultado)
           }
           if(results){
               resultado.status = 'ok'
               resultado.info = 'Lançamento financeiro estornado!'
              
               res.setHeader('Access-Control-Allow-Origin', front)
               res.setHeader('Access-Control-Allow-Headers', 'Content-Type')
               res.send(resultado)
           }
       })
    })

    router.post('/alteraLivro', (req, res) => {
       let sqlReajuste = `insert into reajustelivro(codlivro,codMotivo,valorMotivo,codUsuario,datareaj) `+
       ` values(${req.body.exame.codLivro},${req.body.reajuste}, ${req.body.valor},  ${req.body.usuario.codUsuario}, '${moment(new Date()).format('YYYY-MM-DD HH:MM')}' );`     
       let sqlLivro = `update livrofinanceiro set valorTotal = valorTotal - ${req.body.valor} where codLivro = ${req.body.exame.codLivro};`
       conection.query(sqlReajuste + sqlLivro, (error, results, fields) => {
           let resposta = {
               status : '',
               info : '',
           }
           if(error){
                resposta.status = 'erro'
                resposta.info = 'Erro de conexão, favor tentar novamente!'
               
                res.send(resposta)
           }
           if(results){
               resposta.status = 'ok'
               resposta.info = 'Alteração realizada com sucesso!'
               
               res.send(resposta)
           }
       })

    })

    //INSERIR 
    router.post('/livrofinanceiro', (req,res) =>{
        const codPaciente = req.body.codPaciente
        const codTipoExame = req.body.codTipoExame
        const valorExame = req.body.valorExame
        const dataLancamento = req.body.dataLancamento
        const dataCancel = req.body.dataCancel
        const codUsuario = req.body.codUsuario
        const recebido = req.body.recebido.substring(0,1)
        const valorTotal = req.body.valorTotal
        
        execSQLQuery(`INSERT INTO livrofinanceiro(codPaciente, codTipoExame, valorExame, dataLancamento, dataCancel, codUsuario, recebido, valorTotal, ) `+
            ` values(${codPaciente}, ${codTipoExame}, ${valorExame}, '${dataLancamento}', '${dataCancel}', ${codUsuario}, '${recebido}', ${valorTotal}, )`, res)
    })

    //ATUALIZAR
    router.patch('/livrofinanceiro/:id', (req,res) =>{
        const id = parseInt(req.params.id)
        const codPaciente = req.body.codPaciente
        const codTipoExame = req.body.codTipoExame
        const valorExame = req.body.valorExame
        const dataLancamento = req.body.dataLancamento
        const dataCancel = req.body.dataCancel
        const codUsuario = req.body.codUsuario
        const recebido = req.body.recebido.substring(0,1)
        const valorTotal = req.body.valorTotal
        
        execSQLQuery(`update livrofinanceiro set codPaciente = ${codPaciente}, codTipoExame = ${codTipoExame}, valorExame = ${valorExame}, dataLancamento = '${dataLancamento}', `+
            `dataCancel = '${dataCancel}', codUsuario = ${codUsuario}, recebido = '${recebido}', valorTotal = ${valorTotal},   where codLivro = ${id}`, res)
    })
    server.use('/', router)
}