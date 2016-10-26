// function Gameboard() {
//     this.destroyer = new Ship(2);
//     this.submarine = new Ship(3);
//     this.cruiser = new Ship(3);
//     this.battleship = new Ship(4);
//     this.carrier = new Ship(5);
//     this.misses = []; // A 1*100 array represents the positions that the opponent(s) miss the ships
//     this.hits = []; // A 1*100 array represents the positions that the opponent(s) hit the ships
// }

function RandomGameboard() {
    var occupied = []
    this.destroyer = new RandomShip(2, occupied);
    occupied = occupied.concat(get_ship_positions(this.destroyer.position, this.destroyer.length, this.destroyer.direction));
    this.submarine = new RandomShip(3, occupied);
    occupied = occupied.concat(get_ship_positions(this.submarine.position, this.submarine.length, this.submarine.direction));
    this.cruiser = new RandomShip(3, occupied);
    occupied = occupied.concat(get_ship_positions(this.cruiser.position, this.cruiser.length, this.cruiser.direction));
    this.battleship = new RandomShip(4, occupied);
    occupied = occupied.concat(get_ship_positions(this.battleship.position, this.battleship.length, this.battleship.direction));
    this.carrier = new RandomShip(5, occupied);
    occupied = occupied.concat(get_ship_positions(this.carrier.position, this.carrier.length, this.carrier.direction));
    this.misses = [];
    this.aliveShipNum = 5;
    // this.hits = [];
    // console.log(occupied);
}

// function Ship(length) {
//     this.position = 0
//     this.direction = 0 // 0 horizontal, 1 vertical
//     this.length = length;
//     this.hit = 0; // An integer whose bits represents the position of being hit
//     this.status = 'alive' // can be alive, damaged, sunk
// }

function RandomShip(length, occupied) {
    this.direction = (Math.random() > 0.5 ? 0 : 1);
    this.position = get_random_position(length, this.direction, occupied)
    this.length = length;
    this.hit = 0; // An integer whose bits represents the position of being hit
    this.status = 'alive' // can be alive, damaged, sunk
}

function randomIntInc(low, high) {
    return Math.floor(Math.random() * (high - low + 1) + low);
}
var is_valid_position = function(position, length, direction, occupied) {
    positions = get_ship_positions(position, length, direction);
    for (p in positions) {
        if (occupied.indexOf(p) != -1) {
            return false;
        }
    }
    return true;
}

var get_ship_positions = function(position, length, direction) {
    var positions = [];
    if (direction == 0) {
        for (var i = 0; i < length; i++) {
            positions.push(position+i);
        }
    } else {
        for (var i = 0; i < length; i++) {
            positions.push(position+(10*i));
        }
    }
    return positions;
}

var get_random_position = function(length, direction, occupied) {
    position = -1;
    if (direction == 0) {
        position = randomIntInc(0, 9) * 10 + randomIntInc(0, 9-length+1);
        while (is_valid_position(position, length, direction, occupied) == false) {
            position = randomIntInc(0, 9) * 10 + randomIntInc(0, 9-length+1);
        }
    } else {
        position = randomIntInc(0, 9-length+1) * 10 + randomIntInc(0, 9);
        while (is_valid_position(position, length, direction, occupied) == false) {
            position = randomIntInc(0, 9-length+1) * 10 + randomIntInc(0, 9);
        }
    }
    return position;
}

module.exports = RandomGameboard
