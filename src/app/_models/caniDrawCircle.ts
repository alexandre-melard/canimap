import { Circle as CircleOptions } from 'ol/style/Circle';
import { GeometryType } from 'ol/geom/GeometryType';
import { CaniDraw } from './caniDraw';

export interface CaniDrawCircleOptions extends CircleOptions {
  type: string;
}

export class CaniDrawCircle extends CaniDraw {
  geometry: GeometryType = 'Circle';
  style: (color?: string) => CaniDrawCircleOptions;
  constructor(type: string, helper: string, style?: (color?: string) => CaniDrawCircleOptions) {
    super(type, helper, style);
    this.style = style;
  }
}
