//need to be replaced by new mlab account
var MongoClient = require('mongodb').MongoClient;
var mongoURI = 'mongodb://ec2-54-175-174-41.compute-1.amazonaws.com:80/'
var db_name = "5117-individual"
var db_user = "5117user"
var db_pswd = "5117pass"
var x500 = "lixx3524"
MongoClient.connect(mongoURI + db_name, function(err, db){
  if (err) {
    throw err;
  }
  else {
    db.authenticate(db_user, db_pswd, function(err, result) {
      if (err) {
        throw err;
      }
      else {
        // Everything that was in the file before goes here
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
      }
    })
  }
})
