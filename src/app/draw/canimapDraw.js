L.Draw.K9 = L.Draw.Polyline.extend({
    statics : {
        TYPE : 'k9'
    },

    initialize: function (map, options) {
        // Save the type so super can fire, need to do this as cannot do this.TYPE :(
        this.type = L.Draw.K9.TYPE;
        L.Draw.Feature.prototype.initialize.call(this, map, options);
    }

   });

L.DrawToolbar.prototype.getModeHandlers= function (map) {
  return [
      {
          enabled: this.options.polyline,
          handler: new L.Draw.Polyline(map, this.options.polyline),
          title: L.drawLocal.draw.toolbar.buttons.polyline
      },
      {
          enabled: this.options.polygon,
          handler: new L.Draw.Polygon(map, this.options.polygon),
          title: L.drawLocal.draw.toolbar.buttons.polygon
      },
      {
          enabled: this.options.rectangle,
          handler: new L.Draw.Rectangle(map, this.options.rectangle),
          title: L.drawLocal.draw.toolbar.buttons.rectangle
      },
      {
          enabled: this.options.circle,
          handler: new L.Draw.Circle(map, this.options.circle),
          title: L.drawLocal.draw.toolbar.buttons.circle
      },
      {
          enabled: this.options.marker,
          handler: new L.Draw.Marker(map, this.options.marker),
          title: L.drawLocal.draw.toolbar.buttons.marker
      },
      {
          enabled: this.options.k9,
          handler: new L.Draw.K9(map, this.options.k9),
          title: L.drawLocal.draw.toolbar.buttons.k9
      }

  ];
};