const express = require('express')
execSQLQuery = require('../cadastros/cadastro')
const conection = require('../../config/database')
const moment = require('moment')

module.exports = function(server) {
    const router = express.Router() 
    //CRUD filaatendimento

    //READ ALL
    var sql = 'SELECT * FROM filaatendimento'
    router.get('/filaatendimento', (req, res) => {execSQLQuery(sql, res)})
    
    //CARREGA FILA DIÁRIA
    
    router.post('/filaatendimentodiaria', (req, res) => {
        let sqlFila = `select codAtendimento, paciente.codPaciente, nomePaciente, descricaoExame, categoria, ` +
        `codDataPrev, concat(paciente.codPaciente,'.jpg') as avatar, TIMESTAMPDIFF (YEAR,nascPaciente,CURDATE()) as idade, codDataAtend, escolaridade.codEscolaridade, escolaridade.descEscolaridade, `+
        ` descexame.codDescExame, categoriacnh.codCategoria, descexame.valorExame,  sexoPaciente, docPaciente, orgaoPaciente, ufDoc, nascPaciente, nomeCidade, ufcidade, cpfPaciente, tipodoc.descricaoTipo  `+
        ` from paciente inner join filaatendimento on  `+
        ` paciente.codPaciente = filaatendimento.codPaciente inner join `+
        ` exdisponiveis on exdisponiveis.codExEscolhido = paciente.examePaciente `+
        ` inner join descexame on filaatendimento.codDescExame = descexame.codDescExame  ` +
        ` inner join categoriacnh on categoriacnh.codCategoria = paciente.cnhPretPaciente ` +
        ` left join escolaridade on paciente.codEscolaridade = escolaridade.codEscolaridade ` +
        ` inner join cadcidades on cadcidades.codCidade = paciente.naturalidade `+
        ` inner join tipodoc on tipodoc.codTipo = paciente.tipoDoc `
        const filtroNome = req.body.filtroNome
        const codTExame = req.body.codTExame
        const hoje = moment().format('YYYY-MM-DD HH:mm')
        let filtroTabela = ''
        if(req.body.filtroTabela === 'atendidos'){
            filtroTabela = ` codDataAtend is not null and codTExame = ${codTExame} and CONVERT(codDataPrev,date) = CONVERT('${hoje}', date) `
        } else if(req.body.filtroTabela === 'naoAtendidos'){
            filtroTabela = ` codDataAtend is null and codTExame = ${codTExame} and CONVERT(codDataPrev,date) = CONVERT('${hoje}', date) `
        } else if(req.body.filtroTabela === 'naoAnteriores'){
            filtroTabela = ` codDataAtend is null and codTExame = ${codTExame} and CONVERT(codDataPrev,date) <> CONVERT('${hoje}', date) `
        } else if(req.body.filtroTabela === 'anteriores'){
            filtroTabela = ` codDataAtend is not null and codTExame = ${codTExame} and CONVERT(codDataPrev,date) <> CONVERT('${hoje}', date) `
        }
        //console.log(req.body.filtroTabela)

        const filter = ` where ${filtroTabela}  and nomePaciente like '${filtroNome}%'`
        const ordena = req.body.ordem ? req.body.ordem === 'ascend' ? 'asc' : 'desc' : 'asc'
        const campo = req.body.campo ? req.body.campo : 'nomePaciente'
        const order = ` order by ${campo} ${ordena}`

        //console.log(sqlFila + filter + order)

        let sqlAgrupamentos = `;select count(paciente.codPaciente) as atendidos `+
                ` from paciente inner join filaatendimento on  `+
                ` paciente.codPaciente = filaatendimento.codPaciente inner join `+
                ` exdisponiveis on exdisponiveis.codExEscolhido = paciente.examePaciente `+
                ` inner join descexame on filaatendimento.codDescExame = descexame.codDescExame  ` +
                ` where codDataAtend is not null and codTExame = 0 and CONVERT(codDataPrev,date) = CONVERT('${hoje}', date);  `
        
        
        let sqlAgrupamentosNaoAtend = `select count(paciente.codPaciente) as naoAtendidos `+
            ` from paciente inner join filaatendimento on  `+
            ` paciente.codPaciente = filaatendimento.codPaciente inner join `+
            ` exdisponiveis on exdisponiveis.codExEscolhido = paciente.examePaciente `+
            ` inner join descexame on filaatendimento.codDescExame = descexame.codDescExame  ` +
            ` where codDataAtend is  null and codTExame = ${codTExame} and CONVERT(codDataPrev,date) = CONVERT('${hoje}', date) ;`
        
        let sqlAptos = ''
        let sqlOutros = ''
        let sqlTestes = ''
        let sqlParametros = ''
       
        if(Number(codTExame) === 0){
            sqlAptos = `select count(codExame) as aptos from examemedico `+
                     `where CONVERT(dataExame,date) = CONVERT('${hoje}', date) and codResultado = 6 ;`

            sqlOutros = `select count(codExame) as outros from examemedico `+
                     `where CONVERT(dataExame,date) = CONVERT('${hoje}', date) and codResultado <> 6 ;`
        } else {
            sqlAptos = `select count(codExPsico) as aptos from examepsico `+
                     `where CONVERT(dataExame,date) = CONVERT('${hoje}', date) and codResultado = 6 ;`

            sqlOutros = `select count(codExPsico) as outros from examepsico `+
                     `where CONVERT(dataExame,date) = CONVERT('${hoje}', date) and codResultado <> 6 ;`

            //somente para exames PSICOLÓGICOS
            sqlTestes = `select *  from testespsico order by tipoTeste, nome; `

            sqlParametros = 'select * from parametroslaudo'

            
        }
        
        

        conection.query(sqlFila + filter + order + sqlAgrupamentos + 
                        sqlAgrupamentosNaoAtend + sqlAptos + sqlOutros + 
                        sqlTestes + sqlParametros  , function(error, results, fields){
            var resultado = {
                data : [],
                atendidos : 0,
                naoAtendidos : 0,
                aptos : 0,
                outros : 0,
                examesAutomaticos : [],
                parametrosLaudo : {}
            }
            if(error){
              res.json(error)
              
            }
            if(results){
                resultado.data = results[0]
                resultado.atendidos = results[1][0].atendidos
                resultado.naoAtendidos = results[2][0].naoAtendidos
                resultado.aptos = results[3][0].aptos
                resultado.outros = results[4][0].outros
                Number(codTExame) === 1 ? resultado.parametrosLaudo = results[6][0] : resultado.parametrosLaudo = {}
                Number(codTExame) === 1 ? resultado.examesAutomaticos = results[5] : resultado.examesAutomaticos = []
                res.json(resultado)
            

            }
          })

        
    
    })
    //READ POR ID
    router.get('/filaatendimento/:id?', (req, res) => {
        let filter = ''
        if(req.params.id) filter = ' WHERE codAtendimento = ' + req.params.id;
        execSQLQuery(sql + filter, res)})

    //DELETE POR ID
    router.delete('/filaatendimento/:id', (req, res) =>{
        execSQLQuery('DELETE FROM filaatendimento where codAtendimento = ' + parseInt(req.params.id), res)
    })

    //INSERIR 
    router.post('/filaatendimento', (req,res) =>{
        const codDescExame = req.body.codDescExame
        const codPaciente = req.body.codPaciente
        const codCategoria = req.body.codCategoria
        const codDataPrev = req.body.codDataPrev
        const codDataAtend = req.body.codDataAtend
        
        execSQLQuery(`INSERT INTO filaatendimento(codDescExame, codPaciente, codCategoria, codDataPrev, codDataAtend) `+
        ` values(${codDescExame}, ${codPaciente}, ${codCategoria}, '${codDataPrev}', '${codDataAtend}',)`, res)
    })
    //Método axios para verificar se o sujeito está na fila externamente
    router.post('/verificafila', (req, res) =>{
        const codPaciente = req.body.codPaciente
        verificaFila(codPaciente, (resp) =>{
            res.send(resp)
        })
    })

    //busco valores que podem ser extornados caso confirme a retirada da lista
    buscaValores = (codPaciente, codDataPrev, callback) => {
        var dataFormatada = moment(codDataPrev).format('YYYY-MM-DD')
        var sqlValores = `SELECT * FROM livrofinanceiro WHERE CODPACIENTE = ${codPaciente} `+
                            ` and CONVERT(dataLancamento, date) = CONVERT('${dataFormatada}', date) ` 
        let resultado = {
            status : '',
            tipo : '',
            valores : undefined
        }

        conection.query(sqlValores, (error, results) =>{
            if(error){
                resultado.status ='erro',
                resultado.tipo = 'erroconecao',
                valores = []
                callback(error)
            }
            if(results){
                resultado.status = 'ok'
                resultado.tipo = 'valores'
                resultado.valores = results
                callback(resultado)
            }
        })
    }
    //abaixo verificação se ele está na fila e se estão encaminhando antes de atender
    router.post('/verificaanterior', (req, res) => {
        const codPaciente = req.body.dados.codPaciente
        var sqlAnterior = `select codPaciente, codDataPrev from filaatendimento where codPaciente = ${codPaciente} and coddataatend is null`
        conection.query(sqlAnterior ,(error, results) => {
            let resposta = {
                status : 'ok',
                tipo : '',
                valor : undefined
            }
            if(error){
                resposta.status = 'erro'
                resposta.tipo = 'erroconexao'
                resposta.valor = ['Falha na verificação, tentar encaminhar novamente']
                res.send(error)
            } 
            if(results){
                if(results.length > 0){
                    resposta.status = 'erro'
                    resposta.tipo = 'fila'
                    resposta.valor = results
                    //como existem lançamentos na fila vou aproveitar e mandar os valores
                    //que serão extornados caso eles retirem da fila
                    buscaValores(results[0].codPaciente, results[0].codDataPrev, (resultado) =>{
                        resposta.valoresFinanc = resultado.valores
                        res.send(resposta)
                    })
                } else {
                    resposta.status = 'ok'
                    resposta.tipo = 'ok'
                    resposta.valor = []
                    res.send(resposta)
                }
                
            }
            
        })

    })
    



    //procedimento para verificar se sujeito está na fila
    function verificaFila(codPaciente, callback){
        let sqlVerifica = 'SELECT codtexame FROM filaatendimento F INNER JOIN descexame D ON D.CODdescexame = F.CODdescexame '
        const hoje = moment().format('YYYY-MM-DD')
        const resultado = {
            status : 'ok',
            tipo : 'ok',
            infoMedico : '',
            infoPsico : ''
        }
        let filter = ` where F.codPaciente = ${codPaciente} and CONVERT(codDataPrev, date) = CONVERT('${hoje}', date)`
        conection.query(sqlVerifica + filter,(error, results) => {
            if(error){
                resultado.status = 'erro'
                resultado.tipo = 'erroconexao'
                resultado.medico = 'Erro Interno! Por favor encaminhe novamente!'
                callback(resultado)
            }
            if(results){
                if(results.length > 0){
                    if(results[1]){
                        resultado.status = 'erro'
                        resultado.infoMedico = 'existe'
                        resultado.tipo = 'erroambos'
                        resultado.infoPsico = 'existe'
                        callback(resultado)
                    } else {

                        if(results[0].codTExame === 0) {
                            resultado.status = 'erro'
                            resultado.infoMedico = 'existe'
                            resultado.tipo = 'erromedico'
                            callback(resultado)
                        } else {
                            resultado.status = 'erro'
                            resultado.infoPsico = 'existe'
                            resultado.tipo = 'erropsico'
                            callback(resultado)
                        }
                    }
                } else {
                    callback(resultado)
                }
            }
            
        })   
        
    }

    //retirar paciente da fila
    router.post('/retirarfila', (req, res) => {
        const sqlLivro = `update livrofinanceiro set dataCancel = '${moment(new Date()).format('YYYY-MM-DD HH:MM')}', codUsuario = ${req.body.usuario.codUsuario} `+
        ` where codPaciente = ${req.body.record.codPaciente} and codTipoExame = ${req.body.record.codDescExame};`
        const sqlFila = `delete from filaatendimento where codAtendimento = ${req.body.record.codAtendimento}`
       conection.query(sqlLivro + sqlFila, (error, results) =>{
           let resultado = {
               status : '',
               info : ''
           }
           if(error){
               resultado.status = 'erro'
               resultado.info = 'Falha de conexão. Favor tentar novamente!'
               res.send(resultado)
           }
           if(results){
               resultado.status = 'ok'
               resultado.info = 'Paciente retirado da Fila de Atendimento!'
               res.send(resultado)
           }
       })
    })
   
    //procedimento para inserir cidadão na fila de exames
    router.post('/inserefila', (req,res) => {
        //precisa comparar a data atual para comparar se não está na fila e para salvar a PREVISÃO DE ATENDIMENTO
        //MENSAGENS NECESSÁRIAS :
        //O Paciente já foi atendido neste exame médico hoje!
        //O Exame Médico, já foi encaminhado para este Paciente!
        //Este paciente já foi atendido, no exame psicológico hoje!
        //O Exame Psicológico, já foi encaminhado para este Paciente!
        /*
        	"codPaciente" : 1,
            "codDescExame" : 1,
            "codCategoria" : 1,
            "codUsario" : 1,
        */
       const codPaciente = req.body.codPaciente
       const codDescExameM = req.body.codDescExameM //se estiver em 0 só pediu exame psicológico
       const codDescExameP = req.body.codDescExameP //se estiver em 0 só pediu exame médico
       const codCategoria = req.body.codCategoria
       const codUsario = req.body.codUsuario
       const valorExameM = parseFloat(req.body.valorExameM)
       const valorExameP = parseFloat(req.body.valorExameP)
       const hoje = moment().format('YYYY-MM-DD HH:mm:ss')
       const resposta = {
            status : 'ok',
            info : ''
        }
        ///REPENSAR ESSE CÓDIGO COM CALMA!!!
       //vou fazer assim para tirar a possibilidade de inconsistencia 
       //se ele vai inserir os dois insiro os dois de uma vez ou insiro cada um!! estranho??? pra mim não!
       if(Number(codDescExameM) !== 0 && Number(codDescExameP !== 0)){
            let sqlambos = `insert into filaatendimento(codDescExame, codPaciente, codCategoria,` +
                      `  codDataPrev) values(${codDescExameM}, ${codPaciente}, ${codCategoria},'${hoje}'); ` +
                      ` insert into filaatendimento(codDescExame, codPaciente, codCategoria,` +
                      ` codDataPrev) values(${codDescExameP}, ${codPaciente}, ${codCategoria},'${hoje}'); ` +
                      ` insert into livrofinanceiro(codPaciente,codTipoExame,valorExame, `+
                      ` dataLancamento,codUsuario,recebido,valorTotal, id_categoria) `+
                      ` values(${codPaciente},${codDescExameM},${valorExameM},'${hoje}',${codUsario},${0},${valorExameM}, 1); ` +
                      ` insert into livrofinanceiro(codPaciente,codTipoExame,valorExame, `+
                      ` dataLancamento,codUsuario,recebido,valorTotal, id_categoria) `+
                      ` values(${codPaciente},${codDescExameP},${valorExameP},'${hoje}',${codUsario},${0},${valorExameP},2); ` 
            conection.query(sqlambos, (error, results) => {
                if(error){
                    resposta.status = 'erro'
                    resposta.info = 'Tivemos um problema interno! Encaminhe Novamente'
                    
                    res.json(resposta)
                } 
                if(results){

                    resposta.info = "Paciente encaminhado para filas Médica e Psicológica com sucesso!"
                    res.json(resposta)
                }
            })
       } else if(Number(codDescExameM) !== 0){
                        let sqlMedico = `insert into filaatendimento(codDescExame, codPaciente, codCategoria,` +
                        `  codDataPrev) values(${codDescExameM}, ${codPaciente}, ${codCategoria},'${hoje}'); ` +
                        ` insert into livrofinanceiro(codPaciente,codTipoExame,valorExame, `+
                        ` dataLancamento,codUsuario,recebido,valorTotal, id_categoria, tipomovimento) `+
                        ` values(${codPaciente},${codDescExameM},${valorExameM},'${hoje}',${codUsario},${1},${valorExameM}, ${1}, 'r'); ` 
                         
                conection.query(sqlMedico, (error,results) => {
                if(error){
                    resposta.status = 'erro'
                    resposta.info = 'Tivemos um problema interno! Encaminhe Novamente'
                    res.json(resposta)
                } 
                if(results){
                    resposta.info = "Paciente encaminhado para fila Médica!"
                    res.json(resposta)
                }
                })
       } else if(Number(codDescExameP) !==0){
                    let sqlpsicologo = ` insert into filaatendimento(codDescExame, codPaciente, codCategoria,` +
                    ` codDataPrev) values(${codDescExameP}, ${codPaciente}, ${codCategoria},'${hoje}'); ` +
                    ` insert into livrofinanceiro(codPaciente,codTipoExame,valorExame, `+
                    ` dataLancamento,codUsuario,recebido,valorTotal, id_categoria, tipomovimento) ` +
                    ` values(${codPaciente},${codDescExameP},${valorExameP},'${hoje}',${codUsario},${1},${valorExameP} ${2}, 'r'); ` 
            conection.query(sqlpsicologo, (error,results) => {
            if(error){
                resposta.status = 'erro'
                resposta.info = 'Tivemos um problema interno! Encaminhe Novamente'
                res.json(resposta)
            } 
            if(results){

                resposta.info = "Paciente encaminhado para fila Psicológica!"
                res.send(resposta)
            }
            })
       }
       
    //    conection.query(sql + filter, (error, results) => {
    //     if(error){
    //       resposta.status = 'erro'
    //       resposta.status = 'Erro de conexão! Tentar Novamente!'
    //       res.json(error)
    //     }
    //     else {
    //       if(results.length > 0){
    //           resposta.status = 'erro'
    //           resposta.info = 'O Exame Médico, já foi encaminhado para este Paciente hoje!'
    //       } else {
    //         let sqlExames
    //         conection.query()
    //       }
    //     }
    //   })

    })
   

    //ATUALIZAR
    router.patch('/filaatendimento/:id', (req,res) =>{
        const id = parseInt(req.params.id)
        const codDescExame = req.body.codDescExame
        const codPaciente = req.body.codPaciente
        const codCategoria = req.body.codCategoria
        const codDataPrev = req.body.codDataPrev
        const codDataAtend = req.body.codDataAtend
        
        execSQLQuery(`update filaatendimento set codDescExame = '${codDescExame}', `+
        ` codPaciente = '${codPaciente}', codCategoria = '${codCategoria}', codDataPrev = '${codDataPrev}', `+
        ` codDataAtend = '${codDataAtend}'  where codAtendimento = ${id}`, res)
    })
    server.use('/', router)
}