const conection = require('../../config/database')
const express = require('express')


module.exports = function (server) {
    const router = express.Router()
    //CRUD estoque

    //READ ALL
    router.get('/estoque', (req, res) => {
        var sql = 'SELECT * FROM estoque A INNER JOIN produto_detail B ON A.produto = B.id_produto'
        conection.query(sql, (error, results, fields) => {
            if (error)
                res.json(error);
            else
                res.json(results);
        });
    })
    //READ POR ID PRODUTO
    router.get('/estoque/:id_prod?', (req, res) => {
        if (req.params.id_prod) {
            const id_prod = parseInt(req.params.id_prod);
            conection.query("SELECT * FROM estoque A INNER JOIN produto_detail B ON A.produto = B.id_produto WHERE A.produto = ?", [id_prod], (error, results, fields) => {
                if (error)
                    res.json(error);
                else
                    res.json(results);
            });
        }
    })

    //DELETE POR ID PRODUTO
    router.delete('/estoque/:id_prod', (req, res) => {
        const id_prod = parseInt(req.params.id_prod);
        conection.query("DELETE FROM estoque where produto = ?", [id_prod], (error, results, fields) => {
            if (error)
                res.json(error);
            else
                res.json(results);
        });
    })

    //ADICIONAR PRODUTO
    router.post('/estoque/add', (req, res) => {
        const quantidade = req.body.quantidade;
        const produto = req.body.produto;

        conection.query("INSERT INTO estoque (quantidade,produto) VALUES(?,?) ON DUPLICATE KEY UPDATE quantidade = quantidade + ?", [quantidade,produto,quantidade], (error, results, fields) => {
            if (error)
                res.json(error);
            else
                res.json(results);
        });
    })

    //REMOVER PRODUTO
    router.post('/estoque/remove', (req, res) => {
        const quantidade = -1 * parseInt(req.body.quantidade);
        const produto = req.body.produto;

        conection.query("INSERT INTO estoque (quantidade,produto) VALUES(?,?) ON DUPLICATE KEY UPDATE quantidade = quantidade + ?", [quantidade,produto,quantidade], (error, results, fields) => {
            if (error)
                res.json(error);
            else{
                res.json(results);
                conection.query("SELECT * FROM estoque WHERE produto = ?", [produto], (error, results, fields) => {
                    if (error){}
                       
                    else{
                        if(results[0].quantidade<=0){
                            conection.query("DELETE FROM estoque where produto = ?", [produto], (error, results, fields) => {
                                if (error){}
                                   
                            });
                        }
                    }
                });
            }
        });
    })

    //ATUALIZAR
    router.patch('/estoque/:id', (req, res) => {
        const id = req.params.id;
        const quantidade = req.body.quantidade;
        const produto = req.body.produto;
        conection.query("UPDATE estoque SET quantidade = ?, produto = ? WHERE id_estoque = ?", [quantidade,produto,id], (error, results, fields) => {
            if (error)
                res.json(error);
            else
                res.json(results);
        });
    })
    server.use('/', router)
}