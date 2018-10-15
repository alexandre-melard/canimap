import { Draw } from 'ol/interaction/Draw';
import { GeometryType } from 'ol/geom/GeometryType';
import { CaniStyle } from './caniStyle';

export class CaniDraw {
  event: string;
  type: string;
  interaction: Draw;
  helper: string;
  geometry: GeometryType;
  style: Function;
  constructor(type: string, helper: string, style?: Function) {
    this.event = 'draw-' + type;
    this.type = type;
    this.helper = helper;
    this.style = style;
  }
}
