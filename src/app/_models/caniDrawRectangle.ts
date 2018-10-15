import { Options as CircleOptions } from 'ol/style/Circle';
import { Fill } from 'ol/style/Fill';
import { Stroke } from 'ol/style/Stroke';
import { GeometryType } from 'ol/geom/GeometryType';
import { CaniDraw } from './caniDraw';

export interface CaniDrawRectangleOptions extends CircleOptions {
  fillOptions?: Fill;
  strokeOptions?: Stroke;
}

export class CaniDrawRectangle extends CaniDraw {
  geometry: GeometryType = 'Circle';
  style: (color?: string) => CaniDrawRectangleOptions;
  constructor(type: string, helper: string, style?: (color?: string) => CaniDrawRectangleOptions) {
    super(type, helper, style);
    this.style = style;
  }
}
