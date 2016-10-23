module.exports = {
    Gameboard: function() {
        this.destroyer = new Ship(2);
        this.submarine = new Ship(3);
        this.cruiser = new Ship(3);
        this.battleship = new Ship(4);
        this.carrier = new Ship(5);
        this.misses = []; // A 1*100 array represents the positions that the opponent(s) miss the ships
        this.hits = []; // A 1*100 array represents the positions that the opponent(s) hit the ships
    },
    RandomGameboard: function() {
        var occupied = []
        this.destroyer = new RandomShip(2, occupied);
        this.submarine = new RandomShip(3, occupied);
        this.cruiser = new RandomShip(3, occupied);
        this.battleship = new RandomShip(4, occupied);
        this.carrier = new RandomShip(5, occupied);
        this.misses = [];
        this.hits = [];

    },
    Ship: function(length) {
        this.position = []
        this.direction = 0 // 0 horizontal, 1 vertical
        this.length = length;
        this.hit = 0; // An integer whose bits represents the position of being hit
        this.status = 'alive' // can be alive, damaged, sunk
    }
    RandomShip: function(length, occupied) {
        this.direction = (Math.random() > 0.5 ? 0 : 1);
        this.position = get_random_position(length, direction, occupied)
        this.length = length;
        this.hit = 0; // An integer whose bits represents the position of being hit
        this.status = 'alive' // can be alive, damaged, sunk
    }
};

function randomIntInc (low, high) {
    return Math.floor(Math.random() * (high - low + 1) + low);
}
var is_valid_position = function(position, length, direction, occupied) {
    if (direction == 0) {
        for (int i = 0; i < length; i++) {
            if (occupied.includes(position)) {
                return false;
            }
            position += 1;
        }
    } else {
        for (int i = 0; i < length; i++) {
            if (occupied.includes(position)) {
                return false;
            }
            position += 10;
        }
    }
    return true;
}
var get_random_position = function(length, direction, occupied) {
    if (direction == 0) {
        position = randomIntInc(0, 10) * 10 + randomIntInc(0, 10-length+1);
        while (is_valid_position(position, length, direction, occupied) == false) {
            position = randomIntInc(0, 10) * 10 + randomIntInc(0, 10-length+1);
        }
    } else {
        position = randomIntInc(0, 10-length+1) * 10 + randomIntInc(0, 10);
        while (is_valid_position(position, length, direction, occupied) == false) {
            position = randomIntInc(0, 10) * 10 + randomIntInc(0, 10-length+1);
        }
    }
}
