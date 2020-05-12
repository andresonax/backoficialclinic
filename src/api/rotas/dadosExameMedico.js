const express = require('express')
execSQLQuery = require('../cadastros/cadastro')

module.exports = function(server) {
    const router = express.Router() 
    //CRUD cadpais

    //READ ALL
    var sql = 'SELECT * FROM dadosexmedico'
    router.get('/dadosexmedico', (req, res) => {execSQLQuery(sql, res)})

    //READ POR ID
    router.get('/dadosexmedico/:id?', (req, res) => {
        let filter = ''
        if(req.params.id) filter = ' WHERE codExame = ' + req.params.id;
        execSQLQuery(sql + filter, res)})

    //DELETE POR ID
    router.delete('/dadosexmedico/:id', (req, res) =>{
        execSQLQuery('DELETE FROM cadpais where id = ' + parseInt(req.params.id), res)
    })

    //INSERIR 
    router.post('/dadosexmedico', (req,res) =>{
        const codExame       = req.body.codExame
        const codPaciente    = req.body.codPaciente
        const acVisSemCorrD  = req.body.acVisSemCorrD
        const acVisSemCorrE  = req.body.acVisSemCorrE
        const acVisComCorrD  = req.body.acVisComCorrD
        const acVisComCorrE  = req.body.acVisComCorrE
        const coverTest      = req.body.coverTest
        const testIshihara   = req.body.testIshihara
        const lantVermelha   = req.body.lantVermelha
        const lantVerde      = req.body.lantVerde
        const latAmarela     = req.body.latAmarela
        const visaoProfund   = req.body.visaoProfund
        const visaoNotur     = req.body.visaoNotur
        const resOfusca      = req.body.resOfusca
        const campoVisualD   = req.body.campoVisualD
        const campoVisualE   = req.body.campoVisualE
        const dinamoD        = req.body.dinamoD
        const dinamoE        = req.body.dinamoE
        const dinamoLombar   = req.body.dinamoLombar
        const acAudicao      = req.body.acAudicao
        const pArterial      = req.body.pArterial
        const pulso          = req.body.pulso
        const auscNum        = req.body.auscNum
        const apLocomot      = req.body.apLocomot
        const sitNerv        = req.body.sitNerv
        const outApar        = req.body.outApar
        const codRestricao   = req.body.codRestricao
        const cidPac         = req.body.cidPac
        execSQLQuery(`INSERT INTO dadosexmedico( ` +
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
            ` cidPac,`+         
            `) values( `+
            ` ${codExame},`+       
            ` ${codPaciente},`+    
            ` ${acVisSemCorrD},`+  
            ` ${acVisSemCorrE},`+  
            ` ${acVisComCorrD},`+  
            ` ${acVisComCorrE},`+  
            ` ${coverTest},`+      
            ` ${testIshihara},`+   
            ` ${lantVermelha},`+   
            ` ${lantVerde},`+      
            ` ${latAmarela},`+     
            ` ${visaoProfund},`+   
            ` ${visaoNotur},`+     
            ` ${resOfusca},`+      
            ` ${campoVisualD},`+   
            ` ${campoVisualE},`+   
            ` ${dinamoD} ,`+       
            ` ${dinamoE},`+        
            ` ${dinamoLombar},`+   
            ` ${acAudicao},`+      
            ` ${pArterial},`+      
            ` ${pulso},`+          
            ` ${auscNum} ,`+       
            ` ${apLocomot},`+      
            ` ${sitNerv},`+        
            ` ${outApar},`+        
            ` ${codRestricao},`+   
            ` ${cidPac},`+      
            ` )`, res)
    })

    //ATUALIZAR
    router.patch('/dadosexmedico/:id', (req,res) =>{
        const id = parseInt(req.params.id)
        const nome = req.body.nome.substring(0,150)
        const gentilico = req.body.gentilico.substring(0,150)
        execSQLQuery(`update dadosexmedico set nome = '${nome}', gentilico = '${gentilico}'  where codExame = ${id}`, res)
    })
    server.use('/', router)
}