"use strict";
ChessFlock.Board.View.SVG =
  new ChessFlock.Board.View.Class(function SVG(element){
    this.$ = ChessFlock.$;
    var self = this;
    ChessFlock.$(element).svg({
      loadURL:"/board.svg",
      onLoad: function(wrapper) {
        self.svg = wrapper.root();
        self.svg.removeAttribute("height");
        self.svg.removeAttribute("width");
        self.populateSquares();
        self.populatePieces();
        // self.hidePieces();
        self.$("svg > g").css("opacity",0.0);
        self.disable();
        // self.populatePieces();
      }
    });
  },{
    disable: function() {
      this.$("svg > g").fadeTo("slow",0.5);
    },
    enable: function() {
      this.$("svg > g").fadeTo("slow",1.0);
    },
    hidePieces: function() {
      ChessFlock.$(".black,.white").not(".square").hide();
    },
    showPieces: function() {
      ChessFlock.$(".black,.white").not(".square").show();
    },
    populateSquares: function() {
      var black = ChessFlock.$(this.svg).find(".black.square").get(0);
      var white = ChessFlock.$(this.svg).find(".white.square").get(0);
      this.squares = [ black, white ];
      var parent = black.parentNode;
      // var ctm = black.getCTM();
      // console.debug("ctm","a",ctm.a,"b",ctm.b,"c",ctm.c,"d",ctm.d,"e",ctm.e,"f",ctm.f);
      this.size = black.getBBox().width;
      for (var row = 0; row < 8; row++) {
        for (var column = (row === 0 ? 2 : 0); column < 8; column++) {
          var color;
          var offset;
          if ((row + column) % 2 === 0) {
            color = black;
            offset = row%2;
          } else {
            color = white;
            offset = -row%2;
          }
          var copy = color.cloneNode(true);
          var delta_x = this.size*(2*Math.floor(column/2) + offset);
          var delta_y = -this.size*row;
          copy.setAttribute("transform",copy.getAttribute("transform")+" translate("+delta_x+" "+delta_y+")");
          parent.insertBefore(copy,black);
          this.squares.push(copy);
        }
      }
    },
    populatePieces: function() {
      var layout = [
        [ "rook", [0, 7] ],
        [ "knight", [1, 6] ],
        [ "bishop", [2, 5] ],
        [ "queen", [3] ],
        [ "king", [4] ],
        [ "pawn", [8, 9, 10, 11, 12, 13, 14, 15] ] ];
 
      var colors = [ "white", "black" ];

      var pieces = this.pieces = [];

      var max_height = 0;

      for(var color_index in colors) {
        var color = colors[color_index];
        var offset = 0;
        var sign = 1;
        if (color === "black") {
          offset = 63;
          sign = -1;
        }
        for(var layout_index in layout) {
          var type = layout[layout_index][0];
          var positions = layout[layout_index][1];
          var svg = ChessFlock.$(this.svg).find("."+color+"."+type).get(0);
          var bb = svg.getBBox();
          var piece;
          var horizontal = (this.size - bb.width)/2;
          pieces.push(piece = new ChessFlock.Board.View.SVG.Piece(this,color,type,svg,offset+sign*positions[0],horizontal));
          var height = bb.height;
          if (height > max_height) {
            max_height = height;
          }
          for(var i=1; i<positions.length; i++) {
            svg = piece.svg.cloneNode(true);
            piece.svg.parentNode.appendChild(svg);
            pieces.push(new ChessFlock.Board.View.SVG.Piece(this,color,type,svg,offset+sign*positions[i],horizontal));
          }
        }
      }
      this.vertical = (this.size - max_height)/2;
      this.place();
      this.showPieces();
    },
    place: function() {
      for(var i=0; i < this.pieces.length; i++) {
        this.pieces[i].place();
      }
    }
  });
new ChessFlock.Class.Subscope(ChessFlock.Board.View.SVG);
ChessFlock.Board.View.SVG.Piece = ChessFlock.Board.View.SVG.Class(function Piece(view,color,type,svg,position,horizontal){
  this.view = view;
  this.color = color;
  this.type = type;
  this.svg = svg;
  this.position = position;
  this.horizontal = horizontal;
}, {
  place: function() {
    var p = this.position;
    var s = this.view.size;
    var x = (this.horizontal + (p % 8) * s);
    var y = -(this.view.vertical + Math.floor(p / 8) * s);
    var transform = "translate("+x+"  "+y+")";
    ChessFlock.$(this.svg).attr("transform",transform);
  }
});