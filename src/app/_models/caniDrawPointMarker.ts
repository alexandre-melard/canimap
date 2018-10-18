import * as ol from 'openlayers';
import { CaniDrawPoint } from './caniDrawPoint';

export class CaniDrawPointMarker extends CaniDrawPoint {
  constructor(helper: string, style?: (color?: string) => ol.olx.style.IconOptions) {
    super('Marker', helper, style);
  }
}
