(function(exports){
  var GoldenGraphics = {};


  GoldenGraphics.CanvasRenderer = function(canvas){
    this.canvas = canvas;
    this.context = this.canvas.getContext("2d");
    this.stage = new GoldenGraphics.Stage(this);
    this.imageData = this.context.createImageData(this.canvas.width, this.canvas.height);

    GoldenGraphics.CanvasRenderer.instance = this;
  };

  GoldenGraphics.CanvasRenderer.prototype.render = function() {
    // clear canvas
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);

    this.stage.updateImageData();

    if(this.stage.imageData){
      this.context.putImageData(this.stage.imageData, 0, 0);
    }
  };

  // Static functions and properties

  GoldenGraphics.CanvasRenderer.instance = null;

  GoldenGraphics.CanvasRenderer.getImageData = function(image){
    var renderer = GoldenGraphics.CanvasRenderer.instance;
    var imageData = null;
    var width = image.width;
    var height = image.height;

    // draw image in canvas to retrieve image data

    renderer.context.clearRect(0, 0, renderer.canvas.width, renderer.canvas.height);
    renderer.context.drawImage (image, 0,   0);
    imageData = renderer.context.getImageData(0, 0, width, height);

    // restore previous render
    renderer.render();

    return imageData;
  };

  GoldenGraphics.CanvasRenderer.cloneImageData = function(imageData){
    var renderer = GoldenGraphics.CanvasRenderer.instance;
    var clone = renderer.context.createImageData(imageData);
    var l = clone.data.length;

    for(var i = 0; i < l; i++){
      clone.data[i] = imageData.data[i];
    }

    return clone;
  };


  // STAGE
  // TODO create Display Object Container

  GoldenGraphics.Stage = function(renderer){
    this.renderer = renderer;
    this.children = [];
    this.imageData = null;
  }

  GoldenGraphics.Stage.prototype.addChild = function(child) {
    this.children.push(child);
  };

  GoldenGraphics.Stage.prototype.updateImageData = function(){
    var l = this.children.length;

    var pos = 0;
    var inpos = 0;
    var renderData = null;
    var child = null;
    var imageData = null;

    this.imageData = this.renderer.context.createImageData(this.renderer.canvas.width, this.renderer.canvas.height);

    var dataLength = 0;
    var r = 0;
    var g = 0;
    var b = 0;
    var a = 0;
    var a0 = 0;
    var af = 0;
    var x = 0;
    var y = 0;

    var _log = "";

    // for each child
    for(var i =0; i < l; i++){
      child = this.children[i];
      imageData = child.imageData;
      x = Math.round(child.position.x);
      y = Math.round(child.position.y);

      if(child.opacity > 0 && imageData){
        dataLength = imageData.data.length;

        child.applyFilters();

        // for(var j = 0; j < dataLength; j += 4){
        //   pos = j;
        //   r = imageData.data[pos+0];
        //   g = imageData.data[pos+1];
        //   b = imageData.data[pos+2];
        //   a0 = imageData.data[pos+3];

        //   a = a0 / 255; //normaliza alpha between 0 and 1

        //   // check render for pixels with alpha > 0
        //   if(a > 0){
        //     af = this.imageData.data[j+3] / 255 || 1;

        //     this.imageData.data [pos] = r * a + (1 - a) * this.imageData.data [pos] * af;
        //     _log += pos + " " + this.imageData.data [pos] + ", ";

        //     pos ++;
        //     this.imageData.data [pos] = g * a + (1 - a) * this.imageData.data [pos] * af;
        //     pos ++;
        //     this.imageData.data [pos] = b * a + (1 - a) * this.imageData.data [pos] * af;
        //     pos ++;
        //     this.imageData.data [pos] = Math.max(a0 * a, this.imageData.data [pos]);

        //   }
        // }


        for(var j = 0; j < imageData.width; j++){
          for(var k = 0; k < imageData.height; k++){
            pos = (j * imageData.width + k) * 4;
            renderPos = ((j + y) * this.imageData.width + (k + x)) * 4;

            r = imageData.data[pos+0];
            g = imageData.data[pos+1];
            b = imageData.data[pos+2];
            a0 = imageData.data[pos+3];

            a = a0 / 255 * child.opacity; //normaliza alpha between 0 and 1 and apply opacity

            // check render for pixels with alpha > 0
            if(a > 0){
              af = this.imageData.data[renderPos+3] / 255 || 1;

              this.imageData.data [renderPos+0] = r * a + (1 - a) * this.imageData.data [renderPos+0] * af;
              // _log += renderPos + " " + this.imageData.data [renderPos] + ", ";
              this.imageData.data [renderPos+1] = g * a + (1 - a) * this.imageData.data [renderPos+1] * af;
              this.imageData.data [renderPos+2] = b * a + (1 - a) * this.imageData.data [renderPos+2] * af;
              this.imageData.data [renderPos+3] = Math.max(a0 * a, this.imageData.data [renderPos+3]);
            }
          }
        }
      }

    }

  };


  // COLOR

  GoldenGraphics.Color = function(r, g, b, a){

    this.r = r || 0;
    this.g = g || 0;
    this.b = b || 0;
    this.a = a != undefined ? a : 1;

  }

  GoldenGraphics.Color.prototype.multiply = function(color) {
    return color;
  };

  // POSITION

  GoldenGraphics.Position = function(x, y){
    this.x = x || 0;
    this.y = y || 0;
  }




  GoldenGraphics.Sprite = function(image){
    var _this = this;
    this.cachedImageData = null;
    this.imageData = null;
    this.stage = null;
    this.position = new GoldenGraphics.Position();
    this.filters = [];
    this.opacity = 1;

    function onImageLoad (){
      _this.cachedImageData = GoldenGraphics.CanvasRenderer.getImageData(this);
      _this.imageData = GoldenGraphics.CanvasRenderer.cloneImageData(_this.cachedImageData);
    }

    image.addEventListener("load", onImageLoad);
  };


  GoldenGraphics.Sprite.fromImageUrl = function(url){
    var image = new Image();
    var sprite = null;

    image.src = url;
    sprite = new GoldenGraphics.Sprite(image);

    return sprite;
  }

  GoldenGraphics.Sprite.prototype.applyFilters = function(){
    for(var i = 0; i < this.filters.length; i++){
      this.filters[i].apply(this.cachedImageData, this.imageData);
    }
  }


  // FILTERS

  GoldenGraphics.filters = {};

  // TintFilter (color)
  // TintFilter (r, g, b, a)

  GoldenGraphics.filters.TintFilter = function(){
    var color = null;

    if(arguments.length == 1){
      color = arguments[0];
    }
    else{
      color = new GoldenGraphics.Color(arguments[0], arguments[1], arguments[2], arguments[3]);
    }

    this.color = color;
  }

  GoldenGraphics.filters.TintFilter.prototype.apply = function(origin, target) {
    var pos = 0;
    var inpos = 0;

    var r = this.color.r;
    var g = this.color.g;
    var b = this.color.b;

    var _log = "";

    for (var i = 0; i < origin.width; i ++){
      for (var j = 0; j < origin.height; j ++){
        var r_0 = origin.data [inpos++];
        var g_0 = origin.data [inpos++];
        var b_0 = origin.data [inpos++];
        var a_0 = origin.data [inpos++];

        if (a_0 > 0){
          target.data [pos] = r * origin.data [pos] / 255;
          pos ++;
          target.data [pos] = g * origin.data [pos] / 255;
          pos ++;
          target.data [pos] = b * origin.data [pos] / 255;
          pos ++;
          target.data [pos] = origin.data [pos];
          pos ++;
        }
        else{
          pos += 4;
        }
      }
    }
  }






  exports.GoldenGraphics = GoldenGraphics;
})(window);