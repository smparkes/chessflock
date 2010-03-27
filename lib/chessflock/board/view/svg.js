"use strict";
(function($){
  var global = (function(){return this;}());

  var transform = function(object,value) {
    $(object).attr("transform",value).data("svgTransform",value);
  };

  ChessFlock.Board.View.SVG =
    new ChessFlock.Board.View.Class(function SVG(element){
      global.board = this;
      var self = this;
      $(element).svg({
        loadURL:"/board.svg",
        onLoad: function(wrapper) {
          self.svg = wrapper.root();
          self.svg.removeAttribute("height");
          self.svg.removeAttribute("width");
          self.g = $(self.svg).children("g");
          self.positions = [];
          self.populateSquares();
          self.populatePieces();
          self.origin = 0;
          self.reset();
          self.showPieces();
          // self.hidePieces();
          self.g.css("opacity",0.0);
          self.disable();
          // self.populatePieces();
          self.rotate(180,1000);
        }
      });
    },{
      reset: function() {
        transform(this.g.find(".scale"),"scale(1,1)");
        transform(this.g.find(".translate"),"translate(0,0)");
        var box = this.g.get(0).getBBox();
        transform(this.g,"rotate(0,"+(box.width/2)+","+(box.height/2)+")");
        this.place();
      },
      disable: function() {
        this.g.fadeTo("slow",0.5);
      },
      enable: function() {
        this.g.fadeTo("slow",1.0);
      },
      hidePieces: function() {
        $(".black,.white").not(".square").hide();
      },
      showPieces: function() {
        $(".black,.white").not(".square").show();
      },
      populateSquares: function() {
        var black = this.g.find(".black.square").get(0);
        var white = this.g.find(".white.square").get(0);
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
            transform(copy,"translate("+delta_x+","+delta_y+")");
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
            var svg = this.g.find("."+color+"."+type).get(0);
            var bb = svg.getBBox();
            /* web kit gets the bb wrong; there's a rect in there to force it */
            var rect;
            if ((rect = $(svg).find("rect")[0])) {
              bb = rect.getBBox();
            }
            var piece;
            pieces.push(piece = new ChessFlock.Board.View.SVG.Piece(this,color,type,svg,offset+sign*positions[0]));
            var height = bb.height;
            if (height > max_height) {
              max_height = height;
            }
            for(var i=1; i<positions.length; i++) {
              svg = piece.svg.cloneNode(true);
              piece.svg.parentNode.appendChild(svg);
              pieces.push(new ChessFlock.Board.View.SVG.Piece(this,color,type,svg,offset+sign*positions[i]));
            }
          }
        }
        this.max_height = max_height;
        this.vertical = (this.size - max_height)/2;
      },
      place: function() {
        for(var i=0; i < this.pieces.length; i++) {
          this.pieces[i].place();
        }
      },
      scale: function(scale,duration,complete) {
        var bbox = this.g[0].getBBox();
        var offset = (1-scale)*bbox.width/2;
        var completed = 0;
        var _complete = function() {
          if (++completed === 2) {
            if (complete) { complete(); }
          }
        };
        this.g.find(".translate").animate({
          svgTransform: "translate("+offset+","+offset+")"
        }, {
          duration: duration,
          queue: false,
          complete: _complete
        });
        this.g.find(".scale").animate({
          svgTransform: "scale("+scale+","+scale+")"
        }, {
          duration: duration,
          queue: false,
          complete: _complete
        });
      },
      rotate: function(degrees, duration) {
        degrees = degrees || 180;
        var self = this;
        var box = this.g.get(0).getBBox();

        var complete = function() {
          self.origin = 63-self.origin;
          self.place();
          self.reset();
        };

        self.scale(1/Math.sqrt(2),duration/2);
        if (true) {
          var easing = [ 'swing' ];
          this.g.animate({
            svgTransform: "rotate("+((easing.length > 1)?90:180)+","+(box.width/2)+","+(box.height/2)+")"
          }, {
            duration: easing.length > 1 ? duration/2 : duration,
            easing: easing[0],
            complete: function() {
              if (easing.length > 1) {
                self.g.animate({
                  svgTransform: "rotate(180,"+(box.width/2)+","+(box.height/2)+")"
                }, {
                  duration: duration/2,
                  easing: easing[1],
                  complete: function() {
                    self.scale(1,duration/2,complete);
                  }
                });
              } else {
                self.scale(1,duration/2,complete);
              }
            }
          });
          global.setTimeout(function(){
            $.each(self.pieces,function(){
              this.rotate(180,duration);
            });
          },duration*0.8);
        }
      }
    });
  new ChessFlock.Class.Subscope(ChessFlock.Board.View.SVG);
  ChessFlock.Board.View.SVG.Piece =
    ChessFlock.Board.View.SVG.Class(function Piece(view,color,type,svg,position){
      this.view = view;
      this.bbox = svg.getBBox();
      var rect;
      if ((rect = $(svg).find("rect")[0])) {
        this.bbox = rect.getBBox();
      }
      this.horizontal = (this.view.size - this.bbox.width)/2;
      this.view.positions[position] = this;
      this.color = color;
      this.type = type;
      this.svg = svg;
      this.svg_rotate = $(svg).children(".rotate")[0];
      this.position = position;
      this.center = {x: this.bbox.x+this.bbox.width/2, y: this.bbox.y+this.bbox.height/2};
  }, {
    place: function() {
      var p = Math.abs(this.view.origin - this.position);
      var s = this.view.size;
      this.x = (this.horizontal + (p % 8) * s);
      this.y = -(this.view.vertical + Math.floor(p / 8) * s);
      if(false && this.type === "knight") {
        var bb = $(this.svg).find("rect")[0].getBBox();
        global.console.debug(this.view.size,bb.x,bb.y,bb.width,bb.height);
        global.console.debug(this.horizontal,s);
        global.console.debug(this.x,this.y);
      }
      var translate = "translate("+this.x+","+this.y+")";
      transform(this.svg,translate);
      var rotate = "rotate(0,"+(this.center.x)+","+(this.center.y)+")";
      transform(this.svg_rotate,rotate);
    },
    rotate: function(degrees,duration) {
      var self = this;
      if ((self.view.max_height-self.bbox.height) > 0) {
        $(self.svg).animate({
          svgTransform: "translate("+self.x+","+(self.y-(self.view.max_height-self.bbox.height))+")"
        },duration);
      }
      $(self.svg_rotate).animate({
        svgTransform: "rotate("+degrees+","+(self.center.x)+","+(self.center.y)+")"
      },duration);
    }
  });
}(jQuery));