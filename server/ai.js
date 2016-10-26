var Gameboard = require('./gameboard');
var computerPlayer = require('./computerPlayer');

var AI = function() {
    this.aiBoard = new Gameboard();
    this.playerBoard = new Gameboard();
    console.log(this.playerBoard);
    this.computerPlayer = new computerPlayer();
    this.computerPlayer.initialize(this.playerBoard);

    this.hit = function(pos, gameboard){
        var hit = false;
        hit |= hitShip(gameboard.destroyer, pos, gameboard);
        hit |= hitShip(gameboard.submarine, pos, gameboard);
        hit |= hitShip(gameboard.cruiser, pos, gameboard);
        hit |= hitShip(gameboard.battleship, pos, gameboard);
        hit |= hitShip(gameboard.carrier, pos, gameboard);
        if(!hit){
            gameboard.misses.push(pos);
        }
    };
    this.aiNextMove = function(){
        // var nextLoc = this.bsCPUplayer.move(false, 0, 0);
        // console.log(nextLoc);
        // return nextLoc;
        var nextLoc = this.computerPlayer.fireAtBestPosition();
        console.log(nextLoc);
        return nextLoc;
    };
    this.winner = function(){
        if(this.aiBoard.aliveShipNum == 0) return "Player";
        if(this.playerBoard.aliveShipNum == 0) return "Computer";
        return "";
    }
}

function hitShip(ship, pos, gameboard){
    var hit = false;
    if(ship.direction == 0){
        if(pos >= ship.position && pos < ship.position + ship.length){
            ship.hit |=  (1 << (pos - ship.position));
            hit = true;
        }
    }else{
        if(((pos - ship.position) % 10 == 0) && ((pos - ship.position) / 10 < ship.length)){
            ship.hit |= (1 << ((pos - ship.position) / 10));
            hit = true;
        }
    }
    if(ship.hit == (1 << ship.length) - 1){
        ship.status = 'sunk';
        gameboard.aliveShipNum--;
    }
    return hit;
}

module.exports = AI;
