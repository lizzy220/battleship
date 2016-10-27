__Command 1__<br />
curl -X POST https://thebattleship.herokuapp.com/loadGame<br />
**Usage:** When you need to start or restart a game, simply use the above command.<br />
**Expected output:** Any information about AI board and player board like following<br />
{<br />
  "aiBoard":{"sunkPts":[],"hitPts":[],"missPts":[]},<br />
  "playerBoard":{<br />
    "destroyer":{"direction":1,"position":44,"length":2,"hit":0,"status":"alive"},<br />
    "submarine":{"direction":1,"position":58,"length":3,"hit":0,"status":"alive"},<br />
    "cruiser":{"direction":1,"position":17,"length":3,"hit":0,"status":"alive"},<br />
    "battleship":{"direction":0,"position":22,"length":4,"hit":0,"status":"alive"},<br />
    "carrier":{"direction":1,"position":53,"length":5,"hit":0,"status":"alive"},<br />
    "missPts":[],<br />
    "hitPts":[],<br />
    "sunkPts":[],<br />
    "aliveShipNum":5,<br />
    "count":0,"hits":0<br />
  },<br />
  "nextTurn":"player"<br />
}


__Command 2__<br />
curl --data "location = (the location you want to hit)" https://thebattleship.herokuapp.com/hit<br />
**Usage:** use this command to vote. In our game, when you want to hit a cell in the grid, you
first need to vote, and then server will select the cell which is voted the most times. If
you vote to hit the third row's sixth cell, location = (3 - 1) * 10 + (6 - 1),and this
command will be:

curl --data "location = 25" https://thebattleship.herokuapp.com/hit

**The expected output:**<br />
{<br />
   "success":true,<br />
   "message":{"location ":" 25"}<br />
}
