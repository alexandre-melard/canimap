import { Base } from 'ol/layer/Base';

export class LayerBox {
  key: string;
  name: string;
  layer: Base;
  constructor(key: string, name: string, layer: Base) {
    this.key = key;
    this.layer = layer;
    this.name = name;
  }
}
