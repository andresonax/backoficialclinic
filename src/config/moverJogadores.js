const IncomingForm = require('formidable').IncomingForm
var fs = require('fs')
var axios = require('axios')
//var caminho = '../frontend/src/assets/img/equipes/'
var caminho = '../frontend/public/jogadores/'
var caminhoTemp = '../frontend/public/temp/jogadores/'
const {front, back} = require('../config/variaveis')

module.exports = function upload(req, res){
    
    var form = new IncomingForm()
    
    var nomeArquivo;
    
    form.parse(req, function (err, fields, files) {
            
            nomeArquivo = req.params.id
            var newpath = caminho + nomeArquivo;
            var oldpath = caminhoTemp + nomeArquivo;

            fs.readFile(oldpath, function (err, data){
                if(err) throw err
                fs.writeFile(newpath, data, function (err) {
                    if (err) throw err;
                    });
                fs.unlink(oldpath, function (err) {
                        if (err) throw err;
                        });  
            })
            res.setHeader('Access-Control-Allow-Origin', front)
            res.setHeader('Access-Control-Allow-Headers', 'Content-Type')
            res.send(true)
    })
}

