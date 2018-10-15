import { Options as TextOptions } from 'ol/style/Text';
import { Options as StyleOptions } from 'ol/style/Style';
import { Options as FillOptions } from 'ol/style/Fill';
import { Options as StrokeOptions } from 'ol/style/Stroke';
import { GeometryType } from 'ol/geom/GeometryType';

import { CaniDraw } from './caniDraw';
import { CaniDrawIconOptions } from './caniDrawIcon';

export interface CaniDrawTextOptions extends TextOptions {
  fillOptions?: FillOptions;
  strokeOptions?: StrokeOptions;
}

export interface CaniDrawLineStringOptions extends StyleOptions {
  type?: string;
  fillOptions?: FillOptions;
  strokeOptions?: StrokeOptions;
  textOptions?: CaniDrawTextOptions;
  imageOptions?: CaniDrawIconOptions;
}

export class CaniDrawLineString extends CaniDraw {
  geometry: GeometryType = 'LineString';
  style: (color: string) => CaniDrawLineStringOptions;
  constructor(type: string, helper: string, style?: (color?: string) => CaniDrawLineStringOptions) {
    super(type, helper, style);
    this.style = style;
  }
}
