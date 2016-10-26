/**
 * Two-dimensional Coordinates
 * @constructor
 * @param {Number} [pX = 0] The x coordinate
 * @param {Number} [pY = 0] The y coordinate
 */
function coordinates(pX, pY){
 this.x = pX || 0;
 this.y = pY || 0;
}

/**
 * Battleship CPU player algorithm enemy grid coordinates
 * @constructor
 * @param {Number} [pX = 0] The x location
 * @param {Number} [pY = 0] The y location
 * @param {Number} [pXval = 0] The x value from down-right traversal
 * @param {Number} [pYval = 0] The y value from down-right traversal
 */
function gridCoordinate(pX, pY, pXval, pYval){
 this.x = pX || 0;
 this.y = pY || 0;
 this.xVal = pXval || 0;
 this.yVal = pYval || 0;
 this.xValRev = 0;
 this.yValRev = 0;
 this._sumx = 0;
 this._sumy = 0;
}
 gridCoordinate.prototype={
  /**
   * Add x and y values from up-left traversal
   * @param {Number} pXval The x value
   * @param {Number} pYval The y value
   */
  addXY: function(pXval, pYval){
   this.xValRev = pXval;
   this.yValRev = pYval;
   this._sumx = this._sum(this.xVal, this.xValRev);
   this._sumy = this._sum(this.yVal, this.yValRev);
  },
  /**
   * Get the final score for the grid coordinates
   * (addXY should have been run first)
   * @returns {Number} The total score
   */
  getScore: function(){
   //return (this._sumx * this._sumy);
   // do below instead of above, otherwise one of the
   // center sixteen squares are almost always first
   //
   // TODO: find a way to improve coverage at the edges
   // of the game board, currently this algorithm does
   // poorly against an enemy who places his ships
   // around the edges of the board - the best move is
   // to put the smallest ship in the upper left corner
   //
   var result = this._sumx * this._sumy;
   if(result < 80){
    return result;

   // when result is 80 or larger
   // return a smaller prime number
   // prime is obviously not product
   }else{
    // 20% chance of getting 67
    // (greater than 64 or 8*8)
    if(!Math.floor((Math.random()*5))){
     return 67;

    // 80% chance of getting 61
    // (less than 64 or 8*8)
    }else{
     return 61;
    }
   }
  },
  /**
   * Sum x or y from down-right with up-left traversal
   * @private
   */
  _sum: function(pA, pB){
   return ((pA + pB) - Math.abs(pA - pB));
  }
 }

/**
 * Battleship CPU player algorithm
 * Copyright (c) 2012, Christopher Stoll
 * @author <a href="http://www.christopherstoll.org/">Christopher Stoll</a>
 * @constructor
 */
function bsCPUplayer(){
 // size of the synamic programming matrix
 this._dmSize = (10-1);
 // dynamic programming matrix
 this._dm = [
  [0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0]
 ];

 // tracks shots fired
 this._enemyGrid = [
  [0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0]
 ];

 // maximum target size
 this._maxSize = 5;
 // coordinate of last shot fired
 this.lastShot = new coordinates();
 // hits on ships not sunk
 this.hitList = [];
}
 bsCPUplayer.prototype={
  // constants used in the enemy grid
  SHOT_FIRED: 1,
  SHIP_HIT: 2,

  /**
   * Call to let the CPU player make a move
   * @param {Boolean} pOverride True to manually set move value
   * @param {Number} pX The manualy set x value
   * @param {Number} pY The manually set y value
   * @returns {Object} The gridCoordinate to fire upon
   */
  move: function(pOverride, pX, pY){
   // Let the computer do its thing
   if(!pOverride){
    // search for a target
    if(this.hitList.length <= 0){
     this.lastShot = this._getCoordinates_find();

    // sink a found target
    }else{
     this.lastShot = this._getCoordinates_sink();
    }

   // Use the manual vlues
   }else{
    this.lastShot = new coordinates(pX, pY);
   }

   this._enemyGrid[this.lastShot.y][this.lastShot.x] = this.SHOT_FIRED;
   return this.lastShot.y * 10 + this.lastShot.x;
  },

  /**
   * Call when the CPU makes a hit
   * @param {Object} pCoordinate The gridCoordinate of the hit
   */
  markHit: function(pCoordinate){
   this.hitList.push(new coordinates(pCoordinate.x, pCoordinate.y));
   this._enemyGrid[pCoordinate.y][pCoordinate.x] = this.SHIP_HIT;
   //console.log('HIT: ', this.hitList);
  },

  /**
   * Call then the CPU sinks a target
   * @param {Object} pCoordinate[] The coordinates of the sunk target
   */
  markSunk: function(pCoordinates){
   for(var i=0; i<pCoordinates.length; i++){
    for(var j=0; j<this.hitList.length; j++){
     if((this.hitList[j].x == pCoordinates[i].x)
      && (this.hitList[j].y == pCoordinates[i].y)){
      this.hitList.splice(j, 1);
     }
    }
   }
   //console.log('SUNK');
  },

  /**
   * Sink a found target
   * Determine the coordinates to fire upon
   * @private
   * @returns {Object} The gridCoordinate to fire upon
   */
  _getCoordinates_sink: function(){
   var possibleCoordinates = [],
    x = 0,
    y = 0,
    xMin = 0,
    xMax = 0,
    yMin = 0,
    yMax = 0,
    goVert = false,
    goHorz = false,
    lastHit = 0,
    previousHit = 0;

   // get last hit
   if(this.hitList[0]){
    lastHit = this.hitList[0];
   }
   // get hit before last
   if(this.hitList[1]){
    previousHit = this.hitList[1];
   }
   // starting coordinates
   x = lastHit.x;
   y = lastHit.y;

   // search boundaries
   xMin = x - this._maxSize;
   xMax = x + this._maxSize;
   yMin = y - this._maxSize;
   yMax = y + this._maxSize;

   // ensure search boundaries are in bounds
   //
   if(xMin < 0){
    xMin = 0;
   }
   if(xMax > this._dmSize){
    xMax = this._dmSize;
   }
   if(yMin < 0){
    yMin = 0;
   }
   if(yMax > this._dmSize){
    yMax = this._dmSize;
   }

   // see if we know the direction of the target
   if(previousHit.x || previousHit.y){
    // last two hits imply vertical target
    if(previousHit.x == x){
     // last two hits were next to each other
     if(Math.abs(previousHit.y - y) == 1){
      //console.log('goVert');
      goVert = true;
     }
    }
    // last two hits imply horizontal target
    if(previousHit.y == y){
     // last two hits were next to each other
     if(Math.abs(previousHit.x - x) == 1){
      //console.log('goHorz');
      goHorz = true;
     }
    }
   }

   // search for possible coordinates
   //
   // go left
   if(!goVert){
    for(var ix=x; ix>=xMin; ix--){
     // ran into previous hit no more possible in this direction
     if(this._enemyGrid[y][ix] == this.SHOT_FIRED){
      break;
     }else{
      if(this._enemyGrid[y][ix] != this.SHIP_HIT){
       possibleCoordinates.push(new gridCoordinate(ix, y, 0, 0));
      }
     }
    }
   }

   // go up
   if(!goHorz){
    for(var iy=y; iy>=yMin; iy--){
     // ran into previous hit no more possible in this direction
     if(this._enemyGrid[iy][x] == this.SHOT_FIRED){
      break;
     }else{
      if(this._enemyGrid[iy][x] != this.SHIP_HIT){
       possibleCoordinates.push(new gridCoordinate(x, iy, 0, 0));
      }
     }
    }
   }

   // go right
   if(!goVert){
    for(var ix=x; ix<=xMax; ix++){
     // ran into previous hit no more possible in this direction
     if(this._enemyGrid[y][ix] == this.SHOT_FIRED){
      break;
     }else{
      if(this._enemyGrid[y][ix] != this.SHIP_HIT){
       possibleCoordinates.push(new gridCoordinate(ix, y, 0, 0));
      }
     }
    }
   }

   // go down
   if(!goHorz){
    for(var iy=y; iy<=yMax; iy++){
     // ran into previous hit no more possible in this direction
     if(this._enemyGrid[iy][x] == this.SHOT_FIRED){
      break;
     }else{
      if(this._enemyGrid[iy][x] != this.SHIP_HIT){
       possibleCoordinates.push(new gridCoordinate(x, iy, 0, 0));
      }
     }
    }
   }

   // return the first possibility
   return possibleCoordinates[0];
  },

  /**
   * Hunt for targets
   * Determine the coordinates to fire upon
   * (Build the dynamic programming matrix)
   *
   * @private
   * @returns {Object} The gridCoordinate to fire upon
   */
  _getCoordinates_find: function(){
   var newXval = 0,
    newYval = 0,
    tmpScore = 0,

    highScoreN = (6-1),
    highScoreXs = [0,0,0,0,0,0],
    highScoreYs = [0,0,0,0,0,0],
    highScoreVals = [0,0,0,0,0,0],

    shotCoordinates = new coordinates(),
    scorePicker = Math.floor((Math.random()*highScoreN));

   // down-right traversal
   for(var iy=0; iy<=this._dmSize; iy++){
    for(var ix=0; ix<=this._dmSize; ix++){
     // determine values in the matrix
     if(!this._enemyGrid[iy][ix]){
      // x portion
      newXval = 0;
      if(ix > 0){
       if(this._dm[iy][ix-1]){
        newXval = this._dm[iy][ix-1].xVal;
       }
      }
      // y portion
      newYval = 0;
      if(iy > 0){
       if(this._dm[iy-1][ix]){
        newYval = this._dm[iy-1][ix].yVal;
       }
      }
     }else{
      newXval = -1;
      newYval = -1;
     }

     // create coordinate with values
     this._dm[iy][ix] =
      new gridCoordinate(
       ix,
       iy,
       newXval + 1,
       newYval + 1
      );
    }
   }

   // up-left traversal
   for(var iy=this._dmSize; iy>=0; iy--){
    for(var ix=this._dmSize; ix>=0; ix--){
     // determine values in the matrix
     if(!this._enemyGrid[iy][ix]){
      // x portion
      newXval = 0;
      if(ix < this._dmSize){
       if(this._dm[iy][ix+1]){
        newXval = this._dm[iy][ix+1].xValRev;
       }
      }
      // y portion
      newYval = 0;
      if(iy < this._dmSize){
       if(this._dm[iy+1][ix]){
        newYval = this._dm[iy+1][ix].yValRev;
       }
      }
     }else{
      newXval = -1;
      newYval = -1;
     }

     // update coordinate with values
     this._dm[iy][ix].addXY(
      newXval + 1,
      newYval + 1
     );

     // keep track of the maximum values
     // highScoreVals[5, 4, 3, 2, 1] -- descending value
     //
     // TODO: if we kept track of which ships were sunk
     // then we could eliminate cells which could not
     // possible hold the remaining ships
     //
     tmpScore = this._dm[iy][ix].getScore();
     // always record if new value is greater than least
     if(tmpScore > highScoreVals[highScoreN]){
      for(var i=0; i<=highScoreN; i++){
       if(tmpScore > highScoreVals[i]){
        highScoreXs.splice(i,0, ix);
        highScoreYs.splice(i,0, iy);
        highScoreVals.splice(i,0, tmpScore);
        break;
       }
      }
     // sometimes record if new value is equal to least
     // (so that results are less direcitonally biased)
     }else if(tmpScore == highScoreVals[highScoreN]){
      // Why 1 in 7? It "seems" to work well
      // (it would probably be better to vary
      // based upon number of open spots left)
      if(!Math.floor((Math.random()*7))){
       for(var i=0; i<=highScoreN; i++){
        if(tmpScore >= highScoreVals[i]){
         highScoreXs.splice(i,0, ix);
         highScoreYs.splice(i,0, iy);
         highScoreVals.splice(i,0, tmpScore);
         break;
        }
       }
      }
     }
    }
   }

   // randomly pick one of the options if we can
   if(highScoreVals[scorePicker]){
    shotCoordinates.x = highScoreXs[scorePicker];
    shotCoordinates.y = highScoreYs[scorePicker];

   // random choice was invalid, so take the highest
   }else{
    shotCoordinates.x = highScoreXs[0];
    shotCoordinates.y = highScoreYs[0];
   }

   return shotCoordinates;
  }
 }

 module.exports = bsCPUplayer;
