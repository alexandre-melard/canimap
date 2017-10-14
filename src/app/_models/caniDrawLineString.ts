import * as ol from 'openlayers';
import { CaniDraw } from './caniDraw';
import { CaniDrawIconOptions } from './caniDrawIcon';

export interface CaniDrawTextOptions extends olx.style.TextOptions {
  fillOptions?: olx.style.FillOptions;
  strockeOptions?: olx.style.StrokeOptions;
}

export interface CaniDrawLineStringOptions extends olx.style.StyleOptions {
  type: string;
  fillOptions?: olx.style.FillOptions;
  strockeOptions?: olx.style.StrokeOptions;
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
