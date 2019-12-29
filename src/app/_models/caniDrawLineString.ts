import {CaniDraw} from './caniDraw';
import {CaniDrawIconOptions} from './caniDrawIcon';
import {default as GeometryType} from 'ol/geom/GeometryType';
import {Text} from 'ol/style/Text';
import {Fill} from 'ol/style/Fill';
import {Stroke} from 'ol/style/Stroke';
import {Style} from 'ol/style/Style';


export interface CaniDrawLineStringOptions extends Style {
    type?: string;
    fill?: Fill;
    stroke?: Stroke;
    text?: Text;
    icon?: CaniDrawIconOptions;
}

export class CaniDrawLineString extends CaniDraw {
    geometry = GeometryType.LINE_STRING;
    style: (color: string) => CaniDrawLineStringOptions;

    constructor(type: string, helper: string, style?: (color?: string) => any) {
        super(type, helper, style);
        this.style = style;
    }
}
