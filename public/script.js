var socket = io.connect();

socket.on('message', function(data) {
    var i = data['location'] / 10;
    var j = data['location'] % 10;
    var player = data['player'];
    $(player + ' ' + '.grid-cell-' + i + '-' + j).css('background-color', '#ff6666');
    console.log(data);
    // if(data[success]){
    //     $(player + ' ' + '.grid-cell-' + i + '-' + j).style.backgroundColor = '#ff6666';
    // }else{
    //     $(player + ' ' + '.grid-cell-' + i + '-' + j).style.backgroundColor = '#99ff66';
    // }
});



$(function() {
    //hide the game board, set a username to play
    $(".container").hide();
    $("#start").click(function() {
        if($('#username').val()!="") {
         socket.emit('username', $('#username').val());
         $(".container").show();
         $(".register").hide();
         }
         else {
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
              console.log(i * 10 + j);
          }
      });
    });
    //get the boat type
    var text = '0';
    $('.ships li').click(function(){
    alert($(this).text());
    text = $(this).text();
    });
})
