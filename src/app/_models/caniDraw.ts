import {Draw} from 'ol/interaction/Draw';
import {Style} from 'ol/style/Style';

import {GeometryType} from 'ol/geom/GeometryType';


export class CaniDraw {
    event: string;
    type: string;
    interaction: Draw;
    helper: string;
    geometry: GeometryType;
    style: Style;

    constructor(type: string, helper: string, style?: Style) {
        this.event = 'draw-' + type;
        this.type = type;
        this.helper = helper;
        this.style = style;
    }
}
