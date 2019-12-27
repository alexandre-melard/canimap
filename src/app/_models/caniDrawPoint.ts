import * as ol from 'openlayers';
import {CaniDraw} from './caniDraw';

export class CaniDrawPoint extends CaniDraw {
    geometry: ol.geom.GeometryType = 'Point';
    style: (color?: string) => ol.olx.style.IconOptions;
    properties: any;

    constructor(type: string, helper: string, style?: (color?: string) => ol.olx.style.IconOptions, properties?) {
        super(type, helper, style);
        this.style = style;
        this.properties = properties;
    }
}
