import { Options as IconOptions } from 'ol/style/Icon';
import { CaniDrawPoint } from './caniDrawPoint';

export class CaniDrawPointMarker extends CaniDrawPoint {
  constructor(helper: string, style?: (color?: string) => IconOptions) {
    super('Marker', helper, style);
  }
}
