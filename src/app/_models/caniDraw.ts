import * as ol from 'openlayers';
import { CaniStyle } from './caniStyle';

export class CaniDraw {
  event: string;
  type: string;
  interaction: ol.interaction.Draw;
  helper: string;
  geometry?: ol.geom.GeometryType;
  style?: CaniStyle[];
  constructor(event: string, type: string, helper: string, geometry: ol.geom.GeometryType,
    style?: CaniStyle[], interaction?: ol.interaction.Draw) {
    this.event = event;
    this.type = type;
    this.helper = helper;
    this.geometry = geometry;
    this.interaction = interaction;
    this.style = (style !== undefined) ? style : new Array<CaniStyle>();
  }
}
