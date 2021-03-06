// RENDERING

GoldenGraphics.CanvasRenderer = GoldenGraphics.Base.extend({
  init: function() {
    this.canvas = document.createElement('canvas');
    this.context = this.canvas.getContext("2d");

    this.context.globalCompositeOperation = "destination-over";
    this.imageData = this.context.createImageData(this.canvas.width, this.canvas.height);
  },

  render: function(stage) {
    // clear canvas
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);

    var t0 = (new Date()).getTime();
    if (stage) {
      this._updateImageData(stage);

      if (stage._render && stage._render._imageToRender) {
        this.context.drawImage(stage._render._imageToRender, 0, 0, stage._render._imageToRender.width, stage._render._imageToRender.height);
      }
    } else {
      console.log('Stage is not defined');
    }

    var t1 = (new Date()).getTime();

    // console.log("render", (t1 - t0));


  },

  resize: function(width, height) {
    this.canvas.width = width;
    this.canvas.height = height;
  },

  _updateImageData: function(displayObject) {
    var child = null;


    var x = 0;
    var y = 0;
    var width;
    var height;


    var _log = "";

    // only update render data for objects in the stage
    if (displayObject && displayObject.stage) {
      displayObject._render = displayObject._render || {};


      if (!displayObject._render._canvas) {
        this._createTextureCanvas(displayObject);
      } else {
        displayObject._render._context.clearRect(-displayObject._render._canvas.width, -displayObject._render._canvas.height,
          displayObject._render._canvas.width * 2,
          displayObject._render._canvas.height * 2
        );
      }

      if (displayObject.texture) {
        displayObject._render._context.drawImage(
          displayObject.texture,
          0,
          0,
          displayObject.texture.width,
          displayObject.texture.height
        );
      } else {
        width = displayObject.width || this.canvas.width / displayObject.scale.x;
        height = displayObject.height || this.canvas.height / displayObject.scale.y;
        width = displayObject._render._canvas.width;
        height = displayObject._render._canvas.height;
      }

      // for each child
      for (var i in displayObject.children) {
        if (displayObject.children.hasOwnProperty(i)) {


          child = displayObject.children[i];

          if (child.opacity > 0) {

            this._updateImageData(child);

            if (child._render._imageToRender) {
              displayObject._render._context.setTransform(child.scale.x, 0, 0, child.scale.y, child.position.x, child.position.y);
              displayObject._render._context.globalAlpha = child.opacity;
              displayObject._render._context.drawImage(
                child._render._imageToRender,
                child.anchor.x * -displayObject.width,
                child.anchor.y * -displayObject.height,
                child._render._imageToRender.width,
                child._render._imageToRender.height
              );
              displayObject._render._context.restore();
            }
          }
        }
      }

      if (displayObject.filters && displayObject.filters.length > 0) {
        this._applyFilters(displayObject);
        displayObject._render._imageToRender = displayObject._render._canvas;
      } else {
        if (displayObject.children.length > 0) {
          displayObject._render._imageToRender = displayObject._render._canvas;
        } else {
          displayObject._render._imageToRender = displayObject.texture;
        }
      }

    }
  },

  _cacheImageData: function(displayObject) {
    if (displayObject.texture) {
      displayObject.cachedImageData = this.getImageData(displayObject.texture);
      displayObject.imageData = this.cloneImageData(displayObject.cachedImageData);
    }
  },

  _createTextureCanvas: function(displayObject) {
    displayObject._render = displayObject._render || {};

    displayObject._render._canvas = document.createElement('canvas');
    displayObject._render._context = displayObject._render._canvas.getContext('2d');
    // document.body.appendChild(displayObject._render._canvas);

    if (displayObject.texture) {
      displayObject._render._canvas.width = displayObject.texture.width;
      displayObject._render._canvas.height = displayObject.texture.height;
    } else {
      displayObject._render._canvas.width = displayObject.width || this.canvas.width / displayObject.scale.x;
      displayObject._render._canvas.height = displayObject.height || this.canvas.height / displayObject.scale.y;
    }
  },

  _applyFilters: function(displayObject) {
    for (var i in displayObject.filters) {
      if (displayObject.filters.hasOwnProperty(i)) {
        displayObject._render = displayObject._render || {};

        displayObject.filters[i].apply(displayObject);
      }
    }
  },

  getImageData: function(image) {
    var imageData = null;
    var width = Math.min(image.width, this.canvas.width);
    var height = Math.min(image.height, this.canvas.height);

    // draw image in canvas to retrieve image data

    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.context.drawImage(image, 0, 0);
    imageData = this.context.getImageData(0, 0, width, height);

    // clear canvas after caching image

    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);

    // restore previous render
    // this.render();

    return imageData;
  },

  cloneImageData: function(imageData) {
    var clone = this.context.createImageData(imageData);
    var l = clone.data.length;

    for (var i = 0; i < l; i++) {
      clone.data[i] = imageData.data[i];
    }

    return clone;
  }
});

// Static functions and properties