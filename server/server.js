var mongo = require('./mongo_connection')
// Everything that was in the file before goes here
mongo.connect(function(err){
  var express = require('express');

  app = express();

  app.use(express.static('public')) // We will want this later
  app.set('view engine', 'ejs')

  app.get('/spectator', function(req, res){
        res.render('index')
      })
  app.get('/', function(req, res){

      })

  app.post('/hit', function(req,res){

      res.json({
        'success':  true,
        'message':  '',
      })
  })

  app.post('/place_ship', function(req,res){
      res.json({
        'success':  true,
      })
  })


  var port = process.env.PORT || 3000; // For when we deploy to Heroku

  var server = app.listen(port)

  var io = require('socket.io').listen(server);
  io.sockets.on('connection', function (socket) {

  })
});
