const express = require('express')
execSQLQuery = require('../api/cadastros/cadastro')

module.exports = function(server) {
    const router = express.Router()
    router.get('/', (req, res) => res.json({message : 'Funcionando'}))  
    server.use('/', router)
}

