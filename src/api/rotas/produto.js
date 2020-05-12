const conection = require('../../config/database')
const express = require('express')


module.exports = function (server) {
    const router = express.Router()
    //CRUD produto

    //READ ALL
    router.get('/produto', (req, res) => {
        var sql = 'SELECT A.id_produto, A.codigo, A.nome_produto, A.qtd_minima, A.unidade, A.categoria, B.nome_categoria, C.valor_unidade FROM produto A INNER JOIN categoria B ON A.categoria = B.id_categoria INNER JOIN unidade C ON A.unidade = C.id_unidade GROUP by A.id_produto'
        conection.query(sql, (error, results, fields) => {
            if (error)
                res.json(error);
            else
                res.json(results);
        });
    })
    //READ POR ID
    router.get('/produto/:id?', (req, res) => {
        if (req.params.id) {
            const id = parseInt(req.params.id);
            conection.query("SELECT A.id_produto, A.codigo, A.nome_produto, A.qtd_minima, A.unidade, A.categoria, B.nome_categoria, C.valor_unidade FROM produto A INNER JOIN categoria B ON A.categoria = B.id_categoria INNER JOIN unidade C ON A.unidade = C.id_unidade WHERE A.id_produto = ? GROUP by A.id_produto", [id], (error, results, fields) => {
                if (error)
                    res.json(error);
                else
                    res.json(results);
            });
        }
    })

    //DELETE POR ID
    router.delete('/produto/:id', (req, res) => {
        const id = parseInt(req.params.id);
        conection.query("DELETE FROM produto where id_produto = ?", [id], (error, results, fields) => {
            if (error)
                res.json(error);
            else
                res.json(results);
        });
    })

    //INSERIR 
    router.post('/produto', (req, res) => {
        const codigo = req.body.codigo.substring(0, 6);
        const nome_produto = req.body.nome_produto.substring(0, 50);
        const qtd_minima = req.body.qtd_minima;
        const unidade = req.body.unidade;
        const categoria = req.body.categoria;

        conection.query("INSERT INTO produto(codigo,nome_produto,qtd_minima,unidade,categoria) values(?,?,?,?,?)", [codigo, nome_produto, qtd_minima, unidade, categoria], (error, results, fields) => {
            if (error)
                res.json(error);
            else
                res.json(results);
        });
    })

    //ATUALIZAR
    router.patch('/produto/:id', (req, res) => {
        const id = parseInt(req.params.id)
        const codigo = req.body.codigo.substring(0, 6);
        const nome_produto = req.body.nome_produto.substring(0, 50);
        const qtd_minima = req.body.qtd_minima;
        const unidade = req.body.unidade;
        const categoria = req.body.categoria;
        conection.query("UPDATE produto SET codigo = ?, nome_produto = ?, qtd_minima = ?, unidade = ?, categoria = ? WHERE id_produto = ?", [codigo, nome_produto, qtd_minima, unidade, categoria, id], (error, results, fields) => {
            if (error)
                res.json(error);
            else
                res.json(results);
        });
    })
    server.use('/', router)
}