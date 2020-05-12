const express = require('express')
execSQLQuery = require('../cadastros/cadastro')

module.exports = function(server) {
    const router = express.Router() 
    //CRUD relexames

    //READ ALL
    var sql = 'SELECT * FROM relexames'
    router.get('/relexames', (req, res) => {execSQLQuery(sql, res)})

    //READ POR ID
    router.get('/relexames/:id?', (req, res) => {
        let filter = ''
        if(req.params.id) filter = ' WHERE id = ' + req.params.id;
        execSQLQuery(sql + filter, res)})

    //DELETE POR ID
    router.delete('/relexames/:id', (req, res) =>{
        execSQLQuery('DELETE FROM relexames where id = ' + parseInt(req.params.id), res)
    })

    //INSERIR 
    router.post('/relexames', (req,res) =>{
        const Data = req.body.Data
        const Nome = req.body.Nome.substring(0,100)
        const tipoExame = req.body.tipoExame.substring(0,30)
        const classe = req.body.classe.substring(0,30)
        const Categoria = req.body.Categoria.substring(0,3)
        const resultado = req.body.resultado.substring(0,20)
        const valorExame = parseFloat(req.body.valorExame)
        const cpfPaciente = req.body.cpfPaciente.substring(0,15)
        const codResultado = req.body.codResultado
        
        
        execSQLQuery(`INSERT INTO relexames(Data, Nome, tipoExame, classe, Categoria, resultado, valorExame, cpfPaciente, codResultado) `+
        ` values('${Data}', '${Nome}', '${tipoExame}', '${classe}', '${Categoria}', '${resultado}', ${valorExame}, '${cpfPaciente}', '${codResultado}')`, res)
    })

    //ATUALIZAR
    router.patch('/relexames/:id', (req,res) =>{
        const id = parseInt(req.params.id)
        const Data = req.body.Data
        const Nome = req.body.Nome.substring(0,100)
        const tipoExame = req.body.tipoExame.substring(0,30)
        const classe = req.body.classe.substring(0,30)
        const Categoria = req.body.Categoria.substring(0,3)
        const resultado = req.body.resultado.substring(0,20)
        const valorExame = parseFloat(req.body.valorExame)
        const cpfPaciente = req.body.cpfPaciente.substring(0,15)
        const codResultado = req.body.codResultado
        
        execSQLQuery(`update relexames set Data = '${Data}, Nome = '${Nome}', tipoExame = '${tipoExame}', classe = '${classe}', Categoria = '${Categoria}', `+
        + ` resultado = '${resultado}', valorExame = ${valorExame}, cpfPaciente = '${cpfPaciente}', codResultado = '${codResultado}'  where id = ${id}`, res)
    })
    server.use('/', router)
}