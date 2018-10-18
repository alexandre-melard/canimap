import * as ol from 'openlayers';
import { CaniDraw } from './caniDraw';

export interface CaniDrawIconOptions extends ol.olx.style.IconOptions {
  type?: string;
  frequency?: number;
}

export class CaniDrawIcon extends ol.style.Icon {
  type?: string;

  constructor(type?: string, style?: (color?: string) => CaniDrawIconOptions) {
    const s = style();
    super(s);
    this.type = type;
  }
}
