  // STAGE
  GoldenGraphics.Stage = GoldenGraphics.DisplayObjectContainer.extend({
    init : function(renderer){
      this._super();
      this.renderer = renderer;
      this.stage = this;
    }
  });