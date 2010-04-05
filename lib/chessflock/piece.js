"use strict";
ChessFlock.Piece = new ChessFlock.Class(function Piece(color, type, location){
  this.color = color;
  this.type = type;
  this.location = location;
}, {
  toJSON: function() {
    return ({
      color: this.color,
      type: this.type,
      location: this.location
    });
  }
});
