const conection = require('../../config/database')
const express = require('express')


module.exports = function (server) {
    const router = express.Router()
    //CRUD categoriaProd

    //READ ALL
    router.get('/categoriafinanceiro', (req, res) => { 
        var sql = 'SELECT * FROM categoriafinanceiro'
        conection.query(sql, (error, results, fields) => {
            if (error)
                res.json(error);
            else
                res.json(results);
        });
    })

    //READ POR ID
    router.get('/categoriafinanceiro/:id?', (req, res) => {
        if(req.params.id){
            const id = parseInt(req.params.id);
            conection.query("SELECT * FROM categoriafinanceiro WHERE id_categoria = ?", [id], (error, results, fields) => {
                if (error)
                    res.json(error);
                else
                    res.json(results);
            });
        }
    })
    //READ POR tipo
    router.get('/categoriafinanceirotipo/:id?', (req, res) => {
        if(req.params.id){
            const id = req.params.id.substring(0,1);
            conection.query("SELECT * FROM categoriafinanceiro WHERE tipo = ?", [id], (error, results, fields) => {
                if (error)
                    res.json(error);
                else
                    res.json(results);
            });
        }
    })

    //DELETE POR ID
    router.delete('/categoriafinanceiro/:id', (req, res) => {
        const id = parseInt(req.params.id);
        conection.query("DELETE FROM categoriafinanceiro where id_categoria = ?", [id], (error, results, fields) => {
            if (error)
                res.json(error);
            else
                res.json(results);
        });
    })

    //INSERIR 
    router.post('/categoriafinanceiro', (req, res) => {
        const descricao = req.body.descricao.substring(0, 30);
        const tipo = req.body.tipo.substring(0, 30);
        conection.query("INSERT INTO categoriafinanceiro(descricao, tipo) values(?,?)", [descricao,tipo], (error, results, fields) => {
            if (error)
                res.json(error);
            else
                res.json(results);
        });
    })

    //ATUALIZAR
    router.patch('/categoriafinanceiro/:id', (req, res) => {
        const id = parseInt(req.params.id)
        const nome = req.body.nome.substring(0, 30)
        const tipo = req.body.tipo.substring(0, 30);
        conection.query("UPDATE categoriafinanceiro SET nome_categoria = ?, tipo = ? WHERE id_categoria = ?", [nome, tipo,id], (error, results, fields) => {
            if (error)
                res.json(error);
            else
                res.json(results);
        });
    })
    server.use('/', router)
}