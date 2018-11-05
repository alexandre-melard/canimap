import { CaniDraw } from './caniDraw';
import * as ol from 'openlayers';


export interface CaniDrawCircleOptions extends ol.olx.style.CircleOptions {
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
