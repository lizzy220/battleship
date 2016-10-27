var socket = io.connect();

socket.on('message', function(data) {
    var gameboardName = data['gameboardName'];
    var gameboard = data['gameboard'];
    //refresh the gameboard
    var classPrefix = '.' + gameboardName + ' ' + '.grid-cell-';
    if(gameboardName == "human-player") refreshPlayerBoard(gameboard, classPrefix);
    else refreshComputerBoard(gameboard, classPrefix);
    if(data["winner"] != "") gameFinish(data["winner"]);
});

socket.on('newVote', function(data){
  addNewVote(data['username'], data['pos']);
});

socket.on('newMove', function(data){
  addNewMove(data['name'], data['pos']);
});

socket.on('systemMessage', function(data){
  addSystemMessage(data);
});

function refreshPlayerBoard(gameboard, classPrefix){
  refreshMissHitsSunks(gameboard.missPts, classPrefix, '#00e6ac');
  refreshShip(gameboard.destroyer, classPrefix);
  refreshShip(gameboard.submarine, classPrefix);
  refreshShip(gameboard.cruiser, classPrefix);
  refreshShip(gameboard.battleship, classPrefix);
  refreshShip(gameboard.carrier, classPrefix);
}

function refreshComputerBoard(computerBoard, classPrefix){
    refreshMissHitsSunks(computerBoard['missPts'], classPrefix, '#00e6ac');
    refreshMissHitsSunks(computerBoard['hitPts'], classPrefix, '#ff6666');
    refreshMissHitsSunks(computerBoard['sunkPts'], classPrefix, '#000000');
}

function refreshMissHitsSunks(nums, classPrefix, color){
    for(var k in nums){
        var i = Math.floor(nums[k] / 10);
        var j = nums[k] % 10;
        $(classPrefix + i + '-' + j).css('background-color', color);
      }
}

function refreshShip(ship, classPrefix){
    var color = '#ff6666';
    if(ship.status == 'sunk') color = '#000000';
    var i = Math.floor(ship.position / 10), j = ship.position % 10;
    if(ship.direction == 0){
        for(var k = 0; k < ship.length; k++, j++){
            if(((1 << k) & ship.hit) > 0)
                $(classPrefix + i + '-' + j).css('background-color', color);
            else {
                $(classPrefix + i + '-' + j).css('background-color', '#666699');
            }
        }
    }else{
        for(var k = 0; k < ship.length; k++, i++){
            if(((1 << k) & ship.hit) > 0)
                $(classPrefix + i + '-' + j).css('background-color', color);
            else {
                $(classPrefix + i + '-' + j).css('background-color', '#666699');
            }
        }
    }
}

function gameFinish(winner){
    $(".container").hide();
    $(".game-finish-info").show();
    $(".winner").html(winner + " Win !");
}

function addNewVote(name, pos){
  var i = Math.floor(pos/10);
  var j = pos % 10;
  var logbar = document.getElementById('log');
  var action = document.createElement('div');
  action.className = "log-entry";
  action.innerHTML =  '<b>' + name + '</b> vote: (' + i +',' + j +')';
  logbar.insertBefore(action, logbar.childNodes[0]);
}

function addNewMove(name, pos){
  var i = Math.floor(pos/10);
  var j = pos % 10;
  var logbar = document.getElementById('log');
  var action = document.createElement('div');
  action.className = "log-entry";
  action.innerHTML =  '<b>' + name + '</b> hits: (' + i +',' + j +')';
  logbar.insertBefore(action, logbar.childNodes[0]);
}

function addSystemMessage(msg) {
    var logbar = document.getElementById('log');
    var action = document.createElement('div');
    action.className = "log-entry";
    action.innerHTML =  '<b>System</b>: ' + msg;
    logbar.insertBefore(action, logbar.childNodes[0]);
}

$(function() {
    var myname;
    //hide the game board, set a username to play
    $(".container").hide();
    $(".game-finish-info").hide();
    $("#start").click(function() {
      if($('#username').val()!="") {
        myname = $('#username').val();
        socket.emit('username', $('#username').val());
        $(".container").show();
        $(".register").hide();
      }else {
        alert('please enter a username!');
      }
      $.ajax({
          url: "/loadGame",
          type: "post",
          success: function(data){
              refreshComputerBoard(data['aiBoard'], '.computer-player .grid-cell-');
              refreshPlayerBoard(data['playerBoard'], '.human-player .grid-cell-');
          }
      });
    });
    // draw the grid
    var gridDiv = document.querySelectorAll('.grid');
    for (var grid = 0; grid < gridDiv.length; grid++) {
      gridDiv[grid].removeChild(gridDiv[grid].querySelector('.hints'));
      for (var i = 0; i < 10; i++) {
        for (var j = 0; j < 10; j++) {
          var cell = document.createElement('div');
          cell.setAttribute('data-x', i);
          cell.setAttribute('data-y', j);
          cell.setAttribute('method', 'post')
          cell.setAttribute('class', 'grid-cell grid-cell-' + i + '-' + j);
          gridDiv[grid].appendChild(cell);
        }
      }
    }
    $(".computer-player .grid-cell").click(function() {
      var i = parseInt(this.getAttribute("data-x"));
      var j = parseInt(this.getAttribute("data-y"));
      $.ajax({
          url: "/hit",
          type: "post",
          data: {
            'location': i * 10 + j,
          },
          success: function(data){
              // console.log(i * 10 + j);
          }
      });
      var pos = i*10+j;
      addNewVote('me', pos);
      var mes = {'username':myname, 'pos':pos};
      socket.emit('newVote', mes);
    });

    $('#restart').click(function(){
      $(".game-finish-info").hide();
      $(".container").show();
      $.ajax({
          url: "/loadGame",
          type: "post",
          success: function(data){
              recoverGameBoard();
              refreshComputerBoard(data['aiBoard'], '.computer-player .grid-cell-');
              refreshPlayerBoard(data['playerBoard'], '.human-player .grid-cell-');
          }
      });
    });
})

function recoverGameBoard(){
  for (var i = 0; i < 10; i++) {
    for (var j = 0; j < 10; j++) {
      $('.human-player .grid-cell-' + i + '-' + j).css('background-color', '#FFFFCC');
      $('.computer-player .grid-cell-' + i + '-' + j).css('background-color', '#FFFFCC');
    }
  }
}
