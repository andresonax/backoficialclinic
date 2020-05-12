const express = require('express')
execSQLQuery = require('../cadastros/cadastro')

module.exports = function(server) {
    const router = express.Router() 
    //CRUD dmed

    //READ ALL
    var sql = 'SELECT * FROM dmed'
    router.get('/dmed', (req, res) => {execSQLQuery(sql, res)})

    //READ POR ID
    router.get('/dmed/:id?', (req, res) => {
        let filter = ''
        if(req.params.id) filter = ' WHERE Id = ' + req.params.id;
        execSQLQuery(sql + filter, res)})

    //DELETE POR ID
    router.delete('/dmed/:id', (req, res) =>{
        execSQLQuery('DELETE FROM dmed where Id = ' + parseInt(req.params.id), res)
    })

    //INSERIR 
    router.post('/dmed', (req,res) =>{
        const cpf = req.body.cpf.substring(0,11)
        const nome = req.body.nome.substring(0,60)
        const ddd = req.body.ddd.substring(0,2)
        const telefone = req.body.telefone.substring(0,8)
        const ramal = req.body.ramal.substring(0,6)
        const fax = req.body.fax.substring(0,8)
        const email = req.body.email.substring(0,50)
        const cpfPeranteCnpj = req.body.cpfPeranteCnpj.substring(0,11)
        const CNPJ = req.body.CNPJ.substring(0,14)
        const empresa = req.body.empresa.substring(0,150)
        
        execSQLQuery(`INSERT INTO dmed(cpf,nome, ddd, telefone, ramal, fax, email, cpfPeranteCnpj, CNPJ, empresa)  ` +
                    `values('${cpf}','${nome}','${ddd}','${telefone}','${ramal}','${fax}','${email}','${cpfPeranteCnpj}','${CNPJ}','${empresa}')`, res)
    })

    //ATUALIZAR
    router.patch('/dmed/:id', (req,res) =>{
        const id = parseInt(req.params.id)
        const cpf = req.body.cpf.substring(0,11)
        const nome = req.body.nome.substring(0,60)
        const ddd = req.body.ddd.substring(0,2)
        const telefone = req.body.telefone.substring(0,8)
        const ramal = req.body.ramal.substring(0,6)
        const fax = req.body.fax.substring(0,8)
        const email = req.body.email.substring(0,50)
        const cpfPeranteCnpj = req.body.cpfPeranteCnpj.substring(0,11)
        const CNPJ = req.body.CNPJ.substring(0,14)
        const empresa = req.body.empresa.substring(0,150)
        execSQLQuery(`update dmed set cpf = '${cpf}', nome = '${nome}', ddd = '${ddd}', `+
            ` telefone = '${telefone}', ramal = '${ramal}', fax = '${fax}', email = '${email}', cpfPeranteCnpj = '${cpfPeranteCnpj}', `+
            `CNPJ = '${CNPJ}', empresa = '${empresa}'  where Id = ${id}`, res)
    })
    server.use('/', router)
}