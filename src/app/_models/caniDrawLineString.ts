import * as ol from 'openlayers';

import { CaniDraw } from './caniDraw';
import { CaniDrawIconOptions } from './caniDrawIcon';

export interface CaniDrawTextOptions extends ol.olx.style.TextOptions {
  fillOptions?: ol.olx.style.FillOptions;
  strokeOptions?: ol.olx.style.StrokeOptions;
}

export interface CaniDrawLineStringOptions extends ol.olx.style.StyleOptions {
  type?: string;
  fillOptions?: ol.olx.style.FillOptions;
  strokeOptions?: ol.olx.style.StrokeOptions;
  textOptions?: CaniDrawTextOptions;
  imageOptions?: CaniDrawIconOptions;
}

export class CaniDrawLineString extends CaniDraw {
  geometry: ol.geom.GeometryType = 'LineString';
  style: (color: string) => CaniDrawLineStringOptions;
  constructor(type: string, helper: string, style?: (color?: string) => CaniDrawLineStringOptions) {
    super(type, helper, style);
    this.style = style;
  }
}
