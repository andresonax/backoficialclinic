const express = require('express')
execSQLQuery = require('../cadastros/cadastro')
const moment = require('moment')

module.exports = function(server) {
    const router = express.Router() 
    //CRUD cadpais

    //READ ALL
    var sql = 'SELECT receitas.*, fornecedor.razao_social, categoriafinanceiro.descricao as desc_financeiro FROM receitas inner join categoriafinanceiro on receitas.id_categoria = categoriafinanceiro.id_categoria inner join fornecedor on receitas.id_cli_for = fornecedor.id_fornecedor'
    router.get('/receitas', (req, res) => {execSQLQuery(sql, res)})

    //READ POR ID
    router.get('/receitas/:id?', (req, res) => {
        let filter = ''
        if(req.params.id) filter = ' WHERE id_receber = ' + req.params.id;
        execSQLQuery(sql + filter, res)})

    //DELETE POR ID
    router.delete('/receitas/:id', (req, res) =>{
        execSQLQuery('DELETE FROM receitas where id_receber = ' + parseInt(req.params.id), res)
    })

    //INSERIR 
    router.post('/receitas', (req,res) =>{
        const id_categoria = req.body.categoria
        const id_cli_for = req.body.fornecedor
        const descricao = req.body.descricao.substring(0,150)
        const dataRecebimento = moment(req.body.dataRecebimento).format('YYYY-MM-DD')
        const valorPrevisto = parseFloat(req.body.valorPrevisto)
        const observacao = req.body.observacao.substring(0,250)
        const anexo = req.body.anexo ? req.body.anexo : ''
        execSQLQuery(`INSERT INTO receitas(id_categoria, id_cli_for, descricao, dataRecebimento,valorPrevisto,observacao,anexo) ` +
        ` values(${id_categoria},${id_cli_for},'${descricao}','${dataRecebimento}',${valorPrevisto},'${observacao}', '${anexo}')`, res)
    })

    //ATUALIZAR
    router.patch('/receitas/:id', (req,res) =>{
        const id = req.params.id
        const id_categoria = req.body.id_categoria
        const id_cli_for = req.body.id_cli_for
        const descricao = req.body.descricao.substring(0,150)
        const dataRecebimento = moment(req.body.dataRecebimento).format('YYYY-MM-DD')
        const valorPrevisto = parseFloat(req.body.valorPrevisto)
        const observacao = req.body.observacao.substring(0,250)
        const anexo = req.body.anexo ? req.body.anexo : ''
        execSQLQuery(`update receitas set id_categoria = ${id_categoria}, id_cli_for = ${id_cli_for}, descricao = '${descricao}', dataRecebimento = '${dataRecebimento}', `+
        ` valorPrevisto = ${valorPrevisto},observacao = '${observacao}',anexo = '${anexo}'  where id_receber = ${id}`, res)
    })
    server.use('/', router)
}