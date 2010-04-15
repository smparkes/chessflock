"use strict";
(function(){
  var global = (function(){return this;}());
  ChessFlock.Pieces = new ChessFlock.Class(function Pieces(){
    var layout = [
      [ "rook", [0, 7] ],
      [ "knight", [1, 6] ],
      [ "bishop", [2, 5] ],
      [ "queen", [3] ],
      [ "king", [4] ],
      [ "pawn", [8, 9, 10, 11, 12, 13, 14, 15] ] ];
    
    var colors = [ "white", "black" ];

    var Piece = ChessFlock.Piece;
    var pieces = this.pieces = [];
    this.positions = [];

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
        var position = offset+sign*positions[0];
        pieces.push(this.positions[position] = new Piece(color,type,position));
        for(var i=1; i<positions.length; i++) {
          position = offset+sign*positions[i];
          pieces.push(this.positions[position] = new Piece(color,type,position));
        }
      }
    }
  }, {
    each: function(fn) {
      for(var i=0; i < this.pieces.length; i++) {
        fn(this.pieces[i]);
      }
    },
    position: function(position) {
      return this.positions[position];
    },
    move: function(old_position, new_position) {
      // FIX: handle taking pieces
/*
      console.debug($.print(this.positions[old_position]),
                    $.print(this.positions[new_position]));
*/
      if (this.positions[new_position]) {
        this.positions[new_position].position = void(0);
        global.console.debug("taking "+new_position);
      }
      global.console.debug("moving "+old_position+" to "+ new_position);
      this.positions[new_position] = this.positions[old_position];
      delete this.positions[old_position];
      this.positions[new_position].position = new_position;
    },
    _state: function() {
      return this.pieces;
    },
    toJSON: function() {
      return this.pieces;
    }
});

ChessFlock.Piece = new ChessFlock.Class(function Piece(color, type, position){
  this.color = color;
  this.type = type;
  this.position = position;
}/*, {
  toJSON: function() {
    return ({
      color: this.color,
      type: this.type,
      position: this.position
    });
  }
}*/);
}());