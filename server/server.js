var mongo = require('./mongo_connection')
// Everything that was in the file before goes here
var express = require('express');

app = express();

var votes = [];
var AI = require('./ai');

app.use(express.static('public')) // We will want this later
app.set('view engine', 'ejs')

app.get('/spectator', function(req, res){
      res.render('index')
    })
app.get('/', function(req, res){

    })
app.get('/test', function(req, res){
    var ai = new AI();
   for(var i = 0; i < 10; i++){
      console.log(i);
      ai.aiNextMove();
   }
})

app.post('/hit', function(req,res){
    var location = req.param('location');
    votes[location]++;
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

function vote(){
    var voteLocation = 0;
    var maxVal = votes[0];
    for(var i = 1; i < votes.length; i++){
        if(maxVal < votes[i]){
          voteLocation = i;
          maxVal = votes[i];
        }
        votes[i] = 0;
    }
    return voteLocation;
}

setInterval(function(){
    var voteLocation = vote();
}, 1000 * 10);
