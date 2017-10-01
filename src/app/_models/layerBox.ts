import { layer } from 'openlayers';

export class LayerBox {
    key: string;
    name: string;
    layer: layer.Base;
    constructor(key: string, name: string, layer: layer.Base) {
      this.key = key;
      this.layer = layer;
      this.name = name;
    }
  }
