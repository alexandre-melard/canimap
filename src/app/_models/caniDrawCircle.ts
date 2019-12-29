import {CaniDraw} from './caniDraw';
import {CircleStyle} from 'ol/style/Circle';
import {default as GeometryType} from 'ol/geom/GeometryType';


export interface CaniDrawCircleOptions extends CircleStyle {
    type: string;
}

export class CaniDrawCircle extends CaniDraw {
    geometry = GeometryType.CIRCLE;
    style: (color?: string) => CaniDrawCircleOptions;

    constructor(type: string, helper: string, style?: (color?: string) => CaniDrawCircleOptions) {
        super(type, helper, style);
        this.style = style;
    }
}
