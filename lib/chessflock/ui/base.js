"use strict";
(function(){
  var global = (function(){return this;}());
  ChessFlock.UI.Base = new ChessFlock.UI.Class(function Base(uri, fn){
    throw new Error("tbd");
    if (this.constructor !== Base) {
      new ChessFlock.Connection(uri, fn);
    }
  });
}());