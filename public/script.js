var socket = io.connect();

$(function() {
    // draw the grid
    var gridDiv = document.querySelectorAll('.grid');
    for (var grid = 0; grid < gridDiv.length; grid++) {
      gridDiv[grid].removeChild(gridDiv[grid].querySelector('.hints'));
      for (var i = 0; i < 10; i++) {
        for (var j = 0; j < 10; j++) {
          var el = document.createElement('div');
          el.setAttribute('data-x', i);
          el.setAttribute('data-y', j);
          el.setAttribute('class', 'grid-cell grid-cell-' + i + '-' + j);
          gridDiv[grid].appendChild(el);
        }
      }
    }
})

//get the boat type
var text = '0';
$('.ships li').click(function(){
alert($(this).text());
text = $(this).text();
});

//place the boat in the grid on the client side
$('.gird-cell grid-cell-').click(function(){
var x = $(this).attr('data-x');
var y = $(this).attr('data-y');
$('.gird-cell grid-cell-' + x + '-' + y).text() = text;
});
