module.exports = {
    Gameboard: function() {
        this.destroyer = new Ship(2);
        this.submarine = new Ship(3);
        this.cruiser = new Ship(3);
        this.battleship = new Ship(4);
        this.carrier = new Ship(5);
        this.misses = []; // A 1*100 array represents the positions that the opponent(s) miss the ships
        this.hits = []; // A 1*100 array represents the positions that the opponent(s) hit the ships
    }
    Ship: function(length) {
        this.length = length;
        this.hit = 0; // An integer whose bits represents the position of being hit
        this.status = 'alive' // can be alive, damaged, sunk
    }
};
