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

        app.get('/banned-words', function(req, res){
          db.collection(x500 + '_bannedword').find().toArray(
            function(err, list){
                  res.render('banned-words', {'wordlist': list})
              })
            })
        app.get('/', function(req, res){
              res.render('index')
            })


        var port = process.env.PORT || 3000; // For when we deploy to Heroku

        var server = app.listen(port)

        var io = require('socket.io').listen(server);
        io.sockets.on('connection', function (socket) {
            socket.on('setUsername', function (data) {
                socket.username = data
            })
            // socket.on('message', function (message) {
            //     var data = { 'message' : message, 'username': socket.username }
            //     socket.broadcast.emit('message', data);
            // })
            socket.on('message', function (message) {
                var data = { 'message' : message, 'username': socket.username }
                db.collection(x500 + '_bannedword').find().toArray(
                function(err, words){
                    var flag = false;
                    for(index in words){
                       if(message.includes(words[index]['bannedwords'])){
                         flag = true;
                       }
                    }
                    if(flag == false){
                       socket.broadcast.emit('message', data);
                       db.collection(x500 + '_messages').insert(data, function(err, ids){})
                    }
                })
            })
            socket.on('bannedwords', function(word){
                var banword = {'bannedwords': word, 'username': socket.username}
                socket.broadcast.emit('addBannedWords', banword);
                db.collection(x500 + '_bannedword').insert(banword, function(err, ids){})
            })
        })
      }
    })
  }
})
