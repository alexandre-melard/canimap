import {CaniDraw} from './caniDraw';
import {default as GeometryType} from 'ol/geom/GeometryType';
import {Icon} from 'ol/style/Icon';

export class CaniDrawPoint extends CaniDraw {
    geometry = GeometryType.POINT;
    style: (color?: string) => Icon;
    properties: any;

    constructor(type: string, helper: string, style?: (color?: string) => Icon, properties?) {
        super(type, helper, style);
        this.style = style;
        this.properties = properties;
    }
}
