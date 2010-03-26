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
        var global = (function(){return this;}());
        global.setTimeout(function(){
          self.populateSquares();
          self.populatePieces();
        },0);
      }
    });
  },{
    populateSquares: function() {
      var black = Checkmate.$(this.svg).find(".black.square").get(0);
      var white = Checkmate.$(this.svg).find(".white.square").get(0);
      this.squares = [ black, white ];
      var parent = black.parentNode;
      var ctm = parent.getCTM();
      this.invert = ctm.inverse();
      console.debug("bbb",black.getBBox().height,black.getBBox().width);
      var ctm = black.getCTM();
      console.debug("bctm","a",ctm.a,"b",ctm.b,"c",ctm.c,"d",ctm.d,"e",ctm.e,"f",ctm.f);
      this.size = black.getBBox().width;
      this.scale = {};
      this.scale.width = black.getCTM().a;
      this.scale.height = black.getCTM().d;
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
          var svg = Checkmate.$(this.svg).find("."+color+"."+type).get(0);
          var bb = svg.getBBox();
          var scale = {};
          console.debug(svg.getCTM().a,this.scale.width,1/Math.abs(svg.getCTM().a/this.scale.width));
          scale.width = this.scale.width/svg.getCTM().a;
          scale.height = this.scale.height/svg.getCTM().d;
          var piece;
          var horizontal = (this.size - Math.abs(bb.width/scale.width))/2;
          console.debug("sw",scale.width,bb.width/scale.width,this.size,horizontal);
          pieces.push(piece = new Checkmate.Board.View.SVG.Piece(this,color,type,svg,offset+sign*positions[0],horizontal,scale));
          var height = bb.height * scale.height;
          if (height > max_height) {
            max_height = height;
          }
          for(var i=1; i<positions.length; i++) {
            svg = piece.svg.cloneNode(true);
            piece.svg.parentNode.appendChild(svg);
            pieces.push(new Checkmate.Board.View.SVG.Piece(this,color,type,svg,offset+sign*positions[i],horizontal,scale));
          }
        }
      }
      this.vertical = (this.size - max_height)/2;
      this.place();
    },
    place: function() {
      for(var i=0; i < this.pieces.length; i++) {
        this.pieces[i].place();
      }
    }
  });
new Checkmate.Class.Subscope(Checkmate.Board.View.SVG);
Checkmate.Board.View.SVG.Piece = Checkmate.Board.View.SVG.Class(function Piece(view,color,type,svg,position,horizontal,scale){
  this.view = view;
  this.color = color;
  this.type = type;
  this.svg = svg;
  this.original_transform = $(this.svg).attr("transform");
  this.position = position;
  this.horizontal = horizontal;
  this.scale = scale;
}, {
  place: function() {
    var p = this.position;
    var s = this.view.size;
    var x = (this.horizontal + (p % 8) * s)*this.scale.width;
    var y = (this.view.vertical - (p / 8) * s)*this.scale.height;
    var transform = this.original_transform + " translate("+x+"  "+y+")";
    console.debug(p,x,y,transform);
    Checkmate.$(this.svg).attr("transform",transform);
  }
});