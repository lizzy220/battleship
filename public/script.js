var socket = io.connect();

function sendMessage(i, j) {
      socket.emit(i * 10 + j);
}

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

    $(".grid-cell").click(function() {
      var i = this.getAttribute("data-x");
      var j = this.getAttribute("data-y");
      sendMessage(parseInt(i), parseInt(j));
    });
})
