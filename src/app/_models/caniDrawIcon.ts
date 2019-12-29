import {Icon} from 'ol/style/Icon';

export interface CaniDrawIconOptions extends Icon {
    type?: string;
    frequency?: number;
}

export class CaniDrawIcon extends Icon {
    type?: string;

    constructor(type?: string, style?: (color?: string) => CaniDrawIconOptions) {
        const s = style();
        super(s);
        this.type = type;
    }
}
