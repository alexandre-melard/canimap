import * as ol from 'openlayers';
import { formatLength } from '../_utils/map-format-length';
import { hexToRgb } from '../_utils/color-hex-to-rgb';
import { colorGetBrightness } from '../_utils/color-brightness';
import { strokeOptions } from './map-style-options-strocke';
import { fillOptions } from './map-style-options-fill';
import { iconOptions } from './map-style-options-icon';
import { textOptions } from './map-style-options-text';

export function lineStringStyle(feature: ol.Feature): ol.style.Style[] {
  const styles = new Array<ol.style.Style>();
  const geometry: ol.geom.LineString = <ol.geom.LineString>feature.getGeometry();


  const textFillOptions = fillOptions(feature, 'custom.text.fill.');
  const textStrokeOptions = strokeOptions(feature, 'custom.text.stroke.');
  const lStrokeOptions = strokeOptions(feature);
  const lIconOptions = iconOptions(feature);
  const lTextOptions = textOptions(feature);

  if (!feature.get('custom.immutable') && feature.get('custom.user.color')) {
    const color = feature.get('custom.user.color');
    lStrokeOptions.color = color;
    textFillOptions.color = color;
    textStrokeOptions.color = color;
    lIconOptions.color = color;
  }

  if (!lTextOptions.text) {
    lTextOptions.text = formatLength(geometry);
  }
  if (!lTextOptions.font) {
    lTextOptions.font = '18px Calibri,sans-serif';
  }
  textStrokeOptions.color = (colorGetBrightness(hexToRgb(<string>textStrokeOptions.color)) < 220) ? 'white' : 'black';

  lTextOptions.fill = new ol.style.Fill(textFillOptions);
  lTextOptions.stroke = new ol.style.Stroke(textStrokeOptions);


  styles.push(new ol.style.Style({
    stroke: new ol.style.Stroke(lStrokeOptions),
    text: new ol.style.Text(lTextOptions)
  }));

  if (lIconOptions['enabled']) {
    const frequency = lIconOptions['frequency'];
    let i = 0, j = 0;
    geometry.forEachSegment(function (start, end) {
      ++j;
    });
    geometry.forEachSegment(function (start, end) {
      if (j > 12 && frequency && ((++i % frequency) === 0)) {
        return;
      }
      const dx = end[0] - start[0];
      const dy = end[1] - start[1];
      lIconOptions.rotation = -Math.atan2(dy, dx);

      // arrows
      styles.push(new ol.style.Style({
        geometry: new ol.geom.Point([start[0] + dx / 2, start[1] + dy / 2]),
        image: new ol.style.Icon(lIconOptions)
      }));
    });
  }
  return styles;
}
