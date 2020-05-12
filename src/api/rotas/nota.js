const conection = require('../../config/database')
const express = require('express')


module.exports = function (server) {
    const router = express.Router()
    //CRUD nota

    //READ ALL
    router.get('/nota', (req, res) => {
        var sql = 'SELECT * FROM nota A INNER JOIN fornecedor B ON A.id_fornecedor = B.id_fornecedor'
        conection.query(sql, (error, results, fields) => {
            if (error)
                res.json(error);
            else
                res.json(results);
        });
    })

    //READ POR ID 
    router.get('/nota/:id?', (req, res) => {
        if (req.params.id) {
            const id = parseInt(req.params.id);
            conection.query("SELECT * FROM nota A INNER JOIN fornecedor B ON A.id_fornecedor = B.id_fornecedor WHERE A.cod_nota = ?", [id], (error, results, fields) => {
                if (error)
                    res.json(error);
                else {
                    if (results.length != 1) {
                        res.json(results);
                    } else {
                        conection.query("SELECT * FROM item A INNER JOIN produto_detail B ON A.cod_produto = B.id_produto WHERE A.cod_nota = ?", id, (e, r, f) => {
                            if (e)
                                res.json(e);
                            else {
                                results[0].produtos = r;
                                res.json(results);
                            }
                        })
                    }
                }
            });
        }
    })

    //DELETE POR ID
    router.delete('/nota/:id', (req, res) => {
        const id = parseInt(req.params.id);
        conection.query("DELETE FROM nota where cod_nota = ?", [id], (error, results, fields) => {
            if (error)
                res.json(error);
            else
                res.json(results);
        });
    })

    //INSERIR 
    router.post('/nota', (req, res) => {
        const numero_nota = req.body.numero_nota.substring(0, 10);
        const id_fornecedor = req.body.id_fornecedor;
        const data_nota = parseInt(req.body.data_nota);
        const date = new Date(data_nota);

        conection.query("INSERT INTO nota(numero_nota, id_fornecedor, data_nota) values(?,?,?)", [numero_nota, id_fornecedor, date], (error, results, fields) => {
            if (error)
                res.json(error);
            else
                res.json(results);
        });
    })

    //INSERIR PRODUTOS A NOTA
    router.post('/nota/:id/produtos', (req, res) => {
        const id = parseInt(req.params.id);
        const produtos = req.body.produtos;
        let array;
        try {
            array = JSON.parse(produtos);
            array.forEach(element => {
                element.push(id);
            });
        } catch (e) {
            array = [];
        }

        conection.query("INSERT INTO item(valor_item,cod_produto,quantidade, cod_nota) VALUES ?", [array], (error, results, fields) => {
            if (error)
                res.json(error);
            else
                res.json(results);
        });
    })

    //ATUALIZAR
    router.patch('/nota/:id', (req, res) => {
        const id = parseInt(req.params.id)
        const numero_nota = req.body.numero_nota.substring(0, 10);
        const id_fornecedor = req.body.id_fornecedor;
        const data_nota = parseInt(req.body.data_nota);
        const date = new Date(data_nota);
        conection.query("UPDATE nota SET numero_nota = ?, id_fornecedor = ?, data_nota = ? WHERE cod_nota = ?", [numero_nota, id_fornecedor, date, id], (error, results, fields) => {
            if (error)
                res.json(error);
            else
                res.json(results);
        });
    })
    server.use('/', router)
}