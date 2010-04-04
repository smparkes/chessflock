"use strict";
ChessFlock.UI.Multi = new ChessFlock.UI.Class(function Multi(){
  var uri = ChessFlock.bosh_uri;
  uri = uri.replace(/chessflock:chessflock/,"chess:master");
  uri = uri.replace(/\/[^\/]+$/,"/chessflock");
  // uri = uri.replace(/\/[^\/]+$/,"/chessflock");
  ChessFlock.UI.Base.call(this, uri);
}, [ ChessFlock.UI.Base ] );
new ChessFlock.Class.Subscope(ChessFlock.UI.Multi);