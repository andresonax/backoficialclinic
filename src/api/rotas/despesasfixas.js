const express = require('express')
execSQLQuery = require('../cadastros/cadastro')
const moment = require('moment')

module.exports = function(server) {
    const router = express.Router() 
    //CRUD cadpais

    //READ ALL
    var sql = `SELECT despesasfixas.*, fornecedor.razao_social, categoriafinanceiro.descricao as desc_financeiro FROM despesasfixas `+
    ` inner join categoriafinanceiro on despesasfixas.id_categoria = categoriafinanceiro.id_categoria ` +
    ` inner join fornecedor on despesasfixas.id_cli_for = fornecedor.id_fornecedor `
    router.get('/despesas', (req, res) => {execSQLQuery(sql, res)})

    //READ POR ID
    router.get('/despesasfixas/:id?', (req, res) => {
        let filter = ''
        if(req.params.id) filter = ' WHERE id_fixa = ' + req.params.id;
        execSQLQuery(sql + filter, res)})

    //DELETE POR ID
    router.delete('/despesasfixas/:id', (req, res) =>{
        execSQLQuery('DELETE FROM despesas where id_fixa = ' + parseInt(req.params.id), res)
    })

    //INSERIR 
    router.post('/despesasfixas', (req,res) =>{
        const id_categoria = req.body.categoria
        const id_cli_for = req.body.fornecedor
        const descricao = req.body.descricao.substring(0,150)
        const dataInicial = moment(req.body.dataInicial).format('YYYY-MM-DD')
        const dataFinal = moment(req.body.dataFinal).format('YYYY-MM-DD')
        const valor = parseFloat(req.body.valorPrevisto)
        const tipoRepeticao = req.body.tipoRepeticao.substring(0,2)
        
        execSQLQuery(`INSERT INTO despesasfixas(id_categoria, id_cli_for, descricao, dataInicial, dataFinal , valor,tipoRepeticao) ` +
        ` values(${id_categoria},${id_cli_for},'${descricao}','${dataInicial}','${dataFinal}',${valor},'${tipoRepeticao}')`, res)
    })

    //ATUALIZAR
    router.patch('/despesasfixas/:id', (req,res) =>{
        const id = req.params.id
        const id_categoria = req.body.id_categoria
        const id_cli_for = req.body.id_cli_for
        const descricao = req.body.descricao.substring(0,150)
        const dataInicial = moment(req.body.dataInicial).format('YYYY-MM-DD')
        const dataFinal = moment(req.body.dataFinal).format('YYYY-MM-DD')
        const valor = parseFloat(req.body.valor)
        const tipoRepeticao = req.body.tipoRepeticao.substring(0,2)
        execSQLQuery(`update despesasfixas set id_categoria = ${id_categoria}, id_cli_for = ${id_cli_for}, descricao = '${descricao}', dataInicial = '${dataInicial}', dataFinal = '${dataFinal}', `+
        ` valor = ${valor},tipoRepeticao = '${tipoRepeticao}' where id_fixas = ${id}`, res)
    })
    server.use('/', router)
}