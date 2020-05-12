const express = require('express')
execSQLQuery = require('../cadastros/cadastro')
const moment = require('moment')
const conection = require('../../config/database')
const fs = require('fs')
const carbone = require('carbone')
//let caminho = `/home/ec2-user/dist/temp/relatorios/` caminho cloud
const caminho = './src/config/public/relatorios/laudos/'
const caminhoPublic = 'relatorios/laudos/'
const {front, back} = require('../../config/variaveis')

module.exports = function(server) {
    const router = express.Router() 
    //CRUD examepsico

    //READ ALL
    var sql = 'SELECT * FROM examepsico'
    router.get('/examepsico', (req, res) => {execSQLQuery(sql, res)})

    //READ POR CANDIDATO
    router.get('/examePsicoPaciente/:id?', (req, res) => {
        let filter = ''
        if(req.params.id) filter = ' WHERE codPaciente = ' + req.params.id;
        execSQLQuery(sql + filter, res)})


    //READ POR ID
    router.get('/examepsico/:id?', (req, res) => {
        let filter = ''
        if(req.params.id) filter = ' WHERE codExPsico = ' + req.params.id;
        execSQLQuery(sql + filter, res)})

    //DELETE POR ID
    router.delete('/examepsico/:id', (req, res) =>{
        execSQLQuery('DELETE FROM examepsico where codExPsico = ' + parseInt(req.params.id), res)
    })

    //DELETE 
    router.post('/examePsicoExclusao', (req, res) =>{
        let sqlExames = `select count(codExPsico) as exames from examepsico where codPaciente = ${req.body.codPaciente};`
        let sqlExame = 'DELETE FROM examepsico where codExPsico = ' + parseInt(req.body.codExPsico) + ';'
        let sqlComposicao = 'DELETE FROM examepsicocomposicao where codExPsico = ' + parseInt(req.body.codExPsico)+ ';'
        let sqlTestes = 'DELETE FROM examepsicotestes where codExPsico = ' + parseInt(req.body.codExPsico)+ ';'
        let sqlPersonal = 'DELETE FROM expiscpersonal where codExPsico = ' + parseInt(req.body.codExPsico)+ ';'
        let sqlAtencao = 'DELETE FROM expsicatencao where codExPsico = ' + parseInt(req.body.codExPsico)+ ';'
        let sqlOutros = 'DELETE FROM expsicoutros where codExPsico = ' + parseInt(req.body.codExPsico)+ ';'
        conection.query(sqlExames + sqlExame + sqlComposicao + sqlTestes + sqlPersonal + sqlAtencao + sqlOutros , (error, results)=>{
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
                        ` inner join descExame d on d.codDescExame = f.codDescExame where codPaciente = ${req.body.codPaciente} and d.codTExame = 1) as tabela) `
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

    //INSERIR 
    router.post('/examepsico', (req,res) =>{
        //console.log(req.body)
        const codPaciente = req.body.current.codPaciente
        const codDescExame = req.body.current.codDescExame
        const dataExame = moment(new Date(req.body.dadosExamePsico.dataExame)).format('YYYY-MM-DD HH:MM')
        const dataValidade = moment(new Date(req.body.dadosExamePsico.dataValidade)).format('YYYY-MM-DD HH:MM')
        const dataAlteracao = moment(new Date(req.body.dadosExamePsico.dataModificacao)).format('YYYY-MM-DD HH:MM')
        const codResultado = req.body.dadosExamePsico.codResultado
        const codCategoria = req.body.dadosExamePsico.codCategoria
        const valorExame = req.body.dadosExamePsico.valorExame
        const sintese = ''
        const codUsuario = req.body.usuario.codUsuario
        const emitido = 0
        const obsPaciente = req.body.composicao.observacao
        const tempo = req.body.dadosExamePsico.tempo
        
        let sqlInsertExame = `INSERT INTO examepsico(codDescExame, codPaciente, dataExame, dataValidade, dataAlteracao, codResultado, codCategoria, valorExame, `+
        `  sintese, codUsuario, emitido, obsPaciente, tempo) values(${codDescExame},${codPaciente},'${dataExame}','${dataValidade}','${dataAlteracao}', `+
        `  ${codResultado},${codCategoria},${valorExame},'${sintese}',${codUsuario},${emitido},'${obsPaciente}','${tempo}' )`
        conection.query(sqlInsertExame, (error, results) =>{
            let resultado = {
                status : '',
                info : ''
            }
            if(error){
                resultado.status = 'erro'
                resultado.info = 'Falha de conexão, favor tentar novamente!'
                res.send(resultado)
            }
            if(results){
                let codExPsico = results.insertId
                let fuma = req.body.composicao.fuma
                let bebe = req.body.composicao.bebe
                let doenca = req.body.composicao.doenca
                let nomeDoenca = req.body.composicao.nomeDoenca
                let controleGeral = req.body.composicao.controleGeral
                let personalidade = req.body.composicao.personalidade
                let maturidade = req.body.composicao.maturidade
                let interpessoal = req.body.composicao.interpessoal
                let afetividade = req.body.composicao.afetividade
                let agressividade = req.body.composicao.agressividade
                let impulsividade = req.body.composicao.impulsividade
                let produtividade = req.body.composicao.produtividade
                let psicopatologia = req.body.composicao.psicopatologia

                //dados composicao
                let sqlComposicao = `INSERT INTO examepsicocomposicao `+ 
                        ` (codExPsico, fuma, bebe, doenca, nomeDoenca, controleGeral, personalidade,  maturidade, `+
                        ` interpessoal, afetividade,  agressividade, impulsividade, produtividade,psicopatologia) `+
                        ` VALUES (${codExPsico},'${fuma}','${bebe}', '${doenca}','${nomeDoenca}','${controleGeral}','${personalidade}','${maturidade}','${interpessoal}', `+
                        ` '${afetividade}','${agressividade}','${impulsividade}','${produtividade}', '${psicopatologia}'); `
                
                let sqlTestes = ''       
                for(var i=0; i<req.body.resultados.length ; i++){
                    let key = req.body.resultados[i].key
                    let nome = req.body.resultados[i].nome
                    let conclusao = req.body.resultados[i].conclusao
                    let pontos = req.body.resultados[i].pontos
                    let percentil = req.body.resultados[i].percentil
                    let tabelaPontos = req.body.resultados[i].tabelaPontos
                    let maxPontos = req.body.resultados[i].maxPontos
                    let tipoTeste = req.body.resultados[i].tipoTeste
                    let pPalo01 = req.body.resultados[i].pPalo01
                    let pPalo02 = req.body.resultados[i].pPalo02
                    let pPalo03 = req.body.resultados[i].pPalo03
                    let pPalo04 = req.body.resultados[i].pPalo04
                    let pPalo05 = req.body.resultados[i].pPalo05
                    let pTotal = req.body.resultados[i].pTotal
                    let pDiferenca = req.body.resultados[i].pDiferenca
                    let sPalo01 = req.body.resultados[i].sPalo01
                    let sPalo02 = req.body.resultados[i].sPalo02
                    let sPalo03 = req.body.resultados[i].sPalo03
                    let sPalo04 = req.body.resultados[i].sPalo04
                    let sPalo05 = req.body.resultados[i].sPalo05
                    let sTotal = req.body.resultados[i].sTotal
                    let sDiferenca = req.body.resultados[i].sDiferenca
                    let padrao = req.body.resultados[i].padrao
                            
                            
                    sqlTestes += `INSERT INTO examepsicotestes(codExPsico, \`key\`, nome, conclusao, pontos, percentil, tabelaPontos, maxPontos, tipoTeste, ` +
                    ` pPalo01, pPalo02, pPalo03, pPalo04, pPalo05, pTotal, pDiferenca, sPalo01, sPalo02, sPalo03, sPalo04, sPalo05, sTotal, sDiferenca, padrao) VALUES( ` +
                    `${codExPsico}, ${key}, '${nome}', '${conclusao}', ${pontos}, ${percentil}, '${tabelaPontos}', ${maxPontos}, '${tipoTeste}', ${pPalo01}, ${pPalo02}, `+
                    ` ${pPalo03}, ${pPalo04}, ${pPalo05}, ${pTotal}, ${pDiferenca}, ${sPalo01}, ${sPalo02}, ${sPalo03}, ${sPalo04}, ${sPalo05}, ${sTotal}, ${sDiferenca}, '${padrao}'); ` 
                } 
                let codAtendimento = req.body.current.codAtendimento
                let sqlFila = `UPDATE filaatendimento SET codDataAtend = '${dataExame}' WHERE codAtendimento = ${codAtendimento}`
               
                conection.query(sqlComposicao + sqlTestes + sqlFila, (erroG, resultsG) =>{
                    if(erroG){
                        resultado.status = 'erro'
                        resultado.info = 'Falha de conexão, favor tentar novamente!'

                        res.send(resultado)
                    } 
                    if(resultsG){
                        resultado.status = 'ok'
                        resultado.info = 'Exame cadastrado com sucesso!'
                        res.send(resultado)
                        
                    }
                })
             }
        
        })
    })

    //ATUALIZAR
    router.patch('/examepsico/:id', (req,res) =>{
        let resultado = {
            status : '',
            info : ''
        }
        const codExPsico = req.params.id


        const codPaciente = req.body.current.codPaciente
        const codDescExame = req.body.current.codDescExame
        const dataExame = moment(new Date(req.body.dadosExamePsico.dataExame)).format('YYYY-MM-DD HH:MM')
        const dataValidade = moment(new Date(req.body.dadosExamePsico.dataValidade)).format('YYYY-MM-DD HH:MM')
        const dataAlteracao = moment(new Date(req.body.dadosExamePsico.dataModificacao)).format('YYYY-MM-DD HH:MM')
        const codResultado = req.body.dadosExamePsico.codResultado
        const codCategoria = req.body.dadosExamePsico.codCategoria
        const valorExame = req.body.dadosExamePsico.valorExame
        const sintese = ''
        const codUsuario = req.body.usuario.codUsuario
        const emitido = 0
        const obsPaciente = req.body.composicao.observacao
        const tempo = req.body.dadosExamePsico.tempo
        
        let sqlUpdateExame = `UPDATE examepsico `+
            ` SET `+
            ` codPaciente = ${codPaciente}, `+
            ` codDescExame = ${codDescExame}, `+
            ` dataExame = '${dataExame}', `+
            ` dataValidade = '${dataValidade}', `+
            ` dataAlteracao = '${dataAlteracao}', `+
            ` codResultado = ${codResultado} ,`+
            ` codCategoria = ${codCategoria} ,`+
            ` valorExame = ${valorExame} ,`+
            ` sintese = '' ,`+
            ` codUsuario = ${codUsuario}, `+
            ` emitido = ${emitido}, `+
            ` obsPaciente = '${obsPaciente}', `+
            ` tempo = '${tempo}' `+
            ` WHERE codExPsico = ${codExPsico}; `

            let fuma = req.body.composicao.fuma
            let bebe = req.body.composicao.bebe
            let doenca = req.body.composicao.doenca
            let nomeDoenca = req.body.composicao.nomeDoenca
            let controleGeral = req.body.composicao.controleGeral
            let personalidade = req.body.composicao.personalidade
            let maturidade = req.body.composicao.maturidade
            let interpessoal = req.body.composicao.interpessoal
            let afetividade = req.body.composicao.afetividade
            let agressividade = req.body.composicao.agressividade
            let impulsividade = req.body.composicao.impulsividade
            let produtividade = req.body.composicao.produtividade
            let psicopatologia = req.body.composicao.psicopatologia
        
        let sqlUpdateComposicao = `UPDATE examepsicocomposicao `
        + ` SET `
        + ` fuma = '${fuma}',`
        + ` bebe = '${bebe}',`
        + ` doenca = '${doenca}',`
        + ` nomeDoenca = '${nomeDoenca}',`
        + ` controleGeral = '${controleGeral}',`
        + ` personalidade = '${personalidade}',`
        + ` maturidade = '${maturidade}',`
        + ` interpessoal = '${interpessoal}',`
        + ` afetividade = '${afetividade}',`
        + ` agressividade = '${agressividade}',`
        + ` impulsividade = '${impulsividade}',`
        + ` produtividade = '${produtividade}',`
        + ` psicopatologia = '${psicopatologia}'`
        + ` WHERE codExPsico = ${codExPsico};`

        let sqlTestes = ''       
            for(var i=0; i<req.body.resultados.length ; i++){
                let key = req.body.resultados[i].key
                let nome = req.body.resultados[i].nome
                let conclusao = req.body.resultados[i].conclusao
                let pontos = req.body.resultados[i].pontos
                let percentil = req.body.resultados[i].percentil
                let tabelaPontos = req.body.resultados[i].tabelaPontos
                let maxPontos = req.body.resultados[i].maxPontos
                let tipoTeste = req.body.resultados[i].tipoTeste
                let pPalo01 = req.body.resultados[i].pPalo01
                let pPalo02 = req.body.resultados[i].pPalo02
                let pPalo03 = req.body.resultados[i].pPalo03
                let pPalo04 = req.body.resultados[i].pPalo04
                let pPalo05 = req.body.resultados[i].pPalo05
                let pTotal = req.body.resultados[i].pTotal
                let pDiferenca = req.body.resultados[i].pDiferenca
                let sPalo01 = req.body.resultados[i].sPalo01
                let sPalo02 = req.body.resultados[i].sPalo02
                let sPalo03 = req.body.resultados[i].sPalo03
                let sPalo04 = req.body.resultados[i].sPalo04
                let sPalo05 = req.body.resultados[i].sPalo05
                let sTotal = req.body.resultados[i].sTotal
                let sDiferenca = req.body.resultados[i].sDiferenca
                let padrao = req.body.resultados[i].padrao

                sqlTestes += `UPDATE examepsicotestes `+
                `SET `+
                `nome = '${nome}', `+
                `conclusao = '${conclusao}', `+
                `pontos = ${pontos} ,`+
                `percentil = ${percentil} ,`+
                `tabelaPontos = '${tabelaPontos}', `+
                `maxPontos = ${maxPontos} ,`+
                `tipoTeste = '${tipoTeste}', `+
                `pPalo01 = ${pPalo01} ,`+
                `pPalo02 = ${pPalo02}, `+
                `pPalo03 = ${pPalo03}, `+
                `pPalo04 = ${pPalo04}, `+
                `pPalo05 = ${pPalo05}, `+
                `pTotal = ${pTotal}, `+
                `pDiferenca = ${pDiferenca}, `+
                `sPalo01 = ${sPalo01}, `+
                `sPalo02 = ${sPalo02}, `+
                `sPalo03 = ${sPalo03}, `+
                `sPalo04 = ${sPalo04}, `+
                `sPalo05 = ${sPalo05}, `+
                `sTotal = ${sTotal}, `+
                `sDiferenca = ${sDiferenca}, `+
                `padrao = '${padrao}' `+
                `WHERE codExPsico = ${codExPsico} and \`key\` = ${key}; `
            } 


        conection.query(sqlUpdateExame + sqlUpdateComposicao + sqlTestes, (error, results) =>{
            if(error){
                resultado.status = 'erro'
                resultado.info = 'Falha de Conexão. Favor tentar novamente.'
                
                res.send(resultado)
            }
            if(results){
                resultado.status = 'ok'
                resultado.info = 'Exame atualizado com sucesso!'
                res.send(resultado)
            }
        })    
        
        
    })

    //METODO RESPONSÁVEL POR GERAR O LAUDO PSICOLÓGICO
    router.post('/geradorLaudo', (req,res) => {
        let enviaResultado = {
            status : '',
            info : '',
            nomeArquivo : ''
        }
        //montando SINTESE - NEM ACREDITO!!! DEU TRABALHO PRA CARALEO
        let tratamento = ['A Sr.ª' , 'registrada', 'portadora', 'nascida']
        let nascimento = moment(req.body.current.nascPaciente)
        //res.send({nascimento : nascimento.format('YYYY-MM-DD')})
        if(req.body.current.sexoPaciente === 'M') tratamento = ['O Sr.' , 'registrado', 'portador','nascido']
        let analiseI = `${tratamento[0]} ${req.body.current.nomePaciente}, ${tratamento[1]} no cadastro de pessoas físicas (CPF), sob o número ${req.body.current.cpfPaciente}, e ${tratamento[2]}`+
                        ` do ${req.body.current.descricaoTipo} número ${req.body.current.docPaciente} ${req.body.current.orgaoPaciente}-${req.body.current.ufDoc}, compareceu nesta clínica `+
                        `submetendo-se a exames para avaliação psicológica obtendo o seguinte resultado: Entrevista - ${tratamento[0]} ${req.body.current.nomePaciente} tem ${req.body.current.idade}`+
                        ` anos, ${tratamento[3]} em ${nascimento.format('DD/MM/YYYY')}, em ${req.body.current.nomeCidade}-${req.body.current.ufcidade}`+
                        `${req.body.current.escolaridade ? ", possui " + req.body.current.escolaridade + "." : "."}  Sobre sua saúde, declarou que ${req.body.composicaoLaudo.fuma}${req.body.composicaoLaudo.alcool} e `+
                        `${req.body.composicaoLaudo.doencas} ${req.body.composicaoLaudo.nomeDoenca}.`
        let analiseII =''
        let conclusao = ''
        //A SEGUIR VOU BUSCAR NA BASE OS RESULTADOS, referencias E CONSTRUTOS
        let sqlSinteses = ''
        req.body.resultadoExame.map(e => e.tipoTeste !== 'Personalidade' ? sqlSinteses += `select  t.key, s.descricao, t.tipoTeste, s.resultado from sinteses s inner join testespsico t on s.keyTestePsico = t.key `+
                                                        ` where t.key =${e.key} and resultado = '${e.conclusao}';` : '')

        conection.query(sqlSinteses, (error, results, fields) => {
            let sinteses = []
            let ordenaTestes = []
            
            if(error) {
                enviaResultado.status = 'erro'
                enviaResultado.info = 'Falha de Conexão. Tente Novamente!'
                res.json(enviaResultado)
            }
            if(results){
                
                results[1] ? sinteses = [...results] : sinteses.push(results)
                sinteses.map(e => e[0] && (e[0].tipoTeste === 'Raciocínio') ? ordenaTestes[0] = e[0] 
                                : e[0] && (e[0].tipoTeste === 'Atenção Concentrada') ? ordenaTestes[1] = e[0] 
                                : e[0] && (e[0].tipoTeste === 'Atenção Difusa/Div') ? ordenaTestes[2] = e[0] 
                                : e[0] && (e[0].tipoTeste === 'Atenção Alternada') ? ordenaTestes[3] = e[0] 
                                : e[0] && (e[0].tipoTeste === 'Memória Visual') ? ordenaTestes[4] = e[0] 
                                : e[0] && (e[0].tipoTeste === 'Memória Auditiva') ? ordenaTestes[5] = e[0] 
                                : ''
                                )
                //res.send(ordenaTestes)
                ordenaTestes.map(e => e ? analiseII += e.descricao : '' ) //inserindo sinteses

                sqlConstrutos = `select * from construtos where nome = 'CONTROLE GERAL' AND RESULTADO = '${req.body.composicaoLaudo.controleGeral.toUpperCase()}';`
                sqlConstrutos += `select * from construtos where nome = 'ORGANIZAÇÃO DA PERSONALIDADE' AND RESULTADO = '${req.body.composicaoLaudo.organizacao}';`
                sqlConstrutos += `select * from construtos where nome = 'MATURIDADE/EMOTIVIDADE' AND RESULTADO = '${req.body.composicaoLaudo.maturidade}';`
                sqlConstrutos += `select * from construtos where nome = 'RELACIONAMENTO INTERPESSOAL' AND RESULTADO = '${req.body.composicaoLaudo.relacionamento}';`
                sqlConstrutos += `select * from construtos where nome = 'AFETIVIDADE' AND RESULTADO = '${req.body.composicaoLaudo.afetividade}';`
                sqlConstrutos += `select * from construtos where nome = 'AGRESSIVIDADE' AND RESULTADO = '${req.body.composicaoLaudo.agressividade}';`
                sqlConstrutos += `select * from construtos where nome = 'IMPULSIVIDADE' AND RESULTADO = '${req.body.composicaoLaudo.impulsividade}';`
                sqlConstrutos += `select * from construtos where nome = 'ENERGIA VITAL/PRODUTIVIDADE' AND RESULTADO = '${req.body.composicaoLaudo.energia}';`
                sqlConstrutos += `select * from construtos where nome = 'PSICOPATOLOGIA' AND RESULTADO = '${req.body.composicaoLaudo.psicopatia}';`

                conection.query(sqlConstrutos, (error, results, fields) => {
                    if(error){
                        enviaResultado.status = 'erro'
                        enviaResultado.info = 'Falha de Conexão. Tente Novamente!'
                        res.json(enviaResultado)
                    }
                    if(results){
                        //res.json({body : req.body})
                        results.map(e => analiseII += e[0] && e[0].descricao ? e[0].descricao : '') //adiciono todas os construtos
                        analiseII += req.body.composicaoLaudo.observacao !== "" ? `Observação adicional: ${req.body.composicaoLaudo.observacao}.` : ''

                        let sqlResultado = `select * from resultadoslaudo where codResultado = ${req.body.current.codResultado} order by tipo desc`
                        conection.query(sqlResultado, (error, re, fields) => {
                            conclusao = ''
                            let resultado = ''
                            if(error){
                                enviaResultado.status = 'erro'
                                enviaResultado.info = 'Falha de Conexão. Tente Novamente!'
                                res.json(enviaResultado)
                            }
                            if(re){
                                resultado = re[0]
                                conclusao = re[1].descricao
                                analiseII += resultado.descricao
                                let anos = moment(req.body.examePsicologico.dataValidade).diff(moment(req.body.examePsicologico.dataExame), 'years')
                                let periodo = req.body.examePsicologico.codResultado === '6' ? '' : anos + ' anos,' 
                                conclusao = `CONCLUSÃO: ${req.body.current.nomePaciente} ${conclusao} ${periodo}  para ${req.body.current.descricaoExame} da Carteira Nacional de Habilitação. Por ser verdade,` +
                                        ` firmo o presente documento.`

                                //buscando referencias
                                let sqlReferencias = ''
                                ordenaTestes.map(e => e ? sqlReferencias += `select r.* from referencias r inner join testesreferencias tr on r.idreferencias = tr.keyreferencias `+
                                                                            ` inner join testespsico t on t.key = tr.keyTestes and obrigatoria = 'n' and t.key = ${e.key};` : '')
                                //vou adicionar as obrigatórias
                                sqlReferencias += `select r.* from referencias r where obrigatoria = 's';`
                                conection.query(sqlReferencias, (error, r, fields) => {
                                    if(error){
                                        enviaResultado.status = 'erro'
                                        enviaResultado.info = 'Falha de Conexão. Tente Novamente!'
                                        res.json(enviaResultado)
                                    }
                                    if(r){
                                        let referencias = []
                                        r.map(e => e ? e.map(i => referencias.push(i)) : '')
                                        referencias.sort((a,b) => 
                                            a.citacao > b.citacao ? 1 : a.citacao > b.citacao ? -1 : 0 )
                                        
                                        let dadosLaudo = {
                                            analise : analiseI + analiseII,
                                            conclusao : conclusao,
                                            referencias : referencias
                                        }
                                        //res.json(req.body.laudoTemp.observacaoJuridica)   
                                        
                                        let laudo = {
                                          logoLaudo : req.body.laudoTemp.logoLaudo,
                                          tituloLaudo : req.body.laudoTemp.tituloLaudo,
                                          tituloI : 'Identificação',
                                          autor : req.body.laudoTemp.autor,
                                          crp : req.body.laudoTemp.crp,
                                          interessado : req.body.laudoTemp.interessado,
                                          assunto : req.body.laudoTemp.assunto + req.body.current.nomePaciente,
                                          tituloII : 'Demanda',
                                          conteudoTituloII : req.body.laudoTemp.conteudoTituloII,
                                          tituloIII : 'Procedimentos',
                                          conteudoTituloIII : req.body.laudoTemp.conteudoTituloIII,
                                          tituloIV : 'Análise',
                                          conteudoTituloIV : dadosLaudo.analise + periodo + '.',
                                          observacaoGeral : req.body.laudoTemp.observacaoGeral,
                                          conclusao : dadosLaudo.conclusao,
                                          dataAtual : moment().locale('pt-BR').format('LL'),
                                          nomePsicologo : req.body.laudoTemp.autor,
                                          profCRP : req.body.laudoTemp.crp,
                                          tituloReferencias : 'Referências',
                                          conteudoReferencias : dadosLaudo.referencias,
                                          observacaoJuridica : req.body.laudoTemp.observacaoJuridica,
                                        }
                                        conection.query(`select * from dadosempresa inner join cadcidades where dadosempresa.codCidade = cadcidades.codCidade; `,
                                        (erroGerado, resultadoGerado) => {
                                            if(erroGerado){
                                                enviaResultado.status = 'erro'
                                                enviaResultado.info = 'Falha de Conexão. Tente Novamente!'
                                                res.json(enviaResultado)
                                            }
                                            if(resultadoGerado){
                                          
                                            laudo.empresa = resultadoGerado[0]
                                            
                                            var options = {
                                                convertTo : 'pdf' //can be docx, txt, ...
                                            };
                                            carbone.render('./src/api/relatorios/laudoPsicologico.odt', laudo, options, function(err, result){
                                                if (err) {
                                                return console.log(err);
                                                }
                                                // write the result
                                                
                                                let nomeArquivo = `laudoPsico${req.body.current.codPaciente}.pdf`
                                                fs.writeFileSync(caminho + nomeArquivo, result);
                                                enviaResultado.status = 'ok'
                                                enviaResultado.info = 'Laudo Gerado com Sucesso'
                                                enviaResultado.nomeArquivo = `${back}${caminhoPublic}${nomeArquivo}`
                                                res.send(enviaResultado)
                                                //process.exit();
                                                
                                            });
                                            //res.send(laudo) 
                                             }
                                            })
                                    }
                                })
                               
                            }
                        })

                        //res.json(analiseII)
                    }
                   // res.send(req.body)
                })

                
            }
        })
        //res.send(sqlSinteses)
        //res.send(req.body)
    })

    router.post('/carregaexamepsicologico', (req, res) => {
        
        const codPaciente = req.body.record.codPaciente 
        const dataExame = moment(req.body.record.codDataAtend).format('YYYY-MM-DD')
        let sql = `select * from examepsico where codPaciente = ${codPaciente} and  CONVERT(dataExame,date) = CONVERT('${dataExame}', date); `

        conection.query(sql, (error, results, fields) => {
            let resultado = {
                status : '',
                info : '',
                dados : []
            }
            if(error){
                resultado.status = 'erro'
                resultado.info = 'Falha conexão. Favor Tentar novamente!'
                res.send(resultado)
            }
            if(results){
               
                if (results.length > 0){
                    resultado.dados.push(results)
                    let codExPsico = results[0].codExPsico
                    
                    let sqlExPsicoTestes = `select * from examepsicotestes where codExPsico = ${codExPsico};`
                    let sqlExPsicoComposicao = `select * from examepsicocomposicao where codExPsico = ${codExPsico};`
                    conection.query(sqlExPsicoTestes + sqlExPsicoComposicao, (errorB, resultsB) =>{
                        if(errorB){
                            resultado.status = 'erro'
                            resultado.info = 'Falha conexão. Favor Tentar novamente!'
                            res.send(resultado)
                        }
                        if(resultsB){
                            resultado.dados.push(resultsB[0])
                            resultado.dados.push(resultsB[1])
                            resultado.status = 'ok'
                            resultado.info = ''
                        
                            res.send(resultado)
                            

                        }
                    })
            } else {
                resultado.status = 'versao'
                resultado.info = 'Falha Versão Antiga. Este exame não pode ser carregado!'
                res.send(resultado)
            }
        }
         
        })
    
    
    })

    
    server.use('/', router)
}
