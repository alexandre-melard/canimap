import { Options as StyleOptions } from 'ol/style/Style';
import { Options as FillOptions } from 'ol/style/Fill';
import { Options as StrokeOptions } from 'ol/style/Stroke';
import { GeometryType } from 'ol/geom/GeometryType';
import { CaniDraw } from './caniDraw';

export interface CaniDrawPolygonOptions extends StyleOptions {
  fillOptions?: FillOptions;
  strokeOptions?: StrokeOptions;
}

export class CaniDrawPolygon extends CaniDraw {
  geometry: GeometryType = 'Polygon';
  style: (color?: string) => CaniDrawPolygonOptions;
  constructor(type: string, helper: string, style?: (color?: string) => CaniDrawPolygonOptions) {
    super(type, helper, style);
    this.style = style;
  }
}
