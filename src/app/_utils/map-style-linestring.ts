import * as ol from 'openlayers';
import { formatLength } from '../_utils/map-format-length';
import { CaniDrawLineStringOptions } from '../_models/caniDrawLineString';

export function lineStringStyle(feature: ol.Feature): ol.style.Style[] {
  const styles = new Array<ol.style.Style>();
  const geometry: ol.geom.LineString = <ol.geom.LineString>feature.getGeometry();

  const configuredStyle = <CaniDrawLineStringOptions>feature.get('style');

  configuredStyle.textOptions.text = formatLength(geometry);
  configuredStyle.fill = new ol.style.Fill(configuredStyle.fillOptions);
  configuredStyle.stroke = new ol.style.Stroke(configuredStyle.strockeOptions);
  configuredStyle.textOptions.fill = new ol.style.Fill(configuredStyle.textOptions.fillOptions);
  configuredStyle.textOptions.stroke = new ol.style.Stroke(configuredStyle.strockeOptions);
  configuredStyle.text = new ol.style.Text(configuredStyle.textOptions);
  styles.push(new ol.style.Style(configuredStyle));

  if (configuredStyle.imageOptions) {
    const frequency = configuredStyle.imageOptions.frequency;
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
      configuredStyle.imageOptions.rotation = -Math.atan2(dy, dx);

      // arrows
      styles.push(new ol.style.Style({
        geometry: new ol.geom.Point([start[0] + dx / 2, start[1] + dy / 2]),
        image: new ol.style.Icon(configuredStyle.imageOptions)
      }));
    });
  }
  return styles;
}
