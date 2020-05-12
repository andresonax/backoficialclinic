const express = require('express')
execSQLQuery = require('../cadastros/cadastro')

module.exports = function(server) {
    const router = express.Router() 
    //CRUD dadosempresa

    //READ ALL
    var sql = 'SELECT * FROM dadosempresa'
    router.get('/dadosempresa', (req, res) => {execSQLQuery(sql, res)})

    //READ POR ID
    router.get('/dadosempresa/:id?', (req, res) => {
        let filter = ''
        if(req.params.id) filter = ' WHERE codEmpresa = ' + req.params.id;
        execSQLQuery(sql + filter, res)})

    //DELETE POR ID
    router.delete('/dadosempresa/:id', (req, res) =>{
        execSQLQuery('DELETE FROM dadosempresa where codEmpresa = ' + parseInt(req.params.id), res)
    })

    //INSERIR 
    router.post('/dadosempresa', (req,res) =>{
        const nomeEmpresa = req.body.nomeEmpresa.substring(0,50)
        const cnpjEmpresa = req.body.cnpjEmpresa.substring(0,18)
        const inscEstadual = req.body.inscEstadual.substring(0,20)
        const inscMun = req.body.inscMun.substring(0,20)
        const cepEmpresa = req.body.cepEmpresa.substring(0,9)
        const logEmpresa = req.body.logEmpresa.substring(0,50)
        const bairroEmpresa = req.body.bairroEmpresa.substring(0,40)
        const codCidade = req.body.codCidade
        const telEmpresa = req.body.telEmpresa.substring(0,13)
        const faxEmpresa = req.body.faxEmpresa.substring(0,13)
        const codDetran = req.body.codDetran
        const utilizaFila = req.body.utilizaFila.substring(0,1)
        const obsEmpresa = req.body.obsEmpresa.substring(0,150)
        const tipoEmpresa = req.body.tipoEmpresa
        const codReceita = req.body.codReceita.substring(0,5)
        const codMunicipio = req.body.codMunicipio
        const aliquota = parseFloat(req.body.aliquota)
        const imposto = req.body.imposto.substring(0,15)
        const numeroPauta = parseFloat(req.body.numeroPauta)
        const numeroPautaVer = parseFloat(req.body.numeroPautaVer)
        const renhor = parseFloat(req.body.renhor)
        const renver = parseFloat(req.body.renver)
        const verificarCpf = req.body.verificarCpf.substring(0,1)
        const textomala = req.body.textomala.substring(0,150)
        const modo = req.body.nomeEmpresa.substring(0,1)
        const serial = req.body.serial.substring(0,45)
        const dados = req.body.nomeEmpresa.substring(0,45)
        const caminhoBD = req.body.caminhoBD.substring(0,200)
        
        execSQLQuery(`INSERT INTO dadosempresa(nomeEmpresa, cnpjEmpresa, inscEstadual, inscMun, cepEmpresa, logEmpresa, bairroEmpresa, codCidade, `+
           ` telEmpresa, faxEmpresa, codDetran, utilizaFila, obsEmpresa, tipoEmpresa, codReceita, codMunicipio, aliquota, imposto, numeroPauta, `+ 
           ` numeroPautaVer, renhor, renver, verificarCpf, textomala, modo, serial, dados, caminhoBD, ) `+
           ` values('${nomeEmpresa}','${cnpjEmpresa}','${inscEstadual}','${inscMun}','${cepEmpresa}',`+
           ` '${logEmpresa}','${bairroEmpresa}',${codCidade},'${telEmpresa}','${faxEmpresa}',${codDetran},'${utilizaFila}',`+
           ` '${obsEmpresa}','${tipoEmpresa}','${codReceita}','${codMunicipio}',${aliquota},'${imposto}',${numeroPauta}, `+
           ` ${numeroPautaVer},${renhor},${renver},'${verificarCpf}','${textomala}','${modo}','${serial}','${dados}', '${caminhoBD}' )`, res)
    })

    //ATUALIZAR
    router.patch('/dadosempresa/:id', (req,res) =>{
        const id = parseInt(req.params.id)
        const nomeEmpresa = req.body.nomeEmpresa.substring(0,150)
        const cnpjEmpresa = req.body.cnpjEmpresa.substring(0,20)
        const inscEstadual = req.body.inscEstadual.substring(0,20)
        const inscMun = req.body.inscMun.substring(0,20)
        const cepEmpresa = req.body.cepEmpresa.substring(0,9)
        const endereco = req.body.endereco.substring(0,250)
        const bairroEmpresa = req.body.bairroEmpresa.substring(0,40)
        const codCidade = req.body.codCidade
        const telEmpresa = req.body.telEmpresa.substring(0,13)
        const faxEmpresa = req.body.faxEmpresa ? req.body.faxEmpresa.substring(0,13) : ''
        const codDetran = req.body.codDetran
        const utilizaFila = req.body.utilizaFila.substring(0,1)
        const obsEmpresa = req.body.obsEmpresa.substring(0,150)
        const tipoEmpresa = req.body.tipoEmpresa
        const codReceita = req.body.codReceita.substring(0,5)
        const codMunicipio = req.body.codMunicipio
        const aliquota = parseFloat(req.body.aliquota)
        const imposto = req.body.imposto.substring(0,15)
        const numeroPauta = parseFloat(req.body.numeroPauta)
        const numeroPautaVer = parseFloat(req.body.numeroPautaVer)
        const renhor = parseFloat(req.body.renhor)
        const renver = parseFloat(req.body.renver)
        const verificarCpf = req.body.verificarCpf.substring(0,1)
        const textomala = req.body.textomala ? req.body.textomala.substring(0,150) : ''
        const modo = req.body.nomeEmpresa.substring(0,1)
        const serial = req.body.serial ? req.body.serial.substring(0,45) : ''
        const dados = req.body.nomeEmpresa.substring(0,45)
        const caminhoBD = req.body.caminhoBD.substring(0,200)
        const avatar = req.body.avatar.substring(0,45)
        
        execSQLQuery(`update dadosempresa set nomeEmpresa = '${nomeEmpresa}',cnpjEmpresa = '${cnpjEmpresa}',inscEstadual = '${inscEstadual}',inscMun = '${inscMun}',cepEmpresa = '${cepEmpresa}',
        endereco = '${endereco}',bairroEmpresa = '${bairroEmpresa}',codCidade = '${codCidade}',telEmpresa = '${telEmpresa}',faxEmpresa = '${faxEmpresa}',
        codDetran = '${codDetran}',utilizaFila = '${utilizaFila}',obsEmpresa = '${obsEmpresa}',tipoEmpresa = '${tipoEmpresa}',codReceita = '${codReceita}',
        codMunicipio = '${codMunicipio}',aliquota = '${aliquota}',imposto = '${imposto}',numeroPauta = '${numeroPauta}',numeroPautaVer = '${numeroPautaVer}',
        renhor = '${renhor}',renver = '${renver}',verificarCpf = '${verificarCpf}',textomala = '${textomala}',modo = '${modo}',
        serial = '${serial}',dados = '${dados}',caminhoBD = '${caminhoBD}',avatar = '${avatar}'   where codEmpresa = ${id}`, res)
    })
    server.use('/', router)
}