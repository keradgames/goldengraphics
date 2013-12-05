// COLOR

  GoldenGraphics.Color = GoldenGraphics.Base.extend({
    init: function(r, g, b, a){
      this._super();

      this.r = r || 0;
      this.g = g || 0;
      this.b = b || 0;
      this.a = a != undefined ? a : 1;
    },

    multiply: function(color) {
      return color;
    }
  });

  // Static functions

  GoldenGraphics.Color.fromHex = function(hex){
    var color = null;
    // Expand shorthand form (e.g. "03F") to full form (e.g. "0033FF")
    var shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
    hex = hex.replace(shorthandRegex, function(m, r, g, b) {
        return r + r + g + g + b + b;
    });

    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);

    if(result){
      color = new GoldenGraphics.Color(parseInt(result[1], 16), parseInt(result[2], 16), parseInt(result[3], 16));
    }

    return color;
  };
