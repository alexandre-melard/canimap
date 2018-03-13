import { lineStringStyle } from './map-style-linestring';
import { formatLength } from '../_utils/map-format-length';
import { hexToRgb } from '../_utils/color-hex-to-rgb';
import { colorGetBrightness } from '../_utils/color-brightness';
import { fillOptions } from '../_utils/map-style-options-fill';
import { strokeOptions } from '../_utils/map-style-options-stroke';
import * as ol from 'openlayers';

export function styleFunction(feature: ol.Feature, resolution: number) {
  const geometry: ol.geom.LineString = <ol.geom.LineString>feature.getGeometry();
  const icon = undefined;
  let styles = new Array<ol.style.Style>();
  if (geometry.getType() === 'LineString') {
    styles = styles.concat(lineStringStyle(feature, resolution));
  } else if (geometry.getType() === 'Point') {
    styles.push(new ol.style.Style({ image: new ol.style.Icon(feature.get('style')) }));
  } else {
    const style = feature.get('style');
    style.fill = new ol.style.Fill(style.fillOptions);
    style.stroke = new ol.style.Stroke(style.strokeOptions);
    styles.push(new ol.style.Style(style));
  }
  return styles;
}
