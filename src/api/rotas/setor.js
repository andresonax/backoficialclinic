const conection = require('../../config/database')
const express = require('express')


module.exports = function (server) {
    const router = express.Router()
    //CRUD setor

    //READ ALL
    router.get('/setor', (req, res) => { 
        var sql = 'SELECT * FROM setor'
        conection.query(sql, (error, results, fields) => {
            if (error)
                res.json(error);
            else
                res.json(results);
        });
    })

    //READ POR ID
    router.get('/setor/:id?', (req, res) => {
        if(req.params.id){
            const id = parseInt(req.params.id);
            conection.query("SELECT * FROM setor WHERE id_setor = ?", [id], (error, results, fields) => {
                if (error)
                    res.json(error);
                else
                    res.json(results);
            });
        }
    })

    //DELETE POR ID
    router.delete('/setor/:id', (req, res) => {
        const id = parseInt(req.params.id);
        conection.query("DELETE FROM setor where id_setor = ?", [id], (error, results, fields) => {
            if (error)
                res.json(error);
            else
                res.json(results);
        });
    })

    //INSERIR 
    router.post('/setor', (req, res) => {
        const nome = req.body.nome.substring(0, 30);
        conection.query("INSERT INTO setor(nome_setor) values(?)", [nome], (error, results, fields) => {
            if (error)
                res.json(error);
            else
                res.json(results);
        });
    })

    //ATUALIZAR
    router.patch('/setor/:id', (req, res) => {
        const id = parseInt(req.params.id)
        const nome = req.body.nome.substring(0, 30)
        conection.query("UPDATE setor SET nome_setor = ? WHERE id_setor = ?", [nome,id], (error, results, fields) => {
            if (error)
                res.json(error);
            else
                res.json(results);
        });
    })
    server.use('/', router)
}