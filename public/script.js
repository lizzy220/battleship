var socket = io.connect();

socket.on('message', function(data) {
    var gameboardName = data['gameboardName'];
    var gameboard = data['gameboard'];
    //refresh the gameboard
    var classPrefix = '.' + gameboardName + ' ' + '.grid-cell-';
    refreshMisses(gameboard, classPrefix);
    refreshShip(gameboard.destroyer, classPrefix);
    refreshShip(gameboard.submarine, classPrefix);
    refreshShip(gameboard.cruiser, classPrefix);
    refreshShip(gameboard.battleship, classPrefix);
    refreshShip(gameboard.carrier, classPrefix);

});

socket.on('newlog', function(data){
  addLog(data['username'], data['pos']);
});

function refreshMisses(gameboard, classPrefix){
    for(var k in gameboard.misses){
        var i = Math.floor(gameboard.misses[k] / 10);
        var j = gameboard.misses[k] % 10;
        $(classPrefix + i + '-' + j).css('background-color', '#99ff99');
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
        }
    }else{
        for(var k = 0; k < ship.length; k++, i++){
            if(((1 << k) & ship.hit) > 0)
                $(classPrefix + i + '-' + j).css('background-color', color);
        }
    }
}

function addLog(name, pos){
  var i = Math.floor(pos/10);
  var j = pos % 10;
  var logbar = document.getElementById('log');
  var action = document.createElement('div');
  action.innerHTML =  name + ' vote: (' + i +',' + j +')';
  logbar.appendChild(action);
}

$(function() {
    var myname;

    //hide the game board, set a username to play
    $(".container").hide();
    $("#start").click(function() {
      if($('#username').val()!="") {
        myname = $('#username').val();
        socket.emit('username', $('#username').val());
        $(".container").show();
        $(".register").hide();
      }else {
        alert('please enter a username!');
      }
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
      addLog('me', pos);
      var mes = {'username':myname, 'pos':pos};
      socket.emit('newlog', mes);
    });
    //get the boat type
    var text = '0';
    $('.ships li').click(function(){
    alert($(this).text());
    text = $(this).text();
    });
})
