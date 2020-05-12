const express = require('express')
execSQLQuery = require('../cadastros/cadastro')
const conection = require('../../config/database')
const bcrypt = require('bcryptjs')

module.exports = function(server) {
    const router = express.Router() 
    //CRUD usuarios

    //READ ALL
    var sql = `SELECT usuarios.*, setor.*, perfis.*, '' as senhaAtual, '' as novaSenha, '' as confirmarSenha FROM usuarios inner join setor on usuarios.id_setor = setor.id_setor inner join perfis on usuarios.codperfil = perfis.codperfil`
    router.get('/usuarios', (req, res) => {execSQLQuery(sql, res)})

    //READ POR ID
    router.get('/usuarios/:id?', (req, res) => {
        let filter = ''
        if(req.params.id) filter = ' WHERE codUsuario = ' + req.params.id;
        execSQLQuery(sql + filter, res)})

    
    //CHECAR LOGIN
    router.post('/checkUsuarios', (req, res) => {

        let sql = `SELECT codUsuario as \`key\`, codUsuario, nome, cargo, crm, '/cadastros/usuarios/0.png' as imagem, crp, ` +
            ` descPerfil FROM usuarios inner join perfis on usuarios.codPerfil = perfis.codPerfil  WHERE LOGIN = '${req.body.userName}' AND SENHA = '${req.body.password}'`

            conection.query(sql, function(error, results, fields){
            if(error){
                res.json(error)
               
            }
            else  {
                let retorno = {
                    "status": "error",
                    "type": "account",
                    "currentAuthority": "erro",
                }  

                let usuarioCorrente = results[0]
                if(results[0]){
                    if(usuarioCorrente.descPerfil === 'admin') usuarioCorrente.imagem = '/cadastros/usuarios/admin.png'
                    if(usuarioCorrente.descPerfil === 'secretaria') usuarioCorrente.imagem = '/cadastros/usuarios/secretaria.png'
                    if(usuarioCorrente.descPerfil === 'medico') usuarioCorrente.imagem = '/cadastros/usuarios/medico.png'
                    if(usuarioCorrente.descPerfil === 'psicologo') usuarioCorrente.imagem = '/cadastros/usuarios/psicologo.png'
                }
                if(results.length > 0) {
                retorno = {
                        "status": "ok",
                        "type": "account",
                        "currentAuthority": usuarioCorrente.descPerfil ? usuarioCorrente.descPerfil : '',
                        "usuarioCorrente" : results[0]
                    } }
                   
                res.json(retorno)

            }
            }) 
       
        
       
    })
    router.post('/alterarSenha', (req, res) => {
        let {novaSenha, codUsuario} = req.body
        var salt = bcrypt.genSaltSync(10);
        var hash = bcrypt.hashSync(novaSenha, salt);
        let sql = `update usuarios set senha = '${hash}' where codUsuario = ${codUsuario}`
        conection.query(sql, function(error, results, fields){
            if(error)
                res.json(error)
            else  {
                res.json('ok')
            }
            }) 
       
        
       
    })

    //DELETE POR ID
    router.delete('/usuarios/:id', (req, res) =>{
        execSQLQuery('DELETE FROM usuarios where codUsuario = ' + parseInt(req.params.id), res)
    })

    //INSERIR 
    router.post('/usuarios', (req,res) =>{

        const nome = req.body.nome.substring(0,70)
        const login = req.body.login.substring(0,10)
        const senha = req.body.senha.substring(0,50)
        const codPerfil = req.body.perfil
        const id_setor = req.body.setor
        const cargo = req.body.cargo.substring(0,20)
        const crm = req.body.crm.substring(0,10)
        const crp = req.body.crp.substring(0,10)
        
        execSQLQuery(`INSERT INTO usuarios(nome, id_setor, login, senha, codPerfil, cargo, crm, crp ) `+
            ` values('${nome}', '${id_setor}', '${login}', '${senha}', ${codPerfil}, '${cargo}', '${crm}', '${crp}')`, res)
    })

    //ATUALIZAR
    router.patch('/usuarios/:id', (req,res) =>{
        const id = parseInt(req.params.id)
        const nome = req.body.nome.substring(0,70)
        const login = req.body.login.substring(0,10)
        const senha = req.body.senha.substring(0,50)
        const codPerfil = req.body.codPerfil
        const cargo = req.body.cargo.substring(0,20)
        const crm = req.body.crm.substring(0,10)
        const crp = req.body.crp.substring(0,10)
        const alterarProx = req.body.alterarProx
        
        execSQLQuery(`update usuarios set nome = '${nome}', login = '${login}', senha = '${senha}', codPerfil = '${codPerfil}', `+
        ` cargo = '${cargo}', crm = '${crm}', crp = '${crp}', alterarProx = '${alterarProx}' where codUsuario = ${id}`, res)
    })
    server.use('/', router)
}