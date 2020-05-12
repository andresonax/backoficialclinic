const conection = require('../../config/database')
const express = require('express')


module.exports = function (server) {
    const router = express.Router()
    //CRUD pedido

    //READ ALL
    router.get('/pedido', (req, res) => { 
        var sql = 'SELECT A.cod_pedido, A.quantidade_pedida, A.id_usuario, A.cod_produto, A.data_pedido, A.obs, A.flag_baixa, B.login, B.perfil, B.setor, B.ativo, C.nome_setor FROM pedido A INNER JOIN usuario B ON A.id_usuario = B.id_usuario INNER JOIN setor C ON B.setor = C.id_setor GROUP BY cod_pedido'
        conection.query(sql, (error, results, fields) => {
            if (error)
                res.json(error);
            else
                res.json(results);
        });
    })

    //READ POR ID 
    router.get('/pedido/:id?', (req, res) => {
        if(req.params.id){
            const id = parseInt(req.params.id);
            conection.query("SELECT A.cod_pedido, A.quantidade_pedida, A.id_usuario, A.cod_produto, A.data_pedido, A.obs, A.flag_baixa, B.login, B.perfil, B.setor, B.ativo, C.nome_setor FROM pedido A INNER JOIN usuario B ON A.id_usuario = B.id_usuario INNER JOIN setor C ON B.setor = C.id_setor WHERE A.cod_pedido = ? GROUP BY A.cod_pedido", [id], (error, results, fields) => {
                if (error)
                    res.json(error);
                else{
                    if(results.length !=1){
                        res.json(results);
                    }else{
                        conection.query("SELECT * FROM item_pedido A INNER JOIN produto_detail B ON A.cod_produto = B.id_produto WHERE A.cod_pedido = ?",id,(e,r,f)=>{
                            if(e)
                                res.json(e);
                            else{
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
    router.delete('/pedido/:id', (req, res) => {
        const id = parseInt(req.params.id);
        conection.query("DELETE FROM pedido where cod_pedido = ?", [id], (error, results, fields) => {
            if (error)
                res.json(error);
            else
                res.json(results);
        });
    })

    //INSERIR PRODUTOS AO PEDIDO
    router.post('/pedido/:id/produtos',(req,res)=>{
        const id = parseInt(req.params.id);
        const produtos = req.body.produtos;
        let array;
        try{
            array = JSON.parse(produtos);
            array.forEach(element => {
                element.push(id);
            });
        }catch(e){
            array = [];
        }
        
        conection.query("INSERT INTO item_pedido(cod_produto,quantidade, cod_pedido) VALUES ?", [array], (error, results, fields) => {
            if (error)
                res.json(error);
            else
                res.json(results);
        });
    })

    //INSERIR 
    router.post('/pedido', (req, res) => {
        const obs = req.body.obs.substring(0, 180);
        const id_usuario = req.body.id_usuario;
        const data_pedido = parseInt(req.body.data_pedido);
        const date = new Date(data_pedido);

        conection.query("INSERT INTO pedido(obs,id_usuario, data_pedido) values(?,?,?)", [obs, id_usuario,date], (error, results, fields) => {
            if (error)
                res.json(error);
            else
                res.json(results);
        });
    })

    //ATUALIZAR
    router.patch('/pedido/:id', (req, res) => {
        const id = parseInt(req.params.id)
        const obs = req.body.obs.substring(0, 180);
        const id_usuario = req.body.id_usuario;
        const data_pedido = parseInt(req.body.data_pedido);
        const date = new Date(data_pedido);
        conection.query("UPDATE pedido SET obs = ?, id_usuario = ?, data_pedido = ? WHERE cod_pedido = ?", [obs,id_usuario,date,id], (error, results, fields) => {
            if (error)
                res.json(error);
            else
                res.json(results);
        });
    })
    server.use('/', router)
}