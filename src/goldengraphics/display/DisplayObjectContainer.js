// DISPLAY OBJECT CONTAINER

  GoldenGraphics.DisplayObjectContainer = GoldenGraphics.Base.extend({
    init : function(){
      this.children = [];
      this.filters = [];
      this.imageData = null;
      this.parent = null;

    },

    addChild : function(child){
      this.addChildAt(child, this.children.length);
    },



    addChildAt : function(child, index){
      if(index > this.children.length){
        index = this.children.length;
      }

      if(this.children.indexOf(child) < 0){
        this.children.splice(index, 0, child);
        child.parent = this;
        this._addChildToStage(child);
      }

    },

    removeChild : function(child){
      if(this.children.indexOf(child) > -1){
        this.children.splice(this.children.indexOf(child), 1);
        this._removeChildFromStage(child);
        child.parent = null;

        // clear render
        // this.
      }
    },

    contains : function(child){
      return this.children.indexOf(child) > -1;
    },

    applyFilters: function(){
      for(var i in this.filters){
        if(this.filters.hasOwnProperty(i)){
          this.filters[i].apply(this.cachedImageData, this.imageData);
        }
      }
    },

    // private properties

    _addChildToStage: function(child){
      if(child.stage != this.stage){
        child.stage = this.stage;
        for(var i in child.children){
          if(child.children.hasOwnProperty(i)){
            this._addChildToStage(child.children[i]);
          }
        }
      }
    },

    _removeChildFromStage: function(child){
      child.stage = null;
      for(var i in child.children){
        if(child.children.hasOwnProperty(i)){
          this._removeChildFromstage(child.children[i]);
        }
      }
    },

    _updateImageData: function(){
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
      if(this.stage){
        // for each child
        for(var i in this.children){
          if(this.children.hasOwnProperty(i)){
            renderData = renderData || this.cachedImageData ? this.cachedImageData : this.stage.renderer.context.createImageData(this.stage.renderer.canvas.width, this.stage.renderer.canvas.height);
            child = this.children[i];
            childImageData = child.imageData;

            x = Math.round(child.position.x);
            y = Math.round(child.position.y);

            if(child.opacity > 0 && childImageData){
              matrixSize = renderData.data.length - 1;

              child._updateImageData();

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

        this.applyFilters();

        if(_log && _log.length > 0){
          console.log(_log);
        }

        this.imageData = renderData || this.imageData;
      }
    }
  })