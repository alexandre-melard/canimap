import { lineStringStyle } from './map-style-linestring';

import * as ol from 'openlayers';
import { formatLength } from '../_utils/map-format-length';
import { hexToRgb } from '../_utils/color-hex-to-rgb';
import { colorGetBrightness } from '../_utils/color-brightness';


export function styleFunction(feature: ol.Feature) {
  const geometry: ol.geom.LineString = <ol.geom.LineString>feature.getGeometry();
  const icon = undefined;
  let styles = new Array<ol.style.Style>();
  if (geometry.getType() === 'LineString') {
    styles = styles.concat(lineStringStyle(feature));
  } else if (geometry.getType() === 'Point') {
    styles.push(new ol.style.Style({ image: new ol.style.Icon(feature.get('style')) }));
  } else {
    styles.push(new ol.style.Style(feature.get('style')));
  }
  return styles;
}
