const express = require('express')
execSQLQuery = require('../cadastros/cadastro')
const moment = require('moment')
const conection = require('../../config/database')

module.exports = function(server) {
    const router = express.Router() 
    //CRUD renach

    //READ ALL
    //var sql = 'SELECT * FROM renach'
    router.post('/dashboard', (req, res) => {
        let {campo , ordem , filtroNome, filtroNomeEspera} = req.body
        
        //vou fazer a lista de carteiras vencidas ao longo do mês
        let sqlVencidas = `SELECT DATE_FORMAT(VALIDADE, '%Y-%m-%d') as x, COUNT(VALIDADE) as y  FROM (SELECT P.CODPACIENTE, MAX(EM.DATAVALIDADE) AS validade, NOMEPACIENTE, TELPACIENTE, CELPACIENTE, EMAILPACIENTE `+
                        ` FROM examemedico EM INNER JOIN paciente P ON EM.CODPACIENTE = P.CODPACIENTE  WHERE CONVERT(DATAVALIDADE,DATE) = CONVERT(CURDATE(), DATE) GROUP BY CODPACIENTE  `+
                        ` UNION `+
                        ` SELECT P.CODPACIENTE, MAX(EP.DATAVALIDADE) AS VALIDADE, NOMEPACIENTE, TELPACIENTE, CELPACIENTE, EMAILPACIENTE `+
                        ` FROM examepsico EP INNER JOIN paciente P ON EP.CODPACIENTE = P.CODPACIENTE WHERE CONVERT(DATAVALIDADE,DATE) < CONVERT(CURDATE(), DATE) GROUP BY CODPACIENTE ) AS TOTAL `+
                        ` WHERE VALIDADE BETWEEN DATE_ADD(CURRENT_DATE(), INTERVAL -30 DAY) AND CURRENT_DATE() `+
                        ` GROUP BY VALIDADE ORDER BY VALIDADE ;`+
                         `SELECT COUNT(VALIDADE) as totalMes FROM (SELECT P.CODPACIENTE, MAX(EM.DATAVALIDADE) AS VALIDADE, NOMEPACIENTE, TELPACIENTE, CELPACIENTE, EMAILPACIENTE `+
                        `FROM examemedico EM INNER JOIN paciente P ON EM.CODPACIENTE = P.CODPACIENTE  WHERE CONVERT(DATAVALIDADE,DATE) = CONVERT(CURDATE(), DATE) GROUP BY CODPACIENTE `+ 
                        `UNION `+
                        `SELECT P.CODPACIENTE, MAX(EP.DATAVALIDADE) AS VALIDADE, NOMEPACIENTE, TELPACIENTE, CELPACIENTE, EMAILPACIENTE `+
                        `FROM examepsico EP INNER JOIN paciente P ON EP.CODPACIENTE = P.CODPACIENTE WHERE CONVERT(DATAVALIDADE,DATE) < CONVERT(CURDATE(), DATE) GROUP BY CODPACIENTE ) AS TOTAL `+
                        `WHERE VALIDADE BETWEEN DATE_ADD(CURRENT_DATE(), INTERVAL -30 DAY) AND CURRENT_DATE();`+
                        `SELECT COUNT(VALIDADE) totalHistorico FROM (SELECT P.CODPACIENTE, MAX(EM.DATAVALIDADE) AS VALIDADE, NOMEPACIENTE, TELPACIENTE, CELPACIENTE, EMAILPACIENTE `+
                            `FROM examemedico EM INNER JOIN paciente P ON EM.CODPACIENTE = P.CODPACIENTE  WHERE CONVERT(DATAVALIDADE,DATE) = CONVERT(CURDATE(), DATE) GROUP BY CODPACIENTE `+ 
                            `UNION `+
                            `SELECT P.CODPACIENTE, MAX(EP.DATAVALIDADE) AS VALIDADE, NOMEPACIENTE, TELPACIENTE, CELPACIENTE, EMAILPACIENTE `+
                            `FROM examepsico EP INNER JOIN paciente P ON EP.CODPACIENTE = P.CODPACIENTE WHERE CONVERT(DATAVALIDADE,DATE) < CONVERT(CURDATE(), DATE) GROUP BY CODPACIENTE ) AS TOTAL `+
                            `WHERE VALIDADE < DATE_ADD(CURRENT_DATE(), INTERVAL -30 DAY); `+
                         `SELECT COUNT(CODPACIENTE) as totalDia FROM (SELECT P.CODPACIENTE, MAX(EM.DATAVALIDADE) AS VALIDADE, NOMEPACIENTE, TELPACIENTE, CELPACIENTE, EMAILPACIENTE `+
                           `     FROM examemedico EM INNER JOIN paciente P ON EM.CODPACIENTE = P.CODPACIENTE  WHERE CONVERT(DATAVALIDADE,DATE) = CONVERT(CURDATE(), DATE) GROUP BY CODPACIENTE  `+
                           ` UNION `+
                           ` SELECT P.CODPACIENTE, MAX(EP.DATAVALIDADE) AS VALIDADE, NOMEPACIENTE, TELPACIENTE, CELPACIENTE, EMAILPACIENTE `+
                           `     FROM examepsico EP INNER JOIN paciente P ON EP.CODPACIENTE = P.CODPACIENTE WHERE CONVERT(DATAVALIDADE,DATE) = CONVERT(CURDATE(), DATE)  GROUP BY CODPACIENTE ) AS TOTAL;`
        
        let sqlAtendimentos = `SELECT COUNT(*) as Contador, MONTH(DATARESULT) as mes FROM (select CONVERT(dataExame, date) as dataResult,nomepaciente, descricaoExame,  `+
                        ` descricaoTExame, categoria, descricaoResult from paciente  `+
                        ` inner join examemedico on examemedico.codPaciente = paciente.codPaciente `+ 
                        ` inner join categoriacnh on categoriacnh.codCategoria = examemedico.codCategoria `+ 
                        ` inner join descexame on examemedico.codDescExame = descexame.codDescExame `+ 
                        ` inner join resultexame on resultexame.codResultado = examemedico.codResultado `+ 
                        ` inner join tipoexame on descexame.codTExame = tipoexame.codTExame `+ 
                        ` where  (YEAR(dataexame) = YEAR(CURRENT_DATE())) AND (MONTH(dataexame) = MONTH(CURRENT_DATE())) `+
                        ` and tipoexame.codTExame = 0 `+ 
                        ` group by dataResult,nomepaciente, descricaoExame, descricaoTExame, categoria, descricaoResult `+
                        ` UNION select CONVERT(dataExame, date) as dataResult,nomepaciente, descricaoExame, `+ 
                        ` descricaoTExame, categoria, descricaoResult from paciente `+ 
                        ` inner join examepsico on examepsico.codPaciente = paciente.codPaciente `+ 
                        ` inner join categoriacnh on categoriacnh.codCategoria = examepsico.codCategoria `+ 
                        ` inner join descexame on examepsico.codDescExame = descexame.codDescExame `+ 
                        ` inner join resultexame on resultexame.codResultado = examepsico.codResultado `+ 
                        ` inner join tipoexame on descexame.codTExame = tipoexame.codTExame `+ 
                        ` where  (YEAR(dataexame) = YEAR(CURRENT_DATE())) AND (MONTH(dataexame) = MONTH(CURRENT_DATE())) `+
                        ` and tipoexame.codTExame = 1 `+ 
                        ` group by dataResult,nomepaciente, descricaoExame, descricaoTExame, categoria, descricaoResult) as UNIAO `+
                        ` GROUP BY mes; `+
                        `SELECT COUNT(*) as Contador, MONTH(DATARESULT) as mes FROM (select CONVERT(dataExame, date) as dataResult,nomepaciente, descricaoExame, `+ 
                        `descricaoTExame, categoria, descricaoResult from paciente `+ 
                        `inner join examemedico on examemedico.codPaciente = paciente.codPaciente `+ 
                        `inner join categoriacnh on categoriacnh.codCategoria = examemedico.codCategoria `+ 
                        `inner join descexame on examemedico.codDescExame = descexame.codDescExame `+ 
                        `inner join resultexame on resultexame.codResultado = examemedico.codResultado `+ 
                        `inner join tipoexame on descexame.codTExame = tipoexame.codTExame `+ 
                        `WHERE MONTH(dataExame)=MONTH(ADDDATE(NOW(), INTERVAL -1 MONTH)) AND YEAR(dataExame)=YEAR(ADDDATE(NOW(), INTERVAL -1 MONTH)) `+
                        `and tipoexame.codTExame = 0 `+ 
                        `group by dataResult,nomepaciente, descricaoExame, descricaoTExame, categoria, descricaoResult `+
                        `UNION select CONVERT(dataExame, date) as dataResult,nomepaciente, descricaoExame, `+ 
                        `descricaoTExame, categoria, descricaoResult from paciente `+ 
                        `inner join examepsico on examepsico.codPaciente = paciente.codPaciente `+ 
                        `inner join categoriacnh on categoriacnh.codCategoria = examepsico.codCategoria `+ 
                        `inner join descexame on examepsico.codDescExame = descexame.codDescExame `+ 
                        `inner join resultexame on resultexame.codResultado = examepsico.codResultado `+ 
                        `inner join tipoexame on descexame.codTExame = tipoexame.codTExame `+ 
                        `WHERE MONTH(dataExame)=MONTH(ADDDATE(NOW(), INTERVAL -1 MONTH)) AND YEAR(dataExame)=YEAR(ADDDATE(NOW(), INTERVAL -1 MONTH)) `+
                        `and tipoexame.codTExame = 1 `+ 
                        `group by dataResult,nomepaciente, descricaoExame, descricaoTExame, categoria, descricaoResult) as UNIAO `+
                        `GROUP BY mes;` +
                        `SELECT COUNT(*) as Contador, WEEK(DATARESULT) as mes FROM (select CONVERT(dataExame, date) as dataResult,nomepaciente, descricaoExame, `+ 
                        `descricaoTExame, categoria, descricaoResult from paciente `+ 
                        `inner join examemedico on examemedico.codPaciente = paciente.codPaciente `+ 
                        `inner join categoriacnh on categoriacnh.codCategoria = examemedico.codCategoria `+ 
                        `inner join descexame on examemedico.codDescExame = descexame.codDescExame `+ 
                        `inner join resultexame on resultexame.codResultado = examemedico.codResultado `+ 
                        `inner join tipoexame on descexame.codTExame = tipoexame.codTExame `+ 
                        `where  (YEAR(dataexame) = YEAR(CURRENT_DATE())) AND (WEEK(dataexame) = WEEK(CURRENT_DATE())) `+ 
                        `and tipoexame.codTExame = 0 `+ 
                        `group by dataResult,nomepaciente, descricaoExame, descricaoTExame, categoria, descricaoResult `+
                        `UNION select CONVERT(dataExame, date) as dataResult,nomepaciente, descricaoExame, `+ 
                        `descricaoTExame, categoria, descricaoResult from paciente `+ 
                        `inner join examepsico on examepsico.codPaciente = paciente.codPaciente `+ 
                        `inner join categoriacnh on categoriacnh.codCategoria = examepsico.codCategoria `+ 
                        `inner join descexame on examepsico.codDescExame = descexame.codDescExame `+ 
                        `inner join resultexame on resultexame.codResultado = examepsico.codResultado `+ 
                        `inner join tipoexame on descexame.codTExame = tipoexame.codTExame `+ 
                        `where  (YEAR(dataexame) = YEAR(CURRENT_DATE()))  AND (WEEK(dataexame) = WEEK(CURRENT_DATE())) `+ 
                        `and tipoexame.codTExame = 1 `+ 
                        `group by dataResult,nomepaciente, descricaoExame, descricaoTExame, categoria, descricaoResult) as UNIAO `+
                        `GROUP BY mes;` +
                        `SELECT COUNT(*) as Contador, WEEK(DATARESULT) as mes FROM (select CONVERT(dataExame, date) as dataResult,nomepaciente, descricaoExame, `+ 
                        `descricaoTExame, categoria, descricaoResult from paciente `+ 
                        `inner join examemedico on examemedico.codPaciente = paciente.codPaciente `+ 
                        `inner join categoriacnh on categoriacnh.codCategoria = examemedico.codCategoria `+ 
                        `inner join descexame on examemedico.codDescExame = descexame.codDescExame `+ 
                        `inner join resultexame on resultexame.codResultado = examemedico.codResultado `+ 
                        `inner join tipoexame on descexame.codTExame = tipoexame.codTExame `+ 
                        `where  (YEAR(dataexame) = YEAR(CURRENT_DATE())) AND (WEEK(dataexame) = WEEK(CURRENT_DATE()) -1) `+ 
                        `and tipoexame.codTExame = 0 `+ 
                        `group by dataResult,nomepaciente, descricaoExame, descricaoTExame, categoria, descricaoResult `+
                        `UNION select CONVERT(dataExame, date) as dataResult,nomepaciente, descricaoExame, `+ 
                        `descricaoTExame, categoria, descricaoResult from paciente `+ 
                        `inner join examepsico on examepsico.codPaciente = paciente.codPaciente `+ 
                        `inner join categoriacnh on categoriacnh.codCategoria = examepsico.codCategoria `+ 
                        `inner join descexame on examepsico.codDescExame = descexame.codDescExame `+ 
                        `inner join resultexame on resultexame.codResultado = examepsico.codResultado `+ 
                        `inner join tipoexame on descexame.codTExame = tipoexame.codTExame `+ 
                        `where  (YEAR(dataexame) = YEAR(CURRENT_DATE()))  AND (WEEK(dataexame) = WEEK(CURRENT_DATE())-1) `+ 
                        `and tipoexame.codTExame = 1 `+ 
                        `group by dataResult,nomepaciente, descricaoExame, descricaoTExame, categoria, descricaoResult) as UNIAO `+
                        `GROUP BY mes;`
            let sqlTiposExames = `SELECT COUNT(*) as contador, descricaoTExame FROM (select CONVERT(dataExame, date) as dataResult,nomepaciente, descricaoExame, `+ 
                                    ` descricaoTExame, categoria, descricaoResult from paciente ` + 
                                    ` inner join examemedico on examemedico.codPaciente = paciente.codPaciente ` + 
                                    ` inner join categoriacnh on categoriacnh.codCategoria = examemedico.codCategoria ` + 
                                    ` inner join descexame on examemedico.codDescExame = descexame.codDescExame ` + 
                                    ` inner join resultexame on resultexame.codResultado = examemedico.codResultado ` + 
                                    ` inner join tipoexame on descexame.codTExame = tipoexame.codTExame ` + 
                                    ` where  (YEAR(dataexame) = YEAR(CURRENT_DATE())) AND (MONTH(dataexame) = MONTH(CURRENT_DATE())) ` +
                                    ` and tipoexame.codTExame = 0 ` + 
                                    ` group by dataResult,nomepaciente, descricaoExame, descricaoTExame, categoria, descricaoResult ` +
                                    ` UNION select CONVERT(dataExame, date) as dataResult,nomepaciente, descricaoExame, ` + 
                                    ` descricaoTExame, categoria, descricaoResult from paciente ` + 
                                    ` inner join examepsico on examepsico.codPaciente = paciente.codPaciente ` + 
                                    ` inner join categoriacnh on categoriacnh.codCategoria = examepsico.codCategoria ` + 
                                    ` inner join descexame on examepsico.codDescExame = descexame.codDescExame ` + 
                                    ` inner join resultexame on resultexame.codResultado = examepsico.codResultado ` + 
                                    ` inner join tipoexame on descexame.codTExame = tipoexame.codTExame ` + 
                                    ` where  (YEAR(dataexame) = YEAR(CURRENT_DATE())) AND (MONTH(dataexame) = MONTH(CURRENT_DATE())) ` +
                                    ` and tipoexame.codTExame = 1 ` + 
                                    ` group by dataResult,nomepaciente, descricaoExame, descricaoTExame, categoria, descricaoResult) as UNIAO ` +
                                    ` GROUP BY descricaoTExame;`
            let sqlRanking = `select count(codexame) as y,descricaoExame as x from paciente `+ 
                    `inner join examemedico on examemedico.codPaciente = paciente.codPaciente `+ 
                    `inner join categoriacnh on categoriacnh.codCategoria = examemedico.codCategoria `+ 
                    `inner join descexame on examemedico.codDescExame = descexame.codDescExame `+ 
                    `inner join resultexame on resultexame.codResultado = examemedico.codResultado `+ 
                    `inner join tipoexame on descexame.codTExame = tipoexame.codTExame `+ 
                    `where  (YEAR(dataexame) = YEAR(CURRENT_DATE())) AND (MONTH(dataexame) = MONTH(CURRENT_DATE())) `+
                    `and tipoexame.codTExame = 0 `+ 
                    `group by descricaoExame, descricaoTExame; `+
                    `select count(codExPsico) as y,descricaoExame as x from paciente `+
                    `inner join examepsico on examepsico.codPaciente = paciente.codPaciente `+ 
                    `inner join categoriacnh on categoriacnh.codCategoria = examepsico.codCategoria `+ 
                    `inner join descexame on examepsico.codDescExame = descexame.codDescExame `+ 
                    `inner join resultexame on resultexame.codResultado = examepsico.codResultado `+ 
                    `inner join tipoexame on descexame.codTExame = tipoexame.codTExame `+ 
                    `where  (YEAR(dataexame) = YEAR(CURRENT_DATE())) AND (MONTH(dataexame) = MONTH(CURRENT_DATE())) `+
                    `and tipoexame.codTExame = 1 `+ 
                    `group by descricaoExame, descricaoTExame;`
           
            let filtro = ` and (nomePaciente like '%${filtroNome}%')`
            let sqlAtendidos = `set @num = 0;select (@num := @num + 1) as posicao, count(paciente.codPaciente) as contagem, paciente.codPaciente, nomePaciente, `+  
                ` TIMESTAMPDIFF (YEAR,nascPaciente,CURDATE()) as idade, descricaoExame from paciente inner join filaatendimento on `+  
                ` paciente.codPaciente = filaatendimento.codPaciente inner join `+ 
                ` exdisponiveis on exdisponiveis.codExEscolhido = paciente.examePaciente `+ 
                ` inner join descexame on filaatendimento.codDescExame = descexame.codDescExame `+  
                ` inner join categoriacnh on categoriacnh.codCategoria = paciente.cnhPretPaciente `+ 
                ` left join escolaridade on paciente.codEscolaridade = escolaridade.codEscolaridade `+ 
                ` inner join cadcidades on cadcidades.codCidade = paciente.naturalidade `+ 
                ` inner join tipodoc on tipodoc.codTipo = paciente.tipoDoc `+ 
                ` inner join tipoexame on descexame.codTExame = tipoexame.codTExame `+
                ` WHERE CONVERT(CODDATAATEND,DATE) = CONVERT(CURDATE(), DATE) `+ filtro +
                ` group by nomePaciente,idade `+
                ` order by nomePaciente;`
            
            filtro = ` and (nomePaciente like '%${filtroNomeEspera}%')`
            let espera = `set @numE = 0;select (@numE := @numE + 1) as posicao, count(paciente.codPaciente) as contagem, paciente.codPaciente, nomePaciente, `+  
                ` TIMESTAMPDIFF (YEAR,nascPaciente,CURDATE()) as idade, descricaoExame from paciente inner join filaatendimento on `+  
                ` paciente.codPaciente = filaatendimento.codPaciente inner join `+ 
                ` exdisponiveis on exdisponiveis.codExEscolhido = paciente.examePaciente `+ 
                ` inner join descexame on filaatendimento.codDescExame = descexame.codDescExame `+  
                ` inner join categoriacnh on categoriacnh.codCategoria = paciente.cnhPretPaciente `+ 
                ` left join escolaridade on paciente.codEscolaridade = escolaridade.codEscolaridade `+ 
                ` inner join cadcidades on cadcidades.codCidade = paciente.naturalidade `+ 
                ` inner join tipodoc on tipodoc.codTipo = paciente.tipoDoc `+ 
                ` inner join tipoexame on descexame.codTExame = tipoexame.codTExame `+
                ` WHERE CONVERT(CODDATAPREV,DATE) = CONVERT(CURDATE(), DATE) `+ filtro + 
                ` group by nomePaciente,idade `+
                ` order by nomePaciente;`
                    
        conection.query(sqlVencidas + sqlAtendimentos + sqlTiposExames + sqlRanking + sqlAtendidos + espera, (error, results, fields) =>{
            if(error){
               
                res.send(error)
            }
            if(results){
                //res.send(results)
                let resposta ={
                    visitData : [],
                    totalMes : 0,
                    totalHistorico : 0,
                    totalDia : 0,
                    totalGeral : 0,
                    atendimentosMes : 0,
                    atendimentosMesAnterior : 0,
                    mes : '',
                    atendimentosSemana : 0,
                    atendimentosSemanaAnterior : 0,
                    percentSemana : 0,
                    percentMes : 0,
                    tipoexame : [],
                    rankingMedico : [],
                    rankingPsicologico : [],
                    offlineChartData: [],
                    salesTypeData: [],
                    salesTypeDataOnline: [],
                    salesTypeDataOffline: [],
                    radarData: [],
                    atendidos : [],
                    espera : []

                }
                let visitDataTemp = results[0]
                resposta.totalGeral = results[1][0].totalMes + results[2][0].totalHistorico
                resposta.totalHistorico = results[2][0]
                let acumulador = 0
                resposta.visitData = visitDataTemp.map((e,v,i) => {
                    acumulador += e.y
                    return({
                    'x' : e.x,
                    'y' : e.y = acumulador} )}
                    )
                resposta.totalMes = results[1][0]
                resposta.totalDia = results[3][0]
                //a seguir dados atendimentos
                
                let months = [
                    "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho",
                    "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"
                ]
                
                resposta.atendimentosMes =  results && results[4][0] ? results[4][0].Contador : 0
                resposta.mes = results[4][0] ? months[results[4][0].mes - 1] : months[moment().month]
                resposta.atendimentosMesAnterior = results[5][0] ? results[5][0].Contador : 0
                resposta.atendimentosSemana = results[6][0] ? results[6][0].Contador : 0
                resposta.atendimentosSemanaAnterior = results[7][0] ? results[7][0].Contador : 0
                //calculos para mostrar porcentagem de acordo com sentença
                let percent = resposta.atendimentosMesAnterior === 0 ? 0 : resposta.atendimentosMes / resposta.atendimentosMesAnterior * 100
                let percentSemana = resposta.atendimentosSemanaAnterior === 0 ? 0 : resposta.atendimentosSemana / resposta.atendimentosSemanaAnterior * 100
                percent > 0 ? percent > 100 ? percent = percent - 100 : percent = (100 - percent) * -1 : percent = 0
                percentSemana > 0 ? percentSemana > 100 ? percentSemana = percentSemana - 100 : percentSemana = (100 - percentSemana) *-1 : percent = 0
                resposta.percentMes = percent
                resposta.percentSemana = percentSemana

                //tipo exame
                resposta.tipoexame = results[8]

                //ranking
                resposta.rankingMedico = results[9]
                resposta.rankingPsicologico = results[10]

                //atendidos e espera
                resposta.atendidos = results[12]
                resposta.espera = results[14]
                res.send(resposta)
            }
        })
    
    })

    
    server.use('/', router)
}