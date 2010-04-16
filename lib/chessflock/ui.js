"use strict";
(function(){
  var global = (function(){return this;}());
  ChessFlock.UI = new ChessFlock.Class(function UI(uri, fn){
    if (this.constructor !== UI) {
      new ChessFlock.Connection(uri, fn);
      new Dramatis.Actor(this);
    }
  });
}());

new ChessFlock.Class.Subscope(ChessFlock.UI);
