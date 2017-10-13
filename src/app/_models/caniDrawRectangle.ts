import * as ol from 'openlayers';
import { CaniDraw } from './caniDraw';

export interface CaniDrawRectangleOptions extends olx.style.CircleOptions {
  type: string;
}

export class CaniDrawRectangle extends CaniDraw {
  geometry: ol.geom.GeometryType = 'Circle';
  style: (color?: string) => CaniDrawRectangleOptions;
  constructor(type: string, helper: string, style?: (color?: string) => CaniDrawRectangleOptions) {
    super(type, helper, style);
    this.style = style;
  }
}
