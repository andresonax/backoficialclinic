const conection = require('../../config/database')
const express = require('express')


module.exports = function (server) {
    const router = express.Router()
    //CRUD usuario

    //READ ALL
    router.get('/usuario', (req, res) => { 
        var sql = 'SELECT A.id_usuario, A.login, A.senha, A.perfil, A.setor, A.ativo, B.nome_setor FROM usuario A INNER JOIN setor B ON A.setor = B.id_setor'
        conection.query(sql, (error, results, fields) => {
            if (error)
                res.json(error);
            else
                res.json(results);
        });
    })
    //READ POR ID
    router.get('/usuario/:id?', (req, res) => {
        if(req.params.id){
            const id = parseInt(req.params.id);
            conection.query("SELECT A.id_usuario, A.login, A.senha, A.perfil, A.setor, A.ativo, B.nome_setor FROM usuario A INNER JOIN setor B ON A.setor = B.id_setor WHERE id_usuario = ?", [id], (error, results, fields) => {
                if (error)
                    res.json(error);
                else
                    res.json(results);
            });
        }
    })

    //DELETE POR ID
    router.delete('/usuario/:id', (req, res) => {
        const id = parseInt(req.params.id);
        conection.query("DELETE FROM usuario where id_usuario = ?", [id], (error, results, fields) => {
            if (error)
                res.json(error);
            else
                res.json(results);
        });
    })

    //INSERIR 
    router.post('/usuario', (req, res) => {
        const login = req.body.login.substring(0, 20);
        const senha = req.body.senha.substring(0, 10);
        const perfil = req.body.perfil;
        const setor = req.body.setor;
        conection.query("INSERT INTO usuario(login,senha,perfil,setor) values(?,?,?,?)", [login,senha,perfil,setor], (error, results, fields) => {
            if (error)
                res.json(error);
            else
                res.json(results);
        });
    })

    //ATUALIZAR
    router.patch('/usuario/:id', (req, res) => {
        const id = parseInt(req.params.id)
        const login = req.body.login.substring(0, 20);
        const senha = req.body.senha.substring(0, 10);
        const perfil = req.body.perfil;
        const setor = req.body.setor;
        conection.query("UPDATE usuario SET login = ?, senha = ?, perfil = ?, setor = ? WHERE id_usuario = ?", [login,senha,perfil,setor,id], (error, results, fields) => {
            if (error)
                res.json(error);
            else
                res.json(results);
        });
    })
    server.use('/', router)
}