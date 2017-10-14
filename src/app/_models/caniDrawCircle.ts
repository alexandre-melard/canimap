import * as ol from 'openlayers';
import { CaniDraw } from './caniDraw';

export interface CaniDrawCircleOptions extends olx.style.CircleOptions {
  type: string;
}

export class CaniDrawCircle extends CaniDraw {
  geometry: ol.geom.GeometryType = 'Circle';
  style: (color?: string) => CaniDrawCircleOptions;
  constructor(type: string, helper: string, style?: (color?: string) => CaniDrawCircleOptions) {
    super(type, helper, style);
    this.style = style;
  }
}
