import { Icon, Options as IconOptions } from 'ol/style/Icon';
import { CaniDraw } from './caniDraw';

export interface CaniDrawIconOptions extends IconOptions {
  type?: string;
  frequency?: number;
}

export class CaniDrawIcon extends Icon {
  type?: string;

  constructor(type?: string, style?: (color?: string) => CaniDrawIconOptions) {
    const s = style();
    super(s);
    this.type = type;
  }
}
