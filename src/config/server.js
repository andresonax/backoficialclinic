const {front, back} = require('../config/variaveis')
const port = 3003
const path = require('path')

const bodyParser = require('body-parser')
const express = require('express')
const server = express()
const allowCors = require('./cors')
const cors = require('cors')
const corsOptions = {
     origin: front,
     optionsSuccessStatus: 200,
 }



// const uploadJog = require('./uploadJogadores')
// server.post('/uploadJogadores', uploadJog)
// const moverJogadores = require('./moverJogadores')
// server.post('/moverJogadores/:id', moverJogadores)


const uploadEmpresas = require('./uploadEmpresas')
server.post('/uploadEmpresas/:id', uploadEmpresas)

server.use(express.static(path.join(__dirname, 'public')))


server.use(cors(corsOptions))
server.use(bodyParser.urlencoded({extended : true}))
server.use(bodyParser.json())
server.use(allowCors)




server.listen(port, function(){

    
})

module.exports = server