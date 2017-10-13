import * as ol from 'openlayers';
import { CaniDraw } from './caniDraw';

export class CaniDrawPoint extends CaniDraw {
  geometry: ol.geom.GeometryType = 'Point';
  style: (color?: string) => olx.style.IconOptions;
  constructor(type: string, helper: string, style?: (color?: string) => olx.style.IconOptions) {
    super(type, helper, style);
    this.style = style;
  }
}
