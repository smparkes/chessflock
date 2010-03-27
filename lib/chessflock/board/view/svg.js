"use strict";
ChessFlock.Board.View.SVG =
  new ChessFlock.Board.View.Class(function SVG(element){
    this.$ = ChessFlock.$;
    var self = this;
    ChessFlock.$(element).svg({
      loadURL:"/board.svg",
      onLoad: function(wrapper) {
        self.svg = wrapper.root();
        self.svg.removeAttribute("height");
        self.svg.removeAttribute("width");
        self.populateSquares();
        self.populatePieces();
        // self.hidePieces();
        self.$("svg > g").css("opacity",0.0);
        self.disable();
        // self.populatePieces();

        var s = function(m) {
          return [m.a, m.b, m.c, m.d, m.e, m.f].join(" ");
        };

        var bbs = function(bb) {
          return [bb.x, bb.y, bb.width, bb.height].join(" ");
        };

        console.debug("r",bbs($(".board rect")[0].getBBox()));

        console.debug("bs",bbs($(".black.square").last()[0].getBBox()));
        console.debug("bs",s($(".black.square").last()[0].getCTM()));

        var bs = $(".black.square").last();
        console.debug("bst",bs.attr("transform"));
        bs.attr("transform","rotate(45 45 395)");

        var bs1 = $(".black.square").eq(0);

        bs1.attr("transform",bs1.attr("transform") +" rotate(45 45 395)");

        var wpx = $(".white.pawn").not(".rotate").eq(0);
        console.debug("wpx",wpx.attr("transform"));
        var m = wpx.attr("transform").match(/([-\d\.]*),([-\d\.]*)/);
        var x = parseFloat(m[1]);
        var y = parseFloat(m[2]);
        var bb = wpx[0].getBBox();
        console.debug("wpxbb",bbs(bb));
        y -= (self.size - bb.height)/2;
        console.debug($.print(m));
        var t = "translate("+x+","+y+")";
        console.debug(t);
        var wp = $(".white.pawn .rotate").eq(0);
        console.debug("wpbb",bbs(wp[0].getBBox()));
        console.debug("t",wp.attr("transform"));
        // wp.attr("transform","rotate(45 45 415)");

        var x = 29;
        var y = 405;
        var ssss = "rotate(0,"+x+","+y+")";
        wp.data("svgTransform",ssss);
        wp[0].setAttribute("transform",ssss);
        console.debug("SST",ssss,wp.attr("transform"),wp[0].getAttribute("transform"));
        if (true) {
          wpx.animate({
            svgTransform: t
          },{
            duration: 7500
          });
          wp.animate({
            svgTransform: "rotate(180,"+x+","+y+")"
          },{
            duration: 7500,
            complete: function() {
              console.debug("SSX",wp.attr("transform"));
            }
          });
        }

        console.debug("bs",bbs($(".black.square")[1].getBBox()));
        console.debug("bs",s($(".black.square")[1].getCTM()));

        console.debug("ws",bbs($(".white.square")[0].getBBox()));
        

        var box = self.$("svg > g").get(0).getBBox();
        console.debug(box.x,box.y,box.width,box.height);
        var p = $("svg .white,svg .black").not(".square")[0];
        var ctm = p.getCTM();
        console.debug("a",ctm.a,"b",ctm.b,"c",ctm.c,"d",ctm.d,"e",ctm.e,"f",ctm.f);
        var inv = ctm.inverse();
        console.debug("a",inv.a,"b",inv.b,"c",inv.c,"d",inv.d,"e",inv.e,"f",inv.f);
        var bb = p.getBBox();
        console.debug("bb",bb.x,bb.y);
        var t = [ "matrix(" +s(inv)+")",
                  "rotate(10,-20,-390)",
                  "matrix("+s(ctm)+")" ].join(" ");
        console.debug(t);
        // console.debug($(p).attr("transform"));
        $(p).attr("transform",t);
        // console.debug($(p).attr("transform"));
        if (false) {
          self.$("svg > g").attr("transform","rotate(0,"+(box.width/2)+","+(box.height/2)+")");
          self.$("svg > g").animate({
            svgTransform: "rotate(180,"+(box.width/2)+","+(box.height/2)+")"
          }, {
            duration: 750,
            complete: function() {
            }
          });
        }
      }
    });
  },{
    disable: function() {
      this.$("svg > g").fadeTo("slow",0.5);
    },
    enable: function() {
      this.$("svg > g").fadeTo("slow",1.0);
    },
    hidePieces: function() {
      ChessFlock.$(".black,.white").not(".square").hide();
    },
    showPieces: function() {
      ChessFlock.$(".black,.white").not(".square").show();
    },
    populateSquares: function() {
      var black = ChessFlock.$(this.svg).find(".black.square").get(0);
      var white = ChessFlock.$(this.svg).find(".white.square").get(0);
      this.squares = [ black, white ];
      var parent = black.parentNode;
      this.size = black.getBBox().width;
      for (var row = 0; row < 8; row++) {
        for (var column = (row === 0 ? 2 : 0); column < 8; column++) {
          var color;
          var offset;
          var delta_x = 0;
          var delta_y = 0;
          if ((row + column) % 2 === 0) {
            color = black;
            offset = row%2;
          } else {
            color = white;
            offset = -row%2;
          }
          var copy = color.cloneNode(true);
          delta_x += this.size*(2*Math.floor(column/2) + offset);
          delta_y += -this.size*row;
          $(copy).attr("transform","translate("+delta_x+","+delta_y+")");
          $(copy).data("svgTransform","translate("+delta_x+","+delta_y+")");
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
          var svg = ChessFlock.$(this.svg).find("."+color+"."+type).get(0);
          var bb = svg.getBBox();
          var piece;
          var horizontal = (this.size - bb.width)/2;
          pieces.push(piece = new ChessFlock.Board.View.SVG.Piece(this,color,type,svg,offset+sign*positions[0],horizontal));
          var height = bb.height;
          if (height > max_height) {
            max_height = height;
          }
          for(var i=1; i<positions.length; i++) {
            svg = piece.svg.cloneNode(true);
            piece.svg.parentNode.appendChild(svg);
            pieces.push(new ChessFlock.Board.View.SVG.Piece(this,color,type,svg,offset+sign*positions[i],horizontal));
          }
        }
      }
      this.vertical = (this.size - max_height)/2;
      this.place();
      this.showPieces();
    },
    place: function() {
      for(var i=0; i < this.pieces.length; i++) {
        this.pieces[i].place();
      }
    }
  });
new ChessFlock.Class.Subscope(ChessFlock.Board.View.SVG);
ChessFlock.Board.View.SVG.Piece = ChessFlock.Board.View.SVG.Class(function Piece(view,color,type,svg,position,horizontal){
  this.view = view;
  this.color = color;
  this.type = type;
  this.svg = svg;
  this.position = position;
  this.horizontal = horizontal;
}, {
  place: function() {
    var p = this.position;
    var s = this.view.size;
    var x = (this.horizontal + (p % 8) * s);
    var y = -(this.view.vertical + Math.floor(p / 8) * s);
    var transform = "translate("+x+","+y+")";
    ChessFlock.$(this.svg).attr("transform",transform);
    ChessFlock.$(this.svg).data("svgTransform",transform);
  }
});