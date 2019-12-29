import {CaniDrawPoint} from './caniDrawPoint';
import {Icon} from 'ol/style/Icon';

export class CaniDrawPointMarker extends CaniDrawPoint {
    constructor(helper: string, style?: (color?: string) => Icon) {
        super('Marker', helper, style);
    }
}
