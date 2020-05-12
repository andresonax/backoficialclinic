const conection = require('../../config/database')

module.exports = function(sql, res){
  conection.query(sql, function(error, results, fields){
    if(error)
      res.json(error)
    else
      res.json(results)
  })
}