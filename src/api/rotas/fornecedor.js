const conection = require('../../config/database')
const express = require('express')


module.exports = function (server) {
    const router = express.Router()
    //CRUD fornecedor

    //READ ALL
    router.get('/fornecedor', (req, res) => { 
        var sql = 'SELECT * FROM fornecedor'
        conection.query(sql, (error, results, fields) => {
            if (error)
                res.json(error);
            else
                res.json(results);
        });
    })

    //READ POR ID
    router.get('/fornecedor/:id?', (req, res) => {
        if(req.params.id){
            const id = parseInt(req.params.id);
            conection.query("SELECT * FROM fornecedor WHERE id_fornecedor = ?", [id], (error, results, fields) => {
                if (error)
                    res.json(error);
                else
                    res.json(results);
            });
        }
    })

    //DELETE POR ID
    router.delete('/fornecedor/:id', (req, res) => {
        const id = parseInt(req.params.id);
        conection.query("DELETE FROM fornecedor where id_fornecedor = ?", [id], (error, results, fields) => {
            if (error)
                res.json(error);
            else
                res.json(results);
        });
    })

    //INSERIR 
    router.post('/fornecedor', (req, res) => {
        const cnpj = req.body.cnpj.substring(0, 14);
        const razao_social = req.body.razao_social.substring(0, 100);
        const telefone = req.body.telefone.substring(0, 10);

        conection.query("INSERT INTO fornecedor(cnpj,razao_social,telefone) values(?,?,?)", [cnpj,razao_social,telefone], (error, results, fields) => {
            if (error)
                res.json(error);
            else
                res.json(results);
        });
    })

    //ATUALIZAR
    router.patch('/fornecedor/:id', (req, res) => {
        const id = parseInt(req.params.id)
        const cnpj = req.body.cnpj.substring(0, 14);
        const razao_social = req.body.razao_social.substring(0, 100);
        const telefone = req.body.telefone.substring(0, 10);
        conection.query("UPDATE fornecedor SET cnpj = ?, razao_social = ? , telefone = ? WHERE id_fornecedor = ?", [cnpj,razao_social,telefone,id], (error, results, fields) => {
            if (error)
                res.json(error);
            else
                res.json(results);
        });
    })
    server.use('/', router)
}