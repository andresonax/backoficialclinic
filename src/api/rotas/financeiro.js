const express = require('express')
execSQLQuery = require('../cadastros/cadastro')
const moment = require('moment')
const conection = require('../../config/database')

module.exports = function(server) {
    const router = express.Router() 
    //CRUD cadpais

    //READ ALL
    
    router.post('/financeiroResumo', (req, res) => {
        var sqlResumo = `SELECT SUM(L.VALOREXAME) as first, DATE_FORMAT(L.DATALANCAMENTO,'%Y-%m-%d') AS dates, DESCRICAOTEXAME as keyword, `+  
        ` DATE_FORMAT(CONVERT(L.DATALANCAMENTO,DATE),'%d/%m/%Y') AS datesFormatada `+
        ` FROM livrofinanceiro L INNER JOIN descexame D ON L.CODtipoexame = D.CODdescexame `+
        ` INNER JOIN tipoexame T ON T.CODTEXAME = D.CODTEXAME `+
        ` WHERE (YEAR(L.DATALANCAMENTO) = YEAR(CURRENT_DATE())) AND (WEEK(L.DATALANCAMENTO) = WEEK(CURRENT_DATE())-1) `+ 
        ` GROUP BY DESCRICAOTEXAME, CONVERT(L.DATALANCAMENTO,DATE); `+ 
        ` SELECT SUM(L.VALOREXAME)/DAYOFYEAR(CURRENT_DATE) as 'value', true as checked, `+ 
        ` MAX(DATE_FORMAT(L.DATALANCAMENTO,'%Y-%m-%d')) AS endDate, DATE_FORMAT(DATE_SUB(MAX(L.DATALANCAMENTO), INTERVAL WEEKDAY(CURRENT_DATE)-1 DAY), '%Y-%m-%d') as startDate, `+ 
        ` DESCRICAOTEXAME as 'key'  FROM livrofinanceiro L INNER JOIN descexame D ON L.CODtipoexame = D.CODdescexame `+
        ` INNER JOIN tipoexame T ON T.CODTEXAME = D.CODTEXAME `+
        ` WHERE (YEAR(L.DATALANCAMENTO) = YEAR(CURRENT_DATE())) `+ 
        ` GROUP BY DESCRICAOTEXAME; `
        var sqlTotal = `SELECT SUM(L.VALOREXAME) as totalCaixa ` +
            ` FROM livrofinanceiro L INNER JOIN descexame D ON L.CODtipoexame = D.CODdescexame `+
            ` INNER JOIN tipoexame T ON T.CODTEXAME = D.CODTEXAME `+
            ` WHERE (YEAR(L.DATALANCAMENTO) = YEAR(CURRENT_DATE())) AND (WEEK(L.DATALANCAMENTO) = WEEK(CURRENT_DATE())-1); `
        conection.query(sqlResumo + sqlTotal, (error, results, fields) => {
            if(error){
                res.send(error)
            }
            if(results){
                let resposta = {
                    variacaoAtual : results[0],
                    mediaAtual : results[1],
                    totalCaixa : results[2][0].totalCaixa
                }
                
                res.send(resposta)
            }
        })
    })

    
    server.use('/', router)
}