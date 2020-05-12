const IncomingForm = require('formidable').IncomingForm
var fs = require('fs')
var axios = require('axios')
//var caminho = '../frontend/src/assets/img/equipes/'
//para modulo cloud temos que olhar este valor, abaixo valor para modulo local
var caminho = './src/config/public/cadastros/empresas/'
const {front, back} = require('../config/variaveis')

module.exports = function upload(req, res){
    
    var form = new IncomingForm()
    var autoIncrement;
    var nomeArquivo;
    
    
    form.parse(req, function (err, fields, files) {
        
        var apagar 
        autoIncrement = req.params.id
        var oldpath = files.arquivo.path;
        //PARA ATENDER O EDITOR GRATUITO TIVE QUE COLOCAR A IMAGEM FIXA
        // if(files.arquivo.type == 'image/jpeg'){
        //     nomeArquivo = autoIncrement + '.jpg' 
        //     apagar = autoIncrement + '.png'
        // } else {
        //         nomeArquivo = autoIncrement + '.png'
        //         apagar = autoIncrement + '.jpg'
        // }
        // var newpath = caminho + nomeArquivo;
        var newpath = caminho + 'logo.png';
        fs.readFile(oldpath, function (err, data){
            if(err) throw err
            fs.writeFile(newpath, data, function (err) {
                if (err) throw err;
                });
            fs.unlink(oldpath, function (err) {
                    if (err) throw err;
                    });  
              
        })
        let resposta = {
            "name": nomeArquivo,
            "status": "done",
            "url": `${back}cadastros/empresas/${nomeArquivo}`,
            "thumbUrl": `${back}cadastros/empresas/${nomeArquivo}`,
        }
        //console.log('manda')
        res.setHeader('Access-Control-Allow-Origin', front)
        res.setHeader('Access-Control-Allow-Headers', 'Content-Type')
        res.send(resposta)

    })
}

