var Gameboard = require('./gameboard');
var bsCPUplayer = require('./bsCPUplayer');

var AI = function() {
    this.aiBoard = new Gameboard();
    this.playerBoard = new Gameboard();
    console.log(this.playerBoard);
    this.bsCPUplayer = new bsCPUplayer();
    init_bsCPUplayer(this.bsCPUplayer, this.playerBoard);
    this.hit = function(pos, gameboard){
        var hit = false;
        hit |= hitShip(gameboard.destroyer, pos);
        hit |= hitShip(gameboard.submarine, pos);
        hit |= hitShip(gameboard.cruiser, pos);
        hit |= hitShip(gameboard.battleship, pos);
        hit |= hitShip(gameboard.carrier, pos);
        if(!hit){
            gameboard.misses.push(pos);
        }
    };
    this.aiNextMove = function(){
        var nextLoc = this.bsCPUplayer.move(false, 0, 0);
        console.log(nextLoc);
        return nextLoc;
    }
}

function hitShip(ship, pos){
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
    }
    return hit;
}

function init_bsCPUplayer(bsCPUplayer, gameborad){
    init_bsCPUplayer_ship(bsCPUplayer, gameborad.destroyer);
    init_bsCPUplayer_ship(bsCPUplayer, gameborad.submarine);
    init_bsCPUplayer_ship(bsCPUplayer, gameborad.cruiser);
    init_bsCPUplayer_ship(bsCPUplayer, gameborad.battleship);
    init_bsCPUplayer_ship(bsCPUplayer, gameborad.carrier);
}

function init_bsCPUplayer_ship(bsCPUplayer, ship){
    var x = ship.position / 10, y = ship.position % 10;
    if(ship.direction == 0){
        for(var i = 0; i < ship.length; i++){
            bsCPUplayer.move(true, x, y + i);
        }
    }else{
        for(var i = 0; i < ship.length; i++){
            bsCPUplayer.move(true, x + i, y);
        }
    }
}

module.exports = AI;
