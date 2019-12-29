import {CaniDraw} from './caniDraw';
import {default as GeometryType} from 'ol/geom/GeometryType';
import RegularShape from 'ol/style/RegularShape';
import {Fill} from 'ol/style/Fill';
import {Stroke} from 'ol/style/Stroke';

export interface CaniDrawRectangleOptions extends RegularShape {
    fill?: Fill;
    stroke?: Stroke;
}

export class CaniDrawRectangle extends CaniDraw {
    geometry = GeometryType.CIRCLE;
    style: (color?: string) => CaniDrawRectangleOptions;

    constructor(type: string, helper: string, style?: (color?: string) => CaniDrawRectangleOptions) {
        super(type, helper, style);
        this.style = style;
    }
}
