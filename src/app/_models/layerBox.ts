import {Layer} from 'ol/layer/Layer';

export class LayerBox {
    key: string;
    name: string;
    layer: Layer;

    constructor(key: string, name: string, base: Layer) {
        this.key = key;
        this.layer = base;
        this.name = name;
    }
}
