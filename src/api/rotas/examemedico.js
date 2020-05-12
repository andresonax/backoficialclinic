const express = require('express')
execSQLQuery = require('../cadastros/cadastro')
const conection = require('../../config/database')
const moment = require('moment')
const caminho = './src/config/public/relatorios/laudosmedicos/'
const caminhoPublic = 'relatorios/laudosMedicos/'
const {front, back} = require('../../config/variaveis')
const carbone = require('carbone')
const fs = require('fs')
const extenso = require('extenso')

module.exports = function(server) {
    const router = express.Router() 
    //CRUD examemedico

    //READ ALL
    var sql = 'SELECT * FROM examemedico'
    router.get('/examemedico', (req, res) => {execSQLQuery(sql, res)})

    router.post('/carregaExameMedico', (req, res) => {
        
        const codPaciente = req.body.record.codPaciente 
        const dataExame = moment(req.body.record.codDataAtend).format('YYYY-MM-DD')
        let sql = `select * from examemedico where codPaciente = ${codPaciente} and  CONVERT(dataExame,date) = CONVERT('${dataExame}', date) `
        conection.query(sql, (error, results, fields) => {
            if(error){
                res.send(error)
            }
            if(results){
                
                const codExame = results[0].codExame
                
                let sqlDadosExame = `SELECT * FROM dadosexmedico WHERE codExame = ${codExame}`
             
                conection.query(sqlDadosExame, (error, resultados, fields) =>{
                    if(error){
                        res.send(error)
                    } 
                    if(resultados){
                        res.send({
                            exame : results[0],
                            dadosExame : resultados[0]
                        })
                    }
                })
            }
        })
    
    
    })

    //READ POR ID
    router.get('/examemedico/:id?', (req, res) => {
        let filter = ''
        if(req.params.id) filter = ' WHERE codExame = ' + req.params.id;
        execSQLQuery(sql + filter, res)})

    //READ POR CANDIDATO
    router.get('/examemedicoPaciente/:id?', (req, res) => {
        let filter = ''
        if(req.params.id) filter = ' WHERE codPaciente = ' + req.params.id;
        execSQLQuery(sql + filter, res)})

    //DELETE 
    router.post('/examemedicoExclusao', (req, res) =>{
        let sqlExames = `select count(codExame) as exames from examemedico where codPaciente = ${req.body.codPaciente};`
        let sqlExame = 'DELETE FROM examemedico where codExame = ' + parseInt(req.body.codExame) + ';'
        let sqlDados = 'DELETE FROM dadosexmedico where codExame = ' + parseInt(req.body.codExame)
        conection.query(sqlExames + sqlExame + sqlDados, (error, results)=>{
            let resultado = {
                status : '',
                info : ''
            }
            if(error){
                resultado.status = 'erro'
                resultado.info = 'Falha de Conexão. Tente novamente!'
                
                res.send(resultado)
            }
            if(results){
                if(results[0][0].exames === 1){
                    let sqlRetiraFila = `delete from filaatendimento where codAtendimento in (select codAtendimento from ( select codAtendimento from filaatendimento f `+
                        ` inner join descExame d on d.codDescExame = f.codDescExame where codPaciente = ${req.body.codPaciente} and d.codTExame = 0) as tabela) `
                    conection.query(sqlRetiraFila, (falha, result) =>{
                        if(falha){
                            resultado.status = 'erro'
                            resultado.info = 'Falha de Conexão. Tente novamente!'
                        
                            res.send(resultado)
                        }
                        if(result){
                            resultado.status = 'ok'
                            resultado.info = 'Exame excluido!'
                            res.send(resultado)
                        }
                    })
                } else {
                    resultado.status = 'ok'
                    resultado.info = 'Exame excluido!'
                    res.send(resultado)
                }
            }
        })
    })

    //gerador laudo médico
    router.post('/gerarLaudoMedico', (req, res) => {
       
        var dadosRelatorio = {
            empresa : {},
            paciente : req.body.paciente,
            exameMedico : req.body.exameMedico,
            camposAcuidade : req.body.camposAcuidade,
            camposDinanometria : req.body.camposDinamometria,
            resultado : req.body.resultado,
            usuario : req.body.usuario,
            dataAtual : moment(new Date()).format('DD/MM/YYYY'),
            tituloLaudo : 'Laudo Médico',
            tituloI : 'Identificação',
            interessado : 'DETRAN-MG',
            assunto : 'Avaliação Médica de ' + req.body.paciente.nomePaciente,
            analiseI : '',
            tituloII : 'Demanda',
            demanda : '',
            tituloIII : 'Análise',
            tituloRetorno : '',
            conclusao : ''
        }
        //montando SINTESE - NEM ACREDITO!!! DEU TRABALHO PRA CARALEO
        let tratamento = ['A Sr.ª' , 'registrada', 'portadora', 'nascida']
        let nascimento = moment(req.body.paciente.nascPaciente)
        //res.send({nascimento : nascimento.format('YYYY-MM-DD')})
        if(req.body.paciente.sexoPaciente === 'M') tratamento = ['O Sr.' , 'registrado', 'portador','nascido']
        dadosRelatorio.analiseI = `${tratamento[0]} ${dadosRelatorio.paciente.nomePaciente}, ${tratamento[1]} no cadastro de pessoas físicas (CPF), sob o número ${dadosRelatorio.paciente.cpfPaciente}, e ${tratamento[2]}`+
                        ` do ${dadosRelatorio.paciente.descricaoTipo} número ${dadosRelatorio.paciente.docPaciente} ${dadosRelatorio.paciente.orgaoPaciente}-${dadosRelatorio.paciente.ufDoc}, compareceu nesta clínica `+
                        `submetendo-se a exames para avaliação médica.`
        let analiseII =''
        console.log(req.body)
        let renovacao = dadosRelatorio.paciente.codDescExame === 3 ? 'renovação' : 'obtenção'
        dadosRelatorio.demanda = 'O pedido de avaliação partiu da procura espontânea do(a) candidato(a), para avaliação de capacidade e habilidades físicas mínimas conforme Res. ' +
                                    'CONTRAN nº 425/12, como parte do processo de '+ renovacao +' de CARTEIRA NACIONAL DE HABILITAÇÃO – CNH, categoria pretendida:'
        if (dadosRelatorio.exameMedico.obsRetorno) {
            dadosRelatorio.tituloRetorno = 'Observações Retorno:'
        }
        if (dadosRelatorio.exameMedico.obsMedico !== '') {
            dadosRelatorio.tituloObservacao = 'Observações:'
        }
        conection.query(`select * from dadosempresa inner join cadcidades where dadosempresa.codCidade = cadcidades.codCidade; select descricaoResult from resultexame where codResultado = ${dadosRelatorio.resultado}`, (error, results, fields) => {
            if(error){
                res.send(error)
            }
            if(results){
          
                dadosRelatorio.empresa = results[0][0]
                dadosRelatorio.conclusao = 'Após a análise dos testes e informações prestadas pelo candidato, este encontra-se ' + results[1][0].descricaoResult +
                    ' no processo de avaliação médica para a Carteira Nacional de Habilitação.'
                modelo = './src/api/relatorios/laudoMedico.odt'
                nomeArquivo = `laudoMedico${dadosRelatorio.paciente.codPaciente}.pdf` 
                
                var options = {
                    convertTo : 'pdf' //can be docx, txt, ...
                };
                carbone.render(modelo, dadosRelatorio, options, function(err, result){
                    if (err) {
                    return console.log(err);
                    }
                    // write the result
                    fs.writeFileSync(caminho + nomeArquivo, result);
                    let resposta = {
                        nomeArquivo : `${back}${caminhoPublic}${nomeArquivo}`,
                        status : 'ok'
                    }
                    res.send(resposta)

                });
            }
    })
    })
    //gerador laudo médico
    router.post('/gerarEncaminhamento', (req, res) => {
       
        var dadosRelatorio = {
            empresa : {},
            paciente : req.body.paciente,
            exameMedico : req.body.exameMedico,
            camposAcuidade : req.body.camposAcuidade,
            camposDinanometria : req.body.camposDinamometria,
            resultado : req.body.resultado,
            usuario : req.body.usuario,
            dataAtual : moment(new Date()).format('DD/MM/YYYY'),
            renach : ''
            
        }
        
        conection.query(`select * from dadosempresa inner join cadcidades where dadosempresa.codCidade = cadcidades.codCidade; select descricaoResult from resultexame where codResultado = ${dadosRelatorio.resultado}`, (error, results, fields) => {
            if(error){
                res.send(error)
            }
            if(results){
                dadosRelatorio.empresa = results[0][0]
               
                modelo = './src/api/relatorios/anexoVI.odt'
                nomeArquivo = `encaminhamento${dadosRelatorio.paciente.codPaciente}.pdf` 
                var options = {
                    convertTo : 'pdf' //can be docx, txt, ...
                };
                carbone.render(modelo, dadosRelatorio, options, function(err, result){
                    if (err) {
                    return console.log(err);
                    }
                    // write the result
                    fs.writeFileSync(caminho + nomeArquivo, result);
                    let resposta = {
                        nomeArquivo : `${back}${caminhoPublic}${nomeArquivo}`,
                        status : 'ok'
                    }
                    res.send(resposta)

                });
            }
    })
    })

    //INSERIR 
    router.post('/examemedico', (req,res) =>{
        
        const codDescExame = req.body.exame.codDescExame
        const codPaciente = req.body.exame.codPaciente
        const dataExame = moment(req.body.exame.dataExame).format('YYYY-MM-DD HH:mm')
        const dataValidade = moment(req.body.exame.dataValidade).format('YYYY-MM-DD HH:mm')
        const dataModificacao = moment(req.body.exame.dataModificacao).format('YYYY-MM-DD HH:mm')
        const codResultado = req.body.exame.codResultado
        const codCategoria = req.body.exame.codCategoria
        const valorExamMedico = req.body.exame.valorExamMedico
        const sintese = req.body.exame.sintese
        const codUsuario = req.body.exame.codUsuario
        const emitido = req.body.exame.emitido
        const obsMedico = req.body.exame.obsMedico
        const codAtendimento = req.body.exame.codAtendimento
        const tempo = req.body.exame.tempo
        const obsRetorno = req.body.exame.obsRetorno
        let sqlInserir = `INSERT INTO examemedico(codDescExame, codPaciente, dataExame, dataValidade, dataModificacao, codResultado, codCategoria, valorExamMedico, `+
        `  sintese, codUsuario, emitido, obsMedico, tempo, obsRetorno) values(${codDescExame},${codPaciente},'${dataExame}','${dataValidade}','${dataModificacao}', `+
        `  ${codResultado},${codCategoria},${valorExamMedico},'${sintese}',${codUsuario},${emitido},'${obsMedico}', '${tempo}', '${obsRetorno}' )`

        conection.query(sqlInserir, (error, results, fields) => {
            let resultado ={
                status : '',
                info : ''
            }
            if (error) {
                resultado.status = 'erro'
                resultado.info = 'Erro Conexão! Favor Tentar novamente!'
                res.send(resultado)
            }
            if(results){
                //res.send(results.insertId)
                
                const codExame       = results.insertId
                const codPaciente    = req.body.exame.codPaciente
                const acVisSemCorrD  = req.body.dadosExame.acVisSemCorrD === '' ? null : parseFloat(req.body.dadosExame.acVisSemCorrD)
                const acVisSemCorrE  = req.body.dadosExame.acVisSemCorrE === '' ? null : parseFloat(req.body.dadosExame.acVisSemCorrE)
                const acVisComCorrD  = req.body.dadosExame.acVisComCorrD === '' ? null : parseFloat(req.body.dadosExame.acVisComCorrD)
                const acVisComCorrE  = req.body.dadosExame.acVisComCorrE === '' ? null : parseFloat(req.body.dadosExame.acVisComCorrE)
                const coverTest      = req.body.dadosExame.coverTest.replace(/'/g, "''");
                const testIshihara   = req.body.dadosExame.testIshihara.replace(/'/g, "''");
                const lantVermelha   = req.body.dadosExame.lantVermelha.replace(/'/g, "''");
                const lantVerde      = req.body.dadosExame.lantVerde.replace(/'/g, "''");
                const latAmarela     = req.body.dadosExame.latAmarela.replace(/'/g, "''");
                const visaoProfund   = req.body.dadosExame.visaoProfund.replace(/'/g, "''");
                const visaoNotur     = req.body.dadosExame.visaoNotur.replace(/'/g, "''");
                const resOfusca      = req.body.dadosExame.resOfusca.replace(/'/g, "''");
                const campoVisualD   = req.body.dadosExame.campoVisualD === '' ? null : req.body.dadosExame.campoVisualD
                const campoVisualE   = req.body.dadosExame.campoVisualE === '' ? null : req.body.dadosExame.campoVisualE
                const dinamoD        = req.body.dadosExame.dinamoD === '' ? null : req.body.dadosExame.dinamoD
                const dinamoE        = req.body.dadosExame.dinamoE === '' ? null : req.body.dadosExame.dinamoE
                const dinamoLombar   = req.body.dadosExame.dinamoLombar === '' ? null : req.body.dadosExame.dinamoLombar
                const acAudicao      = req.body.dadosExame.acAudicao.replace(/'/g, "''");
                const pArterial      = req.body.dadosExame.pArterial.replace(/'/g, "''");
                const pulso          = req.body.dadosExame.pulso === '' ? null : req.body.dadosExame.pulso
                const auscNum        = req.body.dadosExame.auscNum.replace(/'/g, "''");
                const apLocomot      = req.body.dadosExame.apLocomot.replace(/'/g, "''");
                const sitNerv        = req.body.dadosExame.sitNerv.replace(/'/g, "''");
                const outApar        = req.body.dadosExame.outApar.replace(/'/g, "''");
                const codRestricao   = req.body.dadosExame.codRestricao.replace(/'/g, "''");
                const cidPac         = req.body.dadosExame.cidPac.replace(/'/g, "''");
                conection.query(`INSERT INTO dadosexmedico( ` +
                    ` codExame,`+       
                    ` codPaciente,`+    
                    ` acVisSemCorrD,`+  
                    ` acVisSemCorrE,`+  
                    ` acVisComCorrD,`+  
                    ` acVisComCorrE,`+  
                    ` coverTest,`+      
                    ` testIshihara,`+   
                    ` lantVermelha,`+   
                    ` lantVerde,`+      
                    ` latAmarela,`+     
                    ` visaoProfund,`+   
                    ` visaoNotur,`+     
                    ` resOfusca,`+      
                    ` campoVisualD,`+   
                    ` campoVisualE,`+   
                    ` dinamoD ,`+       
                    ` dinamoE,`+        
                    ` dinamoLombar,`+   
                    ` acAudicao,`+      
                    ` pArterial,`+      
                    ` pulso,`+          
                    ` auscNum ,`+       
                    ` apLocomot,`+      
                    ` sitNerv,`+        
                    ` outApar,`+        
                    ` codRestricao,`+   
                    ` cidPac`+         
                    `) values( `+
                    ` ${codExame},`+       
                    ` ${codPaciente},`+    
                    ` ${acVisSemCorrD},`+  
                    ` ${acVisSemCorrE},`+  
                    ` ${acVisComCorrD},`+  
                    ` ${acVisComCorrE},`+  
                    ` '${coverTest}',`+      
                    ` '${testIshihara}',`+   
                    ` '${lantVermelha}',`+   
                    ` '${lantVerde}',`+      
                    ` '${latAmarela}',`+     
                    ` '${visaoProfund}',`+   
                    ` '${visaoNotur}',`+     
                    ` '${resOfusca}',`+      
                    ` ${campoVisualD},`+   
                    ` ${campoVisualE},`+   
                    ` ${dinamoD} ,`+       
                    ` ${dinamoE},`+        
                    ` ${dinamoLombar},`+   
                    ` '${acAudicao}',`+      
                    ` '${pArterial}',`+      
                    ` ${pulso},`+          
                    ` '${auscNum}' ,`+       
                    ` '${apLocomot}',`+      
                    ` '${sitNerv}',`+        
                    ` '${outApar}',`+        
                    ` '${codRestricao}',`+   
                    ` '${cidPac}'`+      
                    ` ); UPDATE filaatendimento SET codDataAtend = '${dataExame}' WHERE codAtendimento = ${codAtendimento}`, (error, results) =>{
                        
                        if(error){
                            resultado.status = 'erro'
                            resultado.info = 'Erro Conexão! Favor Tentar novamente!'
                            res.send(resultado)
                        }
                        if(results){
                            resultado.status = 'ok'
                            resultado.info = 'Exame salvo com sucesso!'
                            res.send(resultado)
                            //MONTAR LAUDO
                            
                        }
                    })
            }
        })
    })

    //ATUALIZAR
    router.patch('/examemedico/:id', (req,res) =>{
        const id = parseInt(req.params.id)
        const codDescExame = req.body.exame.codDescExame
        const codPaciente = req.body.exame.codPaciente
        const dataExame = moment(req.body.exame.dataExame).format('YYYY-MM-DD HH:mm')
        const dataValidade = moment(req.body.exame.dataValidade).format('YYYY-MM-DD HH:mm')
        const dataModificacao = moment(req.body.exame.dataModificacao).format('YYYY-MM-DD HH:mm')
        const codResultado = req.body.exame.codResultado
        const codCategoria = req.body.exame.codCategoria
        const valorExamMedico = req.body.exame.valorExamMedico
        const sintese = req.body.exame.sintese
        const codUsuario = req.body.exame.codUsuario
        const emitido = req.body.exame.emitido
        const obsMedico = req.body.exame.obsMedico
        const codAtendimento = req.body.exame.codAtendimento
        const obsRetorno = req.body.exame.obsRetorno
        
        conection.query(`update examemedico set codDescExame = ${codDescExame},codPaciente = ${codPaciente},dataExame = '${dataExame}',dataValidade = '${dataValidade}', `+
            ` dataModificacao = '${dataModificacao}',codResultado = ${codResultado},codCategoria = ${codCategoria},valorExamMedico = ${valorExamMedico}, `+
            ` sintese = '${sintese}',codUsuario = ${codUsuario},emitido = ${emitido},obsMedico = '${obsMedico}', obsRetorno = '${obsRetorno}'  where codExame = ${id}`, (error, results) => {
                let resultado ={
                    status : '',
                    info : ''
                }
            
                if (error) {
                    resultado.status = 'erro'
                    resultado.info = 'Erro Conexão! Favor Tentar novamente!'
                 
                    res.send(resultado)
                }
                if(results){
                    //res.send(results.insertId)
                    
                    const codPaciente    = req.body.exame.codPaciente
                    const acVisSemCorrD  = req.body.dadosExame.acVisSemCorrD 
                    const acVisSemCorrE  = req.body.dadosExame.acVisSemCorrE 
                    const acVisComCorrD  = req.body.dadosExame.acVisComCorrD 
                    const acVisComCorrE  = req.body.dadosExame.acVisComCorrE 
                    const coverTest      = req.body.dadosExame.coverTest.replace(/'/g, "''");
                    const testIshihara   = req.body.dadosExame.testIshihara.replace(/'/g, "''");
                    const lantVermelha   = req.body.dadosExame.lantVermelha.replace(/'/g, "''");
                    const lantVerde      = req.body.dadosExame.lantVerde.replace(/'/g, "''");
                    const latAmarela     = req.body.dadosExame.latAmarela.replace(/'/g, "''");
                    const visaoProfund   = req.body.dadosExame.visaoProfund.replace(/'/g, "''");
                    const visaoNotur     = req.body.dadosExame.visaoNotur.replace(/'/g, "''");
                    const resOfusca      = req.body.dadosExame.resOfusca.replace(/'/g, "''");
                    const campoVisualD   = req.body.dadosExame.campoVisualD
                    const campoVisualE   = req.body.dadosExame.campoVisualE 
                    const dinamoD        = req.body.dadosExame.dinamoD 
                    const dinamoE        = req.body.dadosExame.dinamoE 
                    const dinamoLombar   = req.body.dadosExame.dinamoLombar 
                    const acAudicao      = req.body.dadosExame.acAudicao.replace(/'/g, "''");
                    const pArterial      = req.body.dadosExame.pArterial.replace(/'/g, "''");
                    const pulso          = req.body.dadosExame.pulso 
                    const auscNum        = req.body.dadosExame.auscNum.replace(/'/g, "''");
                    const apLocomot      = req.body.dadosExame.apLocomot.replace(/'/g, "''");
                    const sitNerv        = req.body.dadosExame.sitNerv.replace(/'/g, "''");
                    const outApar        = req.body.dadosExame.outApar.replace(/'/g, "''");
                    const codRestricao   = req.body.dadosExame.codRestricao.replace(/'/g, "''");
                    const cidPac         = req.body.dadosExame.cidPac.replace(/'/g, "''");
                    conection.query(`update dadosexmedico set ` +
                             
                        ` codPaciente = ${codPaciente},`+    
                        ` acVisSemCorrD = ${acVisSemCorrD},`+  
                        ` acVisSemCorrE = ${acVisSemCorrE},`+  
                        ` acVisComCorrD = ${acVisComCorrD},`+  
                        ` acVisComCorrE = ${acVisComCorrE},`+  
                        ` coverTest = '${coverTest}',`+      
                        ` testIshihara = '${testIshihara}',`+   
                        ` lantVermelha = '${lantVermelha}',`+   
                        ` lantVerde = '${lantVerde}',`+      
                        ` latAmarela = '${latAmarela}',`+     
                        ` visaoProfund = '${visaoProfund}',`+   
                        ` visaoNotur = '${visaoNotur}',`+     
                        ` resOfusca = '${resOfusca}',`+      
                        ` campoVisualD = ${campoVisualD},`+   
                        ` campoVisualE =  ${campoVisualE},`+   
                        ` dinamoD = ${dinamoD},`+       
                        ` dinamoE = ${dinamoE},`+        
                        ` dinamoLombar = ${dinamoLombar},`+   
                        ` acAudicao = '${acAudicao}',`+      
                        ` pArterial = '${pArterial}',`+      
                        ` pulso = ${pulso},`+          
                        ` auscNum ='${auscNum}',`+       
                        ` apLocomot = '${apLocomot}',`+      
                        ` sitNerv = '${sitNerv}',`+        
                        ` outApar = '${outApar}',`+        
                        ` codRestricao =  '${codRestricao}',`+   
                        ` cidPac = '${cidPac}'`+         
                        ` where codExame = ${id}`, (error, results) =>{
                            
                            if(error){
                                resultado.status = 'erro'
                                resultado.info = 'Erro Conexão! Favor Tentar novamente!'
                      
                                res.send(resultado)
                            }
                            if(results){
                                resultado.status = 'ok'
                                resultado.info = 'Exame salvo com sucesso!'
                                res.send(resultado)
                                //MONTAR LAUDO
                                
                            }
                        })
                }
            }) 
    })
    server.use('/', router)
}