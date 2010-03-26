"use strict";
Checkmate.Board.View.SVG =
  new Checkmate.Board.View.Class(function SVG(element){
    var self = this;
    Checkmate.$(element).svg({
      loadURL:"/board.svg",
      onLoad: function(wrapper) {
        self.svg = wrapper.root();
        self.svg.removeAttribute("height");
        self.svg.removeAttribute("width");
        setTimeout(function(){
          self.populateSquares();
        },0);
      }
    });
  },{
    populateSquares: function() {
      var black = $(this.svg).find(".black.square").get(0);
      var white = $(this.svg).find(".white.square").get(0);
      var size = black.getBBox().width;
      var ctm = black.getCTM();
      for (var row = 0; row < 1; row++) {
        for (var column = (row == 0 ? 0 : 0); column < 1; column++) {
          var copy = (((row + column) % 2 == 0) ? black : white).cloneNode(true);
          var delta_x = size*(2*Math.floor(column/2) + (row%2));
          var delta_y = -size*row;
          console.debug(delta_x,delta_y);
          var delta = black.getCTM().translate(delta_x,delta_y);
          copy.setAttribute("transform",[ "matrix(", [delta.a,delta.b,delta.c,delta.d,delta.e,delta.f].join(","), ")"].join(""));
          this.svg.appendChild(copy);
        }
      }
    }
  });
