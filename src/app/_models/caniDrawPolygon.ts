import {CaniDraw} from './caniDraw';
import {default as GeometryType} from 'ol/geom/GeometryType';
import {Style} from 'ol/style/Style';
import {Fill} from 'ol/style/Fill';
import {Stroke} from 'ol/style/Stroke';

export interface CaniDrawPolygonOptions extends Style {
    fill?: Fill;
    stroke?: Stroke;
}

export class CaniDrawPolygon extends CaniDraw {
    geometry = GeometryType.POLYGON;
    style: (color?: string) => CaniDrawPolygonOptions;

    constructor(type: string, helper: string, style?: (color?: string) => CaniDrawPolygonOptions) {
        super(type, helper, style);
        this.style = style;
    }
}
