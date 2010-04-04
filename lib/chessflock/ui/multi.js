"use strict";
ChessFlock.UI.Multi = new ChessFlock.UI.Class(function Multi(){
  var uri = ChessFlock.bosh_uri;
  uri = uri.replace(/chessflock:chessflock/,"chess:master");
  uri = uri.replace(/\/[^\/]+$/,"/chessflock");
  // uri = uri.replace(/\/[^\/]+$/,"/chessflock");
  new Dramatis.Actor(this);
  Dramatis.Director.current.register("chessflock",this);
  ChessFlock.UI.Base.call(this, uri);
}, [ ChessFlock.UI.Base ], {
  join: function() {
    throw new Error("implement");
  }
});
new ChessFlock.Class.Subscope(ChessFlock.UI.Multi);