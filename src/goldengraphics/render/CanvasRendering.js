// RENDERING

  GoldenGraphics.CanvasRenderer = GoldenGraphics.Base.extend({
    init: function(){
      this.canvas = document.createElement('canvas');
      this.context = this.canvas.getContext("2d");
      this.imageData = this.context.createImageData(this.canvas.width, this.canvas.height);
    },

    render: function(stage) {
      // clear canvas
      this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);

      var t0 = (new Date()).getTime();
        $('img').remove();

      if(stage){
        this._updateImageData(stage);


        // if(stage.imageData){
        //   this.context.putImageData(stage.imageData, 0, 0);
        // }

        if(stage._render && stage._render._imageToRender){
          this.context.drawImage(stage._render._imageToRender, 0, 0, stage._render._imageToRender.width, stage._render._imageToRender.height);
        }
      }
      else{
        console.log('Stage is not defined');
      }

      var t1 = (new Date()).getTime();

      console.log("render", (t1 - t0));


    },

    resize : function(width, height){
      this.canvas.width = width;
      this.canvas.height = height;
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
      var renderDataWidth = 0;
      var renderDataHeight = 0;
      var childImageWidth = 0;
      var childImageHeight = 0;

      var _log = "";

      // only update render data for objects in the stage
      if(displayObject && displayObject.stage){
        displayObject._render = displayObject._render || {};


        if(!displayObject._render._canvas){
          this._createTextureCanvas(displayObject);
        }
        else{
          displayObject._render._context.clearRect(0, 0, displayObject._render._canvas.width, displayObject._render._canvas.height);
        }

          displayObject._render._imageToRender = new Image();
        if(!displayObject._render._imageToRender){
        }

        if(displayObject.texture){
          displayObject._render._context.drawImage(displayObject.texture, 0, 0, displayObject.texture.width, displayObject.texture.height);
        }

        // for each child
        for(var i in displayObject.children){
          if(displayObject.children.hasOwnProperty(i)){


            child = displayObject.children[i];


            x = Math.round(child.position.x);
            y = Math.round(child.position.y);

            if(child.opacity > 0){

              this._updateImageData(child);

              if(child._render._imageToRender){

                var t0 = (new Date()).getTime();
                var t1 = (new Date()).getTime();
                var limit = 500;

                while(!child._render._imageToRender.complete && t1 - t0 < limit){
                  t1 = (new Date()).getTime();
                }

                if(child._render._imageToRender.complete){
                  displayObject._render._context.drawImage(child._render._imageToRender, x, y, child._render._imageToRender.naturalWidth, child._render._imageToRender.naturalHeight);
                }
                else{
                  console.log(child._render._imageToRender.complete, child._render._imageToRender.naturalWidth, child._render._imageToRender.naturalHeight);
                  debugger;
                  child._render._imageToRender.onload = function(){
                    debugger;
                  };
                }
              }
            }
          }
        }

        if(displayObject.filters && displayObject.filters.length > 0){
          this._applyFilters(displayObject);
          displayObject._render._imageToRender.src = displayObject._render._canvas.toDataURL();
        }
        else{
          if(displayObject.children.length > 0){
            displayObject._render._imageToRender.src = displayObject._render._canvas.toDataURL();
          }
          else{
            displayObject._render._imageToRender = displayObject.texture;
          }
        }


        // console.log("img", displayObject._render._imageToRender.src);

      }
    },

    _cacheImageData: function(displayObject){
      if(displayObject.texture){
        displayObject.cachedImageData = this.getImageData(displayObject.texture);
        displayObject.imageData = this.cloneImageData(displayObject.cachedImageData);
      }
    },

    _createTextureCanvas: function(displayObject){
      displayObject._render = displayObject._render || {};
      displayObject._render._canvas = document.createElement('canvas');
      displayObject._render._context = displayObject._render._canvas.getContext('2d');
      document.body.appendChild(displayObject._render._canvas);

      if(displayObject.texture){
        displayObject._render._canvas.width = displayObject.texture.width;
        displayObject._render._canvas.height = displayObject.texture.height;
      }
      else{
        displayObject._render._canvas.width = this.canvas.width;
        displayObject._render._canvas.height = this.canvas.height;
      }
    },

    _applyFilters : function(displayObject){
      for(var i in displayObject.filters){
        if(displayObject.filters.hasOwnProperty(i)){
          var imageData = displayObject._render._context.getImageData(0, 0, displayObject._render._canvas.width, displayObject._render._canvas.height);
          var filteredImageData = displayObject._render._context.createImageData(imageData);

          displayObject.filters[i].apply(imageData, filteredImageData);
          displayObject._render._context.putImageData(filteredImageData, 0, 0);
        }
      }
    },

    getImageData: function(image){
      var imageData = null;
      var width = Math.min(image.width, this.canvas.width);
      var height = Math.min(image.height, this.canvas.height);

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