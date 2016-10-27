function computerPlayer(){
      "use strict"
      this.SHIP = 0,
      this.MISS = 1,
      this.HIT = 2,
      this.hitsMade,
      this.hitsToWin,
      this.ships = [5, 4, 3, 3, 2],
      // TODO: look into Int8Array on these big matrices for performance
      this.positions = [],
      this.probabilities = [],
      this.hitsSkewProbabilities = true,
      this.skewFactor = 2,
      this.boardSize = 10,
      this.monteCarlo = false;
}

computerPlayer.prototype={
    initialize: function(gameboard){
        this.setupBoard(gameboard);
    },

    setupBoard: function(gameboard){
      for (var y = 0; y < this.boardSize; y++) {
          this.positions[y] = [];
          for (var x = 0; x < this.boardSize; x++) {
              this.positions[y][x] = null;
          }
      }
      this.hitsMade = this.hitsToWin = 0;
      for (var i = 0, l = this.ships.length; i < l; i++) {
          this.hitsToWin += this.ships[i];
      }
      this.distributeShips(gameboard);
      this.recalculateProbabilities();
    },

    distributeShips: function(gameboard){
        this.placeShip(gameboard.destroyer.position, gameboard.destroyer.length, gameboard.destroyer.direction === 1);
        this.placeShip(gameboard.submarine.position, gameboard.submarine.length, gameboard.submarine.direction === 1);
        this.placeShip(gameboard.cruiser.position, gameboard.cruiser.length, gameboard.cruiser.direction === 1);
        this.placeShip(gameboard.battleship.position, gameboard.battleship.length, gameboard.battleship.direction === 1);
        this.placeShip(gameboard.carrier.position, gameboard.carrier.length, gameboard.carrier.direction === 1);
    },

    placeShip: function(pos, shipSize, vertical){
      var x = pos % 10,
          y = Math.floor(pos / 10),
          z = (vertical ? y : x),
          end = z + shipSize - 1;

          for (var i = z; i <= end; i++) {
              if (vertical) this.positions[x][i] = this.SHIP;
              else this.positions[i][y] = this.SHIP;
          }
    },

    recalculateProbabilities: function() {
        var hits = [];

        // reset probabilities
        for (var y = 0; y < this.boardSize; y++) {
            this.probabilities[y] = [];
            for (var x = 0; x < this.boardSize; x++) {
                this.probabilities[y][x] = 0;
                // we remember hits as we find them for skewing
                if (this.hitsSkewProbabilities && this.positions[x][y] === this.HIT) {
                    hits.push([x, y]);
                }
            }
        }

        // calculate probabilities for each type of ship
        for (var i = 0, l = this.ships.length; i < l; i++) {
            for (var y = 0; y < this.boardSize; y++) {
                for (var x = 0; x < this.boardSize; x++) {
                    // horizontal check
                    if (this.shipCanOccupyPosition(this.MISS, [x, y], this.ships[i], false)) {
                        this.increaseProbability([x, y], this.ships[i], false);
                    }
                    // vertical check
                    if (this.shipCanOccupyPosition(this.MISS, [x, y], this.ships[i], true)) {
                        this.increaseProbability([x, y], this.ships[i], true);
                    }
                }
            }
        }

        // skew probabilities for positions adjacent to hits
        if (this.hitsSkewProbabilities) {
            this.skewProbabilityAroundHits(hits);
        }
    },

    increaseProbability: function(pos, shipSize, vertical) {
        // "pos" is ship origin
        var x = pos[0],
            y = pos[1],
            z = (vertical ? y : x),
            end = z + shipSize - 1;

        for (var i = z; i <= end; i++) {
            if (vertical) this.probabilities[x][i]++;
            else this.probabilities[i][y]++;
        }
    },

    skewProbabilityAroundHits: function(toSkew) {
        var uniques = [];

        // add adjacent positions to the positions to be skewed
        for (var i = 0, l = toSkew.length; i < l; i++) {
            toSkew = toSkew.concat(this.getAdjacentPositions(toSkew[i]));
        }

        // store uniques to avoid skewing positions multiple times
        // TODO: do A/B testing to see if doing this with strings is efficient
        for (var i = 0, l = toSkew.length; i < l; i++) {
            var uniquesStr = uniques.join('|').toString();
            if (uniquesStr.indexOf(toSkew[i].toString()) === -1) {
                uniques.push(toSkew[i]);

                // skew probability
                var x = toSkew[i][0],
                    y = toSkew[i][1];
                this.probabilities[x][y] *= this.skewFactor;
            }
        }
    },

    getAdjacentPositions: function(pos) {
        var x = pos[0],
            y = pos[1],
            adj = [];

        if (y + 1 < this.sboardSize) adj.push([x, y + 1]);
        if (y - 1 >= 0) adj.push([x, y - 1]);
        if (x + 1 < this.boardSize) adj.push([x + 1, y]);
        if (x - 1 >= 0) adj.push([x - 1, y]);

        return adj;
    },

    shipCanOccupyPosition: function(criteriaForRejection, pos, shipSize, vertical) { // TODO: criteriaForRejection is an awkward concept, improve
        // "pos" is ship origin
        var x = pos[0],
            y = pos[1],
            z = (vertical ? y : x),
            end = z + shipSize - 1;

        // board border is too close
        if (end > this.boardSize - 1) return false;

        // check if there's an obstacle
        for (var i = z; i <= end; i++) {
            var thisPos = (vertical ? this.positions[x][i] : this.positions[i][y]);
            if (thisPos === criteriaForRejection) return false;
        }

        return true;
    },

    fireAtBestPosition: function() {
        var pos = this.getBestUnplayedPosition(),
            x = pos[0],
            y = pos[1];

        if (this.positions[x][y] === this.SHIP) {
            this.positions[x][y] = this.HIT;
            this.hitsMade++;
        } else this.positions[x][y] = this.MISS;

        this.recalculateProbabilities();
        return y * 10 + x;
    },

    getBestUnplayedPosition: function() {
        var bestProb = 0,
            bestPos;

        // so far there is no tie-breaker -- first position
        // with highest probability on board is returned
        for (var y = 0; y < this.boardSize; y++) {
            for (var x = 0; x < this.boardSize; x++) {
                if (!this.positions[x][y] && this.probabilities[x][y] > bestProb) {
                    bestProb = this.probabilities[x][y];
                    bestPos = [x, y];
                }
            }
        }
        return bestPos;
    },
}
module.exports = computerPlayer;
