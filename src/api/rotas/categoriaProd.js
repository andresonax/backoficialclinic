const conection = require('../../config/database')
const express = require('express')


module.exports = function (server) {
    const router = express.Router()
    //CRUD categoriaProd

    //READ ALL
    router.get('/categoriaProd', (req, res) => { 
        var sql = 'SELECT * FROM categoria'
        conection.query(sql, (error, results, fields) => {
            if (error)
                res.json(error);
            else
                res.json(results);
        });
    })

    //READ POR ID
    router.get('/categoriaProd/:id?', (req, res) => {
        if(req.params.id){
            const id = parseInt(req.params.id);
            conection.query("SELECT * FROM categoria WHERE id_categoria = ?", [id], (error, results, fields) => {
                if (error)
                    res.json(error);
                else
                    res.json(results);
            });
        }
    })

    //DELETE POR ID
    router.delete('/categoriaProd/:id', (req, res) => {
        const id = parseInt(req.params.id);
        conection.query("DELETE FROM categoria where id_categoria = ?", [id], (error, results, fields) => {
            if (error)
                res.json(error);
            else
                res.json(results);
        });
    })

    //INSERIR 
    router.post('/categoriaProd', (req, res) => {
        const nome = req.body.nome.substring(0, 30);
        conection.query("INSERT INTO categoria(nome_categoria) values(?)", [nome], (error, results, fields) => {
            if (error)
                res.json(error);
            else
                res.json(results);
        });
    })

    //ATUALIZAR
    router.patch('/categoriaProd/:id', (req, res) => {
        const id = parseInt(req.params.id)
        const nome = req.body.nome.substring(0, 30)
        conection.query("UPDATE categoria SET nome_categoria = ? WHERE id_categoria = ?", [nome,id], (error, results, fields) => {
            if (error)
                res.json(error);
            else
                res.json(results);
        });
    })
    server.use('/', router)
}