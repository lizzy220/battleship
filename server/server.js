var mongo = require('./mongo_connection');
var bodyParser  = require('body-parser');
var AI = require('./ai');

// Everything that was in the file before goes here
var express = require('express');
app = express();
app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true }));
var port = process.env.PORT || 3000; // For when we deploy to Heroku
var server = app.listen(port)
var votes = [];
var nextTurn; // either computer's turn or player's turn
var canStart = true;
var ai;
//-------------Example for use database-------------
// var findMessages = function(err,db) {
//   assert.equal(null, err);
//   db.collection('lixx3524_messages').find().toArray(function(err, docs) {
//     assert.equal(null, err);
//     // for(index in docs){
//       console.log(docs);
//     // }
//   });
//   db.close();
// }
// mongoUtil.connect(findMessages);
//-----------------------end--------------------------

app.use(express.static('public')) // We will want this later
app.set('view engine', 'ejs')

app.get('/register', function(req, res){
      res.render('register')
    })
app.get('/spectator', function(req, res){
      res.render('index')
    })

app.get('/', function(req, res){

    })

var io = require('socket.io').listen(server);
// io.sockets.on('connection', function(socket){
//   socket.on('username', function(data){ //insert username to db
//      var insertUser = function(err,db){
//         db.collection('lixx3524_messages').insert(data, function(err, ids){});
//         db.close();
//      }
//      mongo.connect(insertUser);
//   })
// })

app.post('/setUsername', function(req,res){
    var name = req.body.username;
    if(name != ''){
      console.log(req.body);
      var insertUser = function(err,db){
        db.collection('lixx3524_messages').insert({'username':name});
        db.close();
      }
      mongo.connect(insertUser);
      res.redirect('/spectator')
    }else{
      res.redirect('/register');
    }

});
app.post('/hit', function(req,res){
    var location = req.body.location;
    votes[location]++;
    // console.log(votes[location]);
    res.json({
      'success':  true,
      'message':  req.body,
    })
})

io.sockets.on('connection', function (socket) {
    if(canStart) {
        canStart = false;
        init_game();
    }else{
        var data = {'gameboardName': 'computer-player',
                    'gameboard' : ai.aiBoard,};
        socket.emit('message', data);
    }
});

function vote(){
    var voteLocation = -1;
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

function init_game(){
    ai = new AI();
    init_votes();
    nextTurn = 'player'
    // setTurnBase();
    turnBaseRoutine();
}

function init_votes(){
    for(var i = 0; i < 100; i++)
        votes[i] = 0;
}

function turnBaseRoutine() {
    setInterval(function() {
        var result;
        if (nextTurn == 'player') {
            result = playerTurn();
            if (result) {
                nextTurn = 'computer';
            }
        } else {
            result = computerTurn();
            nextTurn = 'player';
        }
        console.log("It's " + nextTurn + "'s turn to move")
        if (result) {
            io.sockets.emit('message', result);
            if (result['winner'] != "") {
                clearInterval();
            }
        }
    }, 1000*10);
}

function playerTurn() {
    playerMove = vote(); // collect players move
    if (playerMove == -1) {
        return null;
    }
    ai.hit(playerMove, ai.aiBoard);
    winner = ai.winner();
    return {'gameboard' : ai.aiBoard,
            'gameboardName' : 'computer-player',
            'winner': winner};
    // io.sockets.emit('message', data);
}
function computerTurn() {
    var nextMove = ai.aiNextMove();
    ai.hit(nextMove, ai.playerBoard);
    winner = ai.winner();
    return {'gameboard' : ai.playerBoard,
            'gameboardName' : 'human-player',
            'winner': winner};
    // io.sockets.emit('message', data);
}

function setTurnBase(){
  setInterval(function(){
      // var voteLocation = vote();
      // ai.hit(voteLocation, ai.aiBoard);
      // var winner = ai.winner();
      // var data = {'gameboard' : ai.aiBoard,
      //             'gameboardName' : 'computer-player',
      //             'winner': winner};
      // io.sockets.emit('message', data);
      // console.log('palyer');

      var nextMove = ai.aiNextMove();
      ai.hit(nextMove, ai.playerBoard);
      winner = ai.winner();
      data = {'gameboard' : ai.playerBoard,
              'gameboardName' : 'human-player',
              'winner': winner};
      io.sockets.emit('message', data);
  }, 50);
}
