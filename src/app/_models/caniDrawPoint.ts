import { Options as IconOptions } from 'ol/style/Icon';
import { GeometryType } from 'ol/geom/GeometryType';
import { CaniDraw } from './caniDraw';

export class CaniDrawPoint extends CaniDraw {
  geometry: GeometryType = 'Point';
  style: (color?: string) => IconOptions;
  properties: any;
  constructor(type: string, helper: string, style?: (color?: string) => IconOptions, properties?) {
    super(type, helper, style);
    this.style = style;
    this.properties = properties;
  }
}
