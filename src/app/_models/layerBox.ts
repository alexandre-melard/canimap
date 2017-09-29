export class LayerBox {
    key: string;
    name: string;
    layer: L.TileLayer;
    constructor(key: string, name: string, layer: L.TileLayer) {
      this.key = key;
      this.layer = layer;
      this.name = name;
    }
  }