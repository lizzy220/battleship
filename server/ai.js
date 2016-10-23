var Gameboard = require('./gameboard');

var AI = function() {
    this.aiBoard = new Gameboard();
    this.playerBoard = new Gameboard();
    console.log(this.aiBoard)
    // console.log(this.playerBoard)
}

module.exports = {
    AI: AI(),
}
