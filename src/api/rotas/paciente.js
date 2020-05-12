const express = require('express')
execSQLQuery = require('../cadastros/cadastro')
const conection = require('../../config/database')
const {front, back} = require('../../config/variaveis')
const axios = require('axios')
const cep = require('cep-promise')
const moment = require('moment')
//let caminho = `/home/ec2-user/dist/temp/relatorios/` ***************Cloud
const caminho = './src/config/public/relatorios/pacientes/'
const caminhoPublic = 'relatorios/pacientes/'
const carbone = require('carbone')
const fs = require('fs')
const extenso = require('extenso')



module.exports = function(server) {
    const router = express.Router() 
    //CRUD paciente
    var formatData = 'YYYY-MM-DD'
    var formatDataHora = 'YYYY-MM-DD HH:mm'
    //READ ALL
    var sql = 'SELECT * FROM paciente'
    router.get('/paciente', (req, res) => {execSQLQuery(sql, res)})

    //READ POR ID
    var sqlById = `SELECT P.*,C.CODCIDADE AS codNaturalidade, C.UFCIDADE AS ufNaturalidade, `+
        ` C.nomeCidade as nomeNaturalidade,`+
        ` CP.gentilico as gentilico, CNH.codCidade as codCidadeCNH, CNH.nomeCidade AS nomeCidadeCNH, `+
        ` CNH.ufCidade as ufCidadeCNH, RES.codCidade as codCidadeRes, RES.ufcidade as ufRes, `+
        ` RES.nomeCidade as nomeCidadeRes, U.NOME AS nomeUsuarioCad, UA.NOME as nomeUsuario `+
        ` FROM paciente P INNER JOIN cadcidades C ON P.NATURALIDADE = C.CODCIDADE`+
        ` INNER JOIN cadpais CP ON P.CODPAIS = CP.CODPAIS`+
        ` LEFT JOIN cadcidades CNH ON CNH.CODCIDADE = P.CIDADEATUALCNH`+
        ` LEFT JOIN cadcidades RES ON RES.CODCIDADE = P.CIDADE` +
        ` INNER JOIN usuarios U ON U.CODUSUARIO = P.CODUSUARIOCAD `+
        ` INNER JOIN usuarios UA ON UA.CODUSUARIO = P.CODUSUARIO `
    router.get('/paciente/:id?', (req, res) => {
        let filter = ''
        if(req.params.id) filter = ' WHERE P.codPaciente = ' + req.params.id;
        conection.query(sqlById + filter, function(error, results, fields){
            if(error)
              res.json(error)
            else
              res.json(results[0])
          })
    
    })
    //READ POR CPF
    var sqlByCPF = `SELECT P.*,C.CODCIDADE AS codNaturalidade, C.UFCIDADE AS ufNaturalidade, `+
        ` C.nomeCidade as nomeNaturalidade,`+
        ` CP.gentilico as gentilico, CNH.codCidade as codCidadeCNH, CNH.nomeCidade AS nomeCidadeCNH, `+
        ` CNH.ufCidade as ufCidadeCNH, RES.codCidade as codCidadeRes, RES.ufcidade as ufRes, `+
        ` RES.nomeCidade as nomeCidadeRes, U.NOME AS nomeUsuarioCad, UA.NOME as nomeUsuario `+
        ` FROM paciente P INNER JOIN cadcidades C ON P.NATURALIDADE = C.CODCIDADE`+
        ` INNER JOIN cadpais CP ON P.CODPAIS = CP.CODPAIS`+
        ` LEFT JOIN cadcidades CNH ON CNH.CODCIDADE = P.CIDADEATUALCNH`+
        ` LEFT JOIN cadcidades RES ON RES.CODCIDADE = P.CIDADE` +
        ` INNER JOIN usuarios U ON U.CODUSUARIO = P.CODUSUARIOCAD `+
        ` INNER JOIN usuarios UA ON UA.CODUSUARIO = P.CODUSUARIO `
    router.get('/pacienteCPF/:id?', (req, res) => {
        let filter = ''
        if(req.params.id) filter = ' WHERE P.cpfPaciente = ' + req.params.id;
        conection.query(sqlByCPF + filter, function(error, results, fields){
            if(error)
              res.json(error)
            else
              res.json(results[0])
          })
    
    })

    //BUSCA PACIENTE PARA LISTA
    router.post('/pacienteBusca/:busca?', (req, res) =>{
        let sqlBusca = 'SELECT codPaciente, nomePaciente FROM paciente'
        let filter = ''
        if(req.params.busca) filter = ` WHERE NOMEPACIENTE LIKE '${req.params.busca}%' or CPFPACIENTE LIKE '%${req.params.busca}%' order by NOMEPACIENTE`
        conection.query(sqlBusca + filter, function(error, results, fields){
            var options = []
            if(error)
              res.json(error)
            else{
                results.map(e => {
                    options.push({codPaciente : e.codPaciente, nomePaciente : e.nomePaciente})

                })
                res.json(options)
            }
              
          })
    })

    //busca cep
    router.get(`/buscaCep/:cep?`, (req,res) =>{
        cep(req.params.cep)
        .then(resp => {
            res.send(resp)
        })         
            
    })

    //CARREGA LISTAS PARA CADASTRO INICIAL
    router.get('/carregaListas', (req, res) =>{
        let listaTipoDoc = []
        let saida = {}
        axios.get(`${back}tipodoc`)
        .then(resp => {
            saida.listaTipoDoc = resp.data
            // axios.get(`${back}cadcidades`)
            // .then(resp => {
            //     saida.listaCidades = resp.data
            //MUDAR ISSO CARA!!! PELO AMOR DE DEUS!!! VOCÊ ESTÁ NO BANCO NÃO PRECISA FAZER REQUISIÇÕES AXIOS PRO PRÓPRIO BANCO FILHO DA PUTA
                 axios.get(`${back}categoriacnh`)
                .then(resp => {
                    saida.listaCategorias = resp.data
                    axios.get(`${back}tipolog`)
                    .then(resp => {
                        saida.listaTipoLog = resp.data
                        axios.get(`${back}escolaridade`)
                        .then(resp => {
                            saida.listaEscolaridade = resp.data
                            axios.get(`${back}descexameListaMedico`)
                            .then(resp => {
                                saida.listaExamesMedicos = resp.data
                                axios.get(`${back}descexameListaPsico`)
                                .then(resp => {
                                    saida.listaExamesPsico = resp.data
                                        axios.get(`${back}motivoreajuste`)
                                        .then(resp => {
                                            saida.listaReajustes = resp.data
                                            res.send(saida)
                                        })
                                })
                               
                            })
                        })
                        
                        
                    })
                   
                })
                
               
            //})
        })
    })

    //DELETE POR ID
    router.delete('/paciente/:id', (req, res) =>{
        
        execSQLQuery('DELETE FROM paciente where codPaciente = ' + parseInt(req.params.id), res)
    })
    //GERADOR DE RELATÓRIOS
    router.post('/pacienteRelatorios',(req, res) => {
        const {paciente, relatorio, tipo, data, dados} = req.body
        
        let dataAtual = moment(new Date()).format('DD/MM/YYYY')
        const dadosRelatorio = {
            empresa : {},
            paciente,
            data : moment(new Date(data)).format('DD/MM/YYYY'),
            dataAtual,
            protocolo : 0,
            dataExame : undefined,
            prontuario : paciente.prontuario !== '' ? `Prontuário: ${paciente.prontuario}` : '',
            procedimento : tipo === 1 ? 'AGUARDAR ENTREGA DA C.N.H. (VIA CORREIROS - ENDEREÇO DA RESIDÊNCIA)' : 'COMPARECER AO CENTRO DE FORMAÇÃO DE CONDUTORES PARA CURSO DE DIREÇÃO',
            examePaciente : '',
            periodo : '',
            dados,
            totalRecibo : 0,
            totalExtenso : '',
            dataExtenso : moment(new Date()).locale('pt-BR').format('DD [de] MMMM [de] YYYY')
            
        }
        //buscando dados da clínica para relatório
        conection.query('select * from dadosempresa inner join cadcidades where dadosempresa.codCidade = cadcidades.codCidade', (error, results, fields) => {
            if(error){
                res.send(error)
            }
            if(results){
                let empresa = results[0]
                empresa.avatar = `${back}cadastros/empresas/` + empresa.avatar

                dadosRelatorio.empresa = empresa
                //console.log(dadosRelatorio.empresa)
                var options = {
                    convertTo : 'pdf' //can be docx, txt, ...
                };
                //selecionar relatorio escolhido
                let modelo = ''
                let nomeArquivo = ''
                if (relatorio === 'ficha'){
                    modelo = './src/api/relatorios/fichaEmBranco.odt'
                    nomeArquivo = `ficha${paciente.codPaciente}.pdf`
                }
                if (relatorio === 'entrega'){
                    //tenho que protocolar primeiro
                    let sqlEntrega = `select * from protocolo where codPaciente = ${paciente.codPaciente}; select max(dataExame) as dataExame from examemedico where codPaciente = ${paciente.codPaciente}; `+
                        `select max(dataExame) as dataExame from examepsico where codPaciente = ${paciente.codPaciente}`
                    conection.query(sqlEntrega, (error, results, fields) => {
                        if(error){
                            res.send(error)
                        }
                        if(results){
                            let sqlProtocolo = ''
                            
                            if (results[0].length === 0){
                                sqlProtocolo = `insert into protocolo(codPaciente, dataEmissaoProt, dataPrevista, recebimento) `+
                                ` values (${paciente.codPaciente}, '${moment(new Date(dataAtual)).format('YYYY-MM-DD')}','${moment(new Date(data)).format('YYYY-MM-DD')}', 0 )`
                            } else {
                                //console.log(results[1])
                                dadosRelatorio.protocolo = results[0][0].codProtocolo
                                
                                if(results[1].length > 0){
                                    dadosRelatorio.dataExame = moment(new Date(results[1][0].dataExame)).format('DD/MM/YYYY')
                                } else {
                                    if(results[2].length > 0){
                                        dadosRelatorio.dataExame = moment(new Date(results[2][0].dataExame)).format('DD/MM/YYYY')
                                    } else {
                                        res.send({
                                            status : 'erro',
                                            info : 'Este paciente ainda não realizou exames!'
                                        })
                                    }
                                }
                                sqlProtocolo = `update protocolo set dataEmissaoProt = '${moment(new Date(dataAtual)).format('YYYY-MM-DD')}', `+
                                    `dataPrevista = '${moment(new Date(data)).format('YYYY-MM-DD')}' where codPaciente = ${paciente.codPaciente}`
                            }
                            conection.query(sqlProtocolo, (erro, resultado, campos) =>{
                                if(erro){
                                    res.send(erro)
                                   
                                }
                                if(resultado){
                                    if(resultado.insertId !== 0) dadosRelatorio.protocolo = resultado.insertId 
                                    modelo = './src/api/relatorios/protocoloEntrega.odt'
                                    nomeArquivo = `protocolo${paciente.codPaciente}.pdf` 
                                    console.log(dadosRelatorio.dataExame)
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
                           
                        }
                    })
                    
                } else if(relatorio === 'comparecimento'){
                    conection.query(`select * from exdisponiveis where codExEscolhido = ${paciente.examePaciente}`, (error, results, fields) =>{
                        if(error){
                            res.send(error)
                        }
                        if(results){
                            dadosRelatorio.examePaciente = results[0].descExEscol
                            dadosRelatorio.periodo = `${moment(new Date(req.body.data)).format('HH:mm')} às ${moment(new Date(req.body.dataFinal)).format('HH:mm')}`
                            modelo = './src/api/relatorios/comprovante.odt'
                            nomeArquivo = `comprovante${paciente.codPaciente}.pdf` 
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
                    } )
                    
                } else if(relatorio === 'recibo'){
                    dadosRelatorio.dados.map(e => dadosRelatorio.totalRecibo += e.valorTotal)
                    dadosRelatorio.totalExtenso = extenso(dadosRelatorio.totalRecibo) + " reais"
                    dadosRelatorio.totalRecibo = dadosRelatorio.totalRecibo.toLocaleString('pt-BR', {style:'currency', currency : 'BRL'})
                    modelo = './src/api/relatorios/recibo.odt'
                    nomeArquivo = `recibo${paciente.codPaciente}.pdf` 
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
                
            }
        })

    })
    

    //INSERIR 
    router.post('/paciente', (req,res) =>{
        const prontuario = req.body.prontuario.substring(0,15)
        const guia = req.body.guia
        const nomePaciente = req.body.nomePaciente.substring(0,60)
        const cpfPaciente = req.body.cpfPaciente.substring(0,15)
        const tipoDoc = req.body.tipoDoc
        const docPaciente = req.body.docPaciente.substring(0,20)
        const orgaoPaciente = req.body.orgaoPaciente.substring(0,10)
        const ufDoc = req.body.ufDoc.substring(0,15)
        const nascPaciente = moment(new Date(req.body.nascPaciente)).format(formatData)
        const sexoPaciente = req.body.sexoPaciente.substring(0,1)
        const naturalidade =  req.body.naturalidade
        const nomePai = req.body.nomePai.substring(0,60)
        const nomeMae = req.body.nomeMae.substring(0,60)
        const profPaciente = req.body.profPaciente.substring(0,30)
        const codPais = req.body.codPais
        const tipoLog = req.body.tipoLog
        const logPaciente = req.body.logPaciente.substring(0,60)
        const numeroResid = req.body.numeroResid.substring(0,8)
        const numComplemento = req.body.numComplemento.substring(0,15)
        const cepPaciente = req.body.cepPaciente.substring(0,8)
        const cidade = req.body.cidade
        const telPaciente = req.body.telPaciente.substring(0,13)
        const celPaciente = req.body.celPaciente.substring(0,13)
        const dataHabPaciente = req.body.dataHabPaciente
        const emailPaciente = req.body.emailPaciente.substring(0,40)
        const doadorPaciente = req.body.doadorPaciente.substring(0,1)
        const codUsuario = req.body.codUsuario
        const ultimaAlteracaoPac = req.body.ultimaAlteracaoPac
        const examePaciente = req.body.examePaciente
        const cnhPretPaciente = req.body.cnhPretPaciente
        const categoriaAtual = req.body.categoriaAtual
        const cidadeAtualCnh = req.body.cidadeAtualCnh
        const dataCadastro = req.body.dataCadastro
        const bairroPaciente = req.body.bairroPaciente.substring(0,50)
        const codUsuarioCad = req.body.codUsuarioCad
        const obsPaciente = req.body.obsPaciente.substring(0,150)
        const codEscolaridade = req.body.codEscolaridade
        let campo = ''
        let valor = ''
        if(dataHabPaciente) {
            campo =', dataHabPaciente'
            valor = `, '${dataHabPaciente}'`
        } 
        
        execSQLQuery(`INSERT INTO paciente(prontuario, guia, nomePaciente, cpfPaciente, tipoDoc, docPaciente, orgaoPaciente, ufDoc, nascPaciente, sexoPaciente, `+
            ` naturalidade, nomePai, nomeMae, profPaciente, codPais, tipoLog, logPaciente, numeroResid, numComplemento, cepPaciente, cidade, `+
            ` telPaciente, celPaciente${campo}, emailPaciente, doadorPaciente, codUsuario, ultimaAlteracaoPac, examePaciente, cnhPretPaciente, categoriaAtual, cidadeAtualCnh, dataCadastro, `+
            ` bairroPaciente, codUsuarioCad, obsPaciente, codEscolaridade ) `+
            ` values('${prontuario}', ${guia}, '${nomePaciente}', '${cpfPaciente}', ${tipoDoc}, '${docPaciente}', '${orgaoPaciente}', '${ufDoc}', '${nascPaciente}', `+
            ` '${sexoPaciente}', ${naturalidade}, '${nomePai}', '${nomeMae}', '${profPaciente}', ${codPais}, ${tipoLog}, '${logPaciente}', '${numeroResid}', '${numComplemento}', `+ 
            ` '${cepPaciente}', '${cidade}', '${telPaciente}', '${celPaciente}'${valor}, '${emailPaciente}', '${doadorPaciente}', ${codUsuario}, '${ultimaAlteracaoPac}', ${examePaciente}, `+
            ` ${cnhPretPaciente}, ${categoriaAtual}, ${cidadeAtualCnh}, '${dataCadastro}', '${bairroPaciente}', ${codUsuarioCad}, '${obsPaciente}', ${codEscolaridade})`, res)
    })

    //ATUALIZAR
    router.patch('/paciente/:id', (req,res) =>{
        const id = parseInt(req.params.id)
        const prontuario = req.body.prontuario.substring(0,15)
        const guia = req.body.guia
        const nomePaciente = req.body.nomePaciente.substring(0,60)
        const cpfPaciente = req.body.cpfPaciente.substring(0,15)
        const tipoDoc = req.body.tipoDoc
        const docPaciente = req.body.docPaciente.substring(0,20)
        const orgaoPaciente = req.body.orgaoPaciente.substring(0,10)
        const ufDoc = req.body.ufDoc.substring(0,15)
        const nascPaciente = moment(req.body.nascPaciente).format(formatData)
        const sexoPaciente = req.body.sexoPaciente.substring(0,1)
        const naturalidade = req.body.naturalidade
        const nomePai = req.body.nomePai.substring(0,60)
        const nomeMae = req.body.nomeMae.substring(0,60)
        const profPaciente = req.body.profPaciente.substring(0,30)
        const codPais = req.body.codPais
        const tipoLog = req.body.tipoLog
        const logPaciente = req.body.logPaciente.substring(0,60)
        const numeroResid = req.body.numeroResid.substring(0,8)
        const numComplemento = req.body.numComplemento.substring(0,15)
        const cepPaciente = req.body.cepPaciente.substring(0,8)
        const cidade = req.body.cidade
        const telPaciente = req.body.telPaciente.substring(0,13)
        const celPaciente = req.body.celPaciente.substring(0,13)
        const dataHabPaciente = req.body.dataHabPaciente 
        const emailPaciente = req.body.emailPaciente.substring(0,40)
        const doadorPaciente = req.body.doadorPaciente.substring(0,1)
        const codUsuario = req.body.codUsuario
        const ultimaAlteracaoPac = moment(new Date(req.body.ultimaAlteracaoPac)).format(formatDataHora)
        const examePaciente = req.body.examePaciente
        const cnhPretPaciente = req.body.cnhPretPaciente
        const categoriaAtual = req.body.categoriaAtual
        const cidadeAtualCnh = req.body.cidadeAtualCnh ? req.body.cidadeAtualCnh : 0
        const dataCadastro = moment(new Date(req.body.dataCadastro)).format(formatDataHora)
        const bairroPaciente = req.body.bairroPaciente.substring(0,50)
        const codUsuarioCad = req.body.codUsuarioCad
        const obsPaciente = req.body.obsPaciente.substring(0,150)
        const codEscolaridade = req.body.codEscolaridade
        let campo = ''
        
        if(dataHabPaciente) {
            if(dataHabPaciente !== ''){
               campo = `dataHabPaciente = '${moment(new Date(req.body.dataHabPaciente)).format(formatData)}', `
            }  
        } 

        execSQLQuery(`update paciente set prontuario = '${prontuario}', guia = ${guia}, nomePaciente = '${nomePaciente}', cpfPaciente = '${cpfPaciente}', 
        tipoDoc = '${tipoDoc}', docPaciente = '${docPaciente}', orgaoPaciente = '${orgaoPaciente}', ufDoc = '${ufDoc}', nascPaciente = '${nascPaciente}', 
        sexoPaciente = '${sexoPaciente}', naturalidade = '${naturalidade}', nomePai = '${nomePai}', nomeMae = '${nomeMae}', profPaciente = '${profPaciente}', 
        codPais = '${codPais}', tipoLog = '${tipoLog}', logPaciente = '${logPaciente}', numeroResid = '${numeroResid}', numComplemento = '${numComplemento}', 
        cepPaciente = '${cepPaciente}', cidade = '${cidade}', telPaciente = '${telPaciente}', celPaciente = '${celPaciente}', ${campo}
        emailPaciente = '${emailPaciente}', doadorPaciente = '${doadorPaciente}', codUsuario = '${codUsuario}', ultimaAlteracaoPac = '${ultimaAlteracaoPac}', examePaciente = '${examePaciente}', 
        cnhPretPaciente = '${cnhPretPaciente}', categoriaAtual = ${categoriaAtual}, cidadeAtualCnh = '${cidadeAtualCnh}', dataCadastro = '${dataCadastro}', bairroPaciente = '${bairroPaciente}', 
        codUsuarioCad = '${codUsuarioCad}', obsPaciente = '${obsPaciente}', codEscolaridade = ${codEscolaridade}  where codPaciente = ${id}`, res)
    })
    server.use('/', router)
}