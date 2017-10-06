import * as ol from 'openlayers';
import { CaniStyle } from './caniStyle';

export class CaniDraw {
  event: string;
  type: string;
  geometry?: ol.geom.GeometryType;
  interaction: ol.interaction.Draw;
  helper: string;
  style?: CaniStyle[];
  constructor(event: string, type: string, helper: string, geometry: ol.geom.GeometryType,
    interaction?: ol.interaction.Draw, style?: CaniStyle[]) {
      this.event = event;
      this.type = type;
      this.helper = helper;
      this.geometry = geometry;
      this.interaction = interaction;
      this.style = (style !== undefined) ? style : new Array<CaniStyle>();
  }
}
