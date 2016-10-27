var mongo = require('./mongo_connection');
var bodyParser  = require('body-parser');
var AI = require('./ai');

// Everything that was in the file before goes here
var express = require('express');
app = express();
app.set('view engine', 'ejs');
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

// app.get('/register', function(req, res){
//       res.render('register')
//     })
app.get('/spectator', function(req, res){
      res.render('index')
    })

app.get('/', function(req, res){

    })

app.get('/statistics', function(req, res){
    var results = getRecentGameStats();
    console.log(results);
    res.render('stats', {'results': results});
    })


var io = require('socket.io').listen(server);
io.sockets.on('connection', function(socket){
  socket.on('username', function(data){ //insert username to db
    // socket.username = data;
    insertdb('userinfo', {'username':data});

  })
  socket.on('newVote', function(data){
    // var mes = {'username': socket.username, 'pos': data};
    socket.broadcast.emit('newVote', data);
  })
})

app.post('/hit', function(req,res){
    var location = req.body.location;
    votes[location]++;
    res.json({
      'success':  true,
      'message':  req.body,
    })
})

app.post('/loadGame', function(req, res){
  if(canStart) {
      canStart = false;
      init_game();
   }
   res.json({
      'aiBoard': ai.aiBoard,
      'playerBoard': ai.playerBoard,
   })
})
//using this function to insert data to database
//collection param is the collection you want to insert
//record param: the record you need to insert such as {'username': 'test2'}
function insertdb(collection, record){
  var insertUser = function(err,db){
    db.collection(collection).insert(record);
    db.close();
  }
  mongo.connect(insertUser);
}

function getRecentGameStats() {
    var getResults = function(err, db) {
        db.collection('GameResults').find();
        db.clost();
    }
    return mongo.connect(getResults);
}

function vote(){
    var voteLocation = -1;
    var maxVal = 0;
    for(var i = 0; i < votes.length; i++){
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
    nextTurn = 'player';
    turnBaseRoutine();
}

function init_votes(){
    for(var i = 0; i < 100; i++) {
        votes[i] = 0;
    }
}

function turnBaseRoutine() {
    var id = setInterval(function() {
        var result;
        if (nextTurn == 'player') {
            result = playerTurn();
            console.log(result);
            if (result != null) {
                nextTurn = 'computer';
            }
        } else {
            result = computerTurn();
            nextTurn = 'player';
        }
        if (result != null) {
            io.sockets.emit('message', result);
            if (result['winner'] != "") {
                io.sockets.emit("Game Over... " + winner + "is the winner!")
                human_accuracy = ai.playerBoard.hits / ai.playerBoard.count;
                computer_accuracy = ai.aiBoard.hits / ai.aiBoard.count;
                insertdb('GameResults', {'winner': winner, 'date': ai.starttime, 'human_accuracy': human_accuracy, 'computer_accuracy': computer_accuracy})
                clearInterval(id);
            }
        }
        console.log("It's " + nextTurn + "'s turn to move")
    }, 1000);
}

function playerTurn() {
    playerMove = vote(); // collect players move
    console.log(playerMove);
    if (playerMove == -1) {
        return null;
    }
    ai.hit(playerMove, ai.aiBoard);
    io.sockets.emit('newMove', {'name': "human", 'pos': playerMove});
    winner = ai.winner();
    return {'gameboard' : ai.aiBoard,
            'gameboardName' : 'computer-player',
            'winner': winner};
    // io.sockets.emit('message', data);
}

function computerTurn() {
    var nextMove = ai.aiNextMove();
    ai.hit(nextMove, ai.playerBoard);
    io.sockets.emit('newMove', {'name': "computer", 'pos': nextMove});
    winner = ai.winner();
    return {'gameboard' : ai.playerBoard,
            'gameboardName' : 'human-player',
            'winner': winner};
    // io.sockets.emit('message', data);
}
