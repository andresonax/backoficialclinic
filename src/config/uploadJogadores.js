const IncomingForm = require('formidable').IncomingForm
var fs = require('fs')
var axios = require('axios')
//var caminho = '../frontend/src/assets/img/equipes/'
var caminho = '../frontend/public/temp/jogadores/'
const {front, back} = require('../config/variaveis')

module.exports = function upload(req, res){
    
    var form = new IncomingForm()
    var autoIncrement;
    var nomeArquivo;
    
    
    form.parse(req, function (err, fields, files) {
        if(req.params.id == '0'){
            axios.get('back/nextIdJog')
                .then((response) => {
                    autoIncrement = response.data[0].Auto_increment
                    var oldpath = files.arquivo.path;
                    files.arquivo.type == 'image/jpeg' ? nomeArquivo = autoIncrement + '.jpg' : nomeArquivo = autoIncrement + '.png'
                    var newpath = caminho + nomeArquivo;
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
                .catch((erro) =>{
                    res.setHeader('Access-Control-Allow-Origin', front)
                    res.setHeader('Access-Control-Allow-Headers', 'Content-Type')
                    res.send(false)
                })
                
        } else {
                var apagar 
                autoIncrement = req.params.id
                var oldpath = files.arquivo.path;
                if(files.arquivo.type == 'image/jpeg'){
                    nomeArquivo = autoIncrement + '.jpg' 
                    apagar = autoIncrement + '.png'
                } else {
                     nomeArquivo = autoIncrement + '.png'
                     apagar = autoIncrement + '.jpg'
                }
                var newpath = caminho + nomeArquivo;
                fs.readFile(oldpath, function (err, data){
                    if(err) throw err
                    fs.writeFile(newpath, data, function (err) {
                        if (err) throw err;
                        });
                    fs.unlink(oldpath, function (err) {
                            if (err) throw err;
                            });  
                    //caso troque de figura  
                    fs.unlink(caminho + apagar, function (err) {
                            //if (err) throw err;
                            });    
                })
                //console.log('manda')
                res.setHeader('Access-Control-Allow-Origin', front)
                res.setHeader('Access-Control-Allow-Headers', 'Content-Type')
                res.send(true)
        }
    })
}

