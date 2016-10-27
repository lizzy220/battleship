var Gameboard = require('./gameboard');
var computerPlayer = require('./computerPlayer');

function AI() {
    "use strict"
    this.aiBoard = new Gameboard();
    this.playerBoard = new Gameboard();
    console.log(this.playerBoard);
    this.computerPlayer = new computerPlayer();
    this.computerPlayer.initialize(this.playerBoard);
    this.starttime = Date.now();


    this.hit = function(pos, gameboard){
        var hit = false;
        hit |= hitShip(gameboard.destroyer, pos, gameboard);
        hit |= hitShip(gameboard.submarine, pos, gameboard);
        hit |= hitShip(gameboard.cruiser, pos, gameboard);
        hit |= hitShip(gameboard.battleship, pos, gameboard);
        hit |= hitShip(gameboard.carrier, pos, gameboard);
        if(!hit){
            gameboard.missPts.push(pos);
        } else {
            gameboard.hits++;
        }
        gameboard.count++;
    };
    this.aiNextMove = function(){
        var nextLoc = this.computerPlayer.fireAtBestPosition();
        console.log(nextLoc);
        return nextLoc;
    };
    this.winner = function(){
        if(this.aiBoard.aliveShipNum == 0) return "Human";
        if(this.playerBoard.aliveShipNum == 0) return "Computer";
        return "";
    }
}

function hitShip(ship, pos, gameboard){
    if (ship.status == 'sunk') {
        return false;
    }
    var hit = false;
    if(ship.direction == 0){
        if(pos >= ship.position && pos < ship.position + ship.length){
            ship.hit |=  (1 << (pos - ship.position));
            hit = true;
            gameboard.hitPts.push(pos);
        }
    }else{
        if((pos >= ship.position && pos <= (ship.position + 10 * (ship.length-1)) && (pos - ship.position) % 10 == 0) && ((pos - ship.position) / 10 < ship.length)){
            ship.hit |= (1 << ((pos - ship.position) / 10));
            hit = true;
            gameboard.hitPts.push(pos);
        }
    }
    if(ship.hit == ((1 << ship.length) - 1)){
        ship.status = 'sunk';
        if(ship.direction == 0){
            for(var k = 0; k < ship.length; k++) gameboard.sunkPts.push(ship.position + k);
        }else{
            for(var k = 0; k < ship.length; k++) gameboard.sunkPts.push(ship.position + k * 10);
        }
        gameboard.aliveShipNum--;
    }
    return hit;
}

module.exports = AI;
