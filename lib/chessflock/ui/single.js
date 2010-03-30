"use strict";
ChessFlock.UI.Single = new ChessFlock.UI.Class(function Single(){
  ChessFlock.UI.Base.call(this, ChessFlock.bosh_uri);
  new ChessFlock.Board.View.SVG(ChessFlock.$(".board").first());
}, [ ChessFlock.UI.Base ] );
new ChessFlock.Class.Subscope(ChessFlock.UI.Single);