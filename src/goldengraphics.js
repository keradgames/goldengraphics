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

    renderer.context.drawImage (image, 0,   0);
    imageData = renderer.context.getImageData(0, 0, width, height);

    // restore previous render
    renderer.render();

    return imageData;
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
      _this.imageData = _this.cachedImageData;

      console.log(_this.imageData.data[0]);
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




  GoldenGraphics.filters = {};

  GoldenGraphics.filters.TintFilter = function(color){

  }






  exports.GoldenGraphics = GoldenGraphics;
})(window);