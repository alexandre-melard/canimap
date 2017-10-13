import * as ol from 'openlayers';
import { CaniDraw } from './caniDraw';

export class CaniDrawPolygon extends CaniDraw {
  geometry: ol.geom.GeometryType = 'Polygon';
  style: (color?: string) => olx.style.StyleOptions;
  constructor(type: string, helper: string, style?: (color?: string) => olx.style.StyleOptions) {
    super(type, helper, style);
    this.style = style;
  }
}
