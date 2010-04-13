"use strict";
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
