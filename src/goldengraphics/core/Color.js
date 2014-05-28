
  // COLOR

  GoldenGraphics.Color = GoldenGraphics.Base.extend({
    init: function(r, g, b, a) {
      this._super();

      this.r = r || 0;
      this.g = g || 0;
      this.b = b || 0;
      this.a = a != undefined ? a : 1;
    },

    clone: function() {
      return new GoldenGraphics.Color(this.r, this.g, this.b, this.a);
    },

    multiply: function(color) {
      return color;
    },

    toHex: function() {
      return GoldenGraphics.Color.toHex(this);
    }
  });

  // Static functions

  GoldenGraphics.Color.fromHex = function(hex) {
    var color = null;
    // Expand shorthand form (e.g. "03F") to full form (e.g. "0033FF")
    var shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
    hex = hex.replace(shorthandRegex, function(m, r, g, b) {
      return r + r + g + g + b + b;
    });

    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);

    if (result) {
      color = new GoldenGraphics.Color(parseInt(result[1], 16), parseInt(result[2], 16), parseInt(result[3], 16));
    }

    return color;
  };

  GoldenGraphics.Color.toHex = function(color) {
    var base = 16;
    var r = color.r.toString(base);
    var g = color.g.toString(base);
    var b = color.b.toString(base);

    r = r.length === 1 ? '0' + r : r;
    g = g.length === 1 ? '0' + g : g;
    b = b.length === 1 ? '0' + b : b;

    return '#' + r + g + b;
  };

  GoldenGraphics.Color.gradientPoint = function(color1, color2, factor, stopColors) {
    var gradientColor = new GoldenGraphics.Color();

    if (factor === 0) {
      return color1.clone();
    } else if (factor === 1) {
      return color2.clone();
    }

    var colors = [color1];
    var index = 0;
    var partialFactor = 0;
    if (stopColors) {
      colors = colors.concat(stopColors);
      colors.push(color2);
      partialFactor = factor * (colors.length - 1);
      index = Math.floor(partialFactor);

      return GoldenGraphics.Color.gradientPoint(colors[index], colors[index + 1], partialFactor % 1);
    } else {
      gradientColor.r = color1.r + Math.floor((color2.r - color1.r) * factor);
      gradientColor.g = color1.g + Math.floor((color2.g - color1.g) * factor);
      gradientColor.b = color1.b + Math.floor((color2.b - color1.b) * factor);
      return gradientColor;
    }
  };