// RENDERING

  GoldenGraphics.CanvasRenderer = GoldenGraphics.Base.extend({
    init: function(canvas){
      this.canvas = canvas;
      this.context = this.canvas.getContext("2d");
      this.stage = new GoldenGraphics.Stage(this);
      this.imageData = this.context.createImageData(this.canvas.width, this.canvas.height);

      GoldenGraphics.CanvasRenderer.instance = this;
    },

    render: function() {
      // clear canvas
      this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);

      this.stage._updateImageData();

      if(this.stage.imageData){
        this.context.putImageData(this.stage.imageData, 0, 0);
      }
    }
  });

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
