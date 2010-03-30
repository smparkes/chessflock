"use strict";
ChessFlock.UI.Base = new ChessFlock.UI.Class(function Base(uri){
  if (this.constructor !== Base) {
    new ChessFlock.Connection(uri);
  }
});
