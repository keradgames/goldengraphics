// RENDERING

  GoldenGraphics.CanvasRenderer = GoldenGraphics.Base.extend({
    init: function(canvas){
      this.canvas = canvas;
      this.context = this.canvas.getContext("2d");
      this.imageData = this.context.createImageData(this.canvas.width, this.canvas.height);
    },

    render: function(stage) {
      // clear canvas
      this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);

      this._updateImageData(stage);

      if(stage.imageData){
        this.context.putImageData(stage.imageData, 0, 0);
      }
    },

    _updateImageData: function(displayObject){
      var pos = 0;
      var renderData = null;
      var childImageData = null;
      var child = null;

      // TODO do not create new image data
      var renderData = null;

      var dataLength = 0;
      var matrixSize = 0;
      var r = 0;
      var g = 0;
      var b = 0;
      var a = 0;
      var a0 = 0;
      var af = 0;
      var x = 0;
      var y = 0;
      var pos_x = 0;
      var pos_y = 0;

      var _log = "";

      // only update render data for objects in the stage
      if(displayObject && displayObject.stage){
        if(!displayObject.cachedImageData){
          this._cacheImageData(displayObject);
        }

        // for each child
        for(var i in displayObject.children){
          if(displayObject.children.hasOwnProperty(i)){
            renderData = renderData || displayObject.cachedImageData ? displayObject.cachedImageData : this.context.createImageData(this.canvas.width, this.canvas.height);
            child = displayObject.children[i];


            if(child.texture && !child.cachedImageData){
              this._cacheImageData(child);
            }


            childImageData = child.imageData;

            x = Math.round(child.position.x);
            y = Math.round(child.position.y);

            if(child.opacity > 0 && childImageData){
              matrixSize = renderData.data.length - 1;

              this._updateImageData(child);

              for(var j = 0; j < childImageData.width; j++){
                for(var k = 0; k < childImageData.height; k++){
                  pos = (j * childImageData.width + k) * 4;
                  pos_x = k + x;
                  pos_y = j + y;

                  // only render pixels inside the screen, avoid mirror effect
                  if(pos_x >= 0 && pos_y >= 0 && pos_x < renderData.width && pos_y < renderData.height){
                    renderPos = (pos_y * renderData.width + pos_x) * 4;

                    // _log += renderPos + " ,";

                    r = childImageData.data[pos+0];
                    g = childImageData.data[pos+1];
                    b = childImageData.data[pos+2];
                    a0 = childImageData.data[pos+3];

                    a = a0 / 255 * child.opacity; //normaliza alpha between 0 and 1 and apply opacity

                    // check render for pixels with alpha > 0
                    if(a > 0 && renderPos < matrixSize){
                      af = renderData.data[renderPos+3] / 255 || 1;

                      renderData.data [renderPos+0] = r * a + (1 - a) * renderData.data [renderPos+0] * af;
                      // _log += renderPos + " " + renderData.data [renderPos] + ", ";
                      renderData.data [renderPos+1] = g * a + (1 - a) * renderData.data [renderPos+1] * af;
                      renderData.data [renderPos+2] = b * a + (1 - a) * renderData.data [renderPos+2] * af;
                      renderData.data [renderPos+3] = Math.max(a0 * a, renderData.data [renderPos+3]);
                    }
                  }
                }
              }
            }
          }
        }

        displayObject.applyFilters();

        if(_log && _log.length > 0){
          console.log(_log);
        }

        displayObject.imageData = renderData || displayObject.imageData;
      }
    },

    _cacheImageData: function(displayObject){
      if(displayObject.texture){
        displayObject.cachedImageData = this.getImageData(displayObject.texture);
        displayObject.imageData = this.cloneImageData(displayObject.cachedImageData);
      }
    },

    getImageData: function(image){
      var imageData = null;
      var width = image.width;
      var height = image.height;

      // draw image in canvas to retrieve image data

      this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
      this.context.drawImage (image, 0,   0);
      imageData = this.context.getImageData(0, 0, width, height);

      // clear canvas after caching image

      this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);

      // restore previous render
      // this.render();

      return imageData;
    },

    cloneImageData: function(imageData){
      var clone = this.context.createImageData(imageData);
      var l = clone.data.length;

      for(var i = 0; i < l; i++){
        clone.data[i] = imageData.data[i];
      }

      return clone;
    }
  });

  // Static functions and properties

