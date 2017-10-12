import { markerStyle } from './map-style-marker';
import { lineStringStyle } from './map-style-linestring';

import * as ol from 'openlayers';
import { formatLength } from '../_utils/map-format-length';
import { hexToRgb } from '../_utils/color-hex-to-rgb';
import { colorGetBrightness } from '../_utils/color-brightness';


export function styleFunction(feature: ol.Feature) {
  const geometry: ol.geom.LineString = <ol.geom.LineString>feature.getGeometry();
  const color = feature.get('custom.user.color');
  const rgb = hexToRgb(color);
  const icon = undefined;
  let styles = new Array<ol.style.Style>();
  if (geometry.getType() === 'LineString') {
    styles = styles.concat(lineStringStyle(feature));
  } else if (feature.get('custom.type') === 'Marker') {
    styles.push(markerStyle(feature));
  } else {
    styles.push(new ol.style.Style({
      fill: new ol.style.Fill({
        color: 'rgba(' + rgb.r + ',' + rgb.g + ',' + rgb.b + ', 0.5)'
      }),
      stroke: new ol.style.Stroke({
        color: color,
        width: 3
      })
    }));
  }
  return styles;
}
