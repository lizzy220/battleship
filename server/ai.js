var Gameboard = require('./gameboard');
var bsCPUplayer = require('./bsCPUplayer');

var AI = function() {
    this.aiBoard = new Gameboard();
    this.playerBoard = new Gameboard();
    console.log(this.playerBoard);
    this.bsCPUplayer = new bsCPUplayer();
    this.hit = function(pos, gameboard){
        hitShip(gameboard.destroyer, pos);
        hitShip(gameboard.submarine, pos);
        hitShip(gameboard.cruiser, pos);
        hitShip(gameboard.battleship, pos);
        hitShip(gameboard.carrier, pos);
    };
    this.aiNextMove = function(){
        var nextLoc = this.bsCPUplayer.move(false, 0, 0);
        console.log(nextLoc);
        return nextLoc;
    }
}

function hitShip(ship, pos){
    if(ship.direction == 0){
        if(pos >= ship.position && pos < ship.position + ship.length){
            ship.hit |=  (1 << (pos - ship.position));
        }
    }else{
        if(((pos - ship.position) % 10 == 0) && ((pos - ship.position) / 10 < ship.length)){
            ship.hit |= (1 << ((pos - ship.position) / 10));
        }
    }
    if(ship.hit == (1 << ship.length) - 1){
        ship.status = 'sunk';
    }
}

module.exports = AI;
