import * as ol from 'openlayers';

export class CaniDraw {
    event: string;
    type: string;
    interaction: ol.interaction.Draw;
    helper: string;
    geometry: ol.geom.GeometryType;
    style: Function;

    constructor(type: string, helper: string, style?: Function) {
        this.event = 'draw-' + type;
        this.type = type;
        this.helper = helper;
        this.style = style;
    }
}
