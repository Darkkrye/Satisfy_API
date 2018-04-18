// Server setup
var express = require('express')
var server;
var bodyparser = require('body-parser')
var mongoose = require('mongoose')

module.exports = server = express()
server.use(bodyparser.json())
mongoose.Promise = global.Promise


// Checking port
var port = process.env.PORT || 3000
if (process.env.NODE_ENV != "test") {
  if (port != 3000){
    process.env.NODE_ENV = "prod"
    mongoose.connect("mongodb://user:password@ds147469.mlab.com:47469/heroku_t3zzv2rl")
  } else{
    process.env.NODE_ENV = "dev"
    mongoose.connect("mongodb://localhost:27017/satisfy")
  }
}

// Create models
var satisfactionSchema = new mongoose.Schema({
  id: {
    type: Number,
    required: true
  },
  id_button: {
    type: Number,
    required: true
  },
  date: {
    type: Date,
    required: true,
    default: new Date()
  }
})
var Satisfaction = mongoose.model("Satisfaction", satisfactionSchema)


// Create routes
server.get('/api/satisfaction', function(req, res){
  Satisfaction.find()
    .exec(function(error, satisfactions){
      if(!error && satisfactions){
        return res.status(200).send(satisfactions)
      } else {
        return res.status(404).send({
          "error": 404,
          "message": "Satisfaction not found - " + error,
        })
      }
    })
})

server.post('/api/satisfaction', function(req, res){
  var satisfaction = new Satisfaction(req.body);
  satisfaction.Date = new Date();
  console.log(satisfaction);
  satisfaction.save(function(error, instance){
    if(error){
      return res.status(500).send({
        "error": 500,
        "message": "Error during creating satisfaction - " + error,
      })
    }
    return res.status(201).send(instance)
  })
})

// Start server
console.log('Server listening on port ' + port + ' on ' + process.env.NODE_ENV + ' environment.')
server.listen(port)  // Start the server
