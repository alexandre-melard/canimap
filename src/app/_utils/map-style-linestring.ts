import * as ol from 'openlayers';
import * as olx from 'openlayers/externs/olx';
import { formatLength, getLength } from '../_utils/map-format-length';
import { CaniDrawLineStringOptions } from '../_models/caniDrawLineString';

export function lineStringStyle(feature: ol.Feature, resolution: number): olx.style.Style[] {
  const styles = new Array<ol.style.Style>();
  const geometry: ol.geom.LineString = <ol.geom.LineString>feature.getGeometry();

  const configuredStyle = <CaniDrawLineStringOptions>feature.get('style');

  if (configuredStyle.textOptions.text !== ' ') {
    configuredStyle.textOptions.text = formatLength(geometry);
  }
  configuredStyle.fill = new ol.style.Fill(configuredStyle.fillOptions);
  configuredStyle.stroke = new ol.style.Stroke(configuredStyle.strokeOptions);
  configuredStyle.textOptions.fill = new ol.style.Fill(configuredStyle.textOptions.fillOptions);
  configuredStyle.textOptions.stroke = new ol.style.Stroke(configuredStyle.textOptions.strokeOptions);
  configuredStyle.text = new ol.style.Text(configuredStyle.textOptions);
  styles.push(new ol.style.Style(configuredStyle));

  if (configuredStyle.imageOptions) {
    let frequency = configuredStyle.imageOptions.frequency;
    const length = getLength(geometry);
    let cursor = 0, segments = 0;
    geometry.forEachSegment(function (start, end) {
      ++segments;
    });
    frequency = Math.ceil((frequency * resolution) / (length / segments));
    geometry.forEachSegment(function (start, end) {
      if ((++cursor % frequency) !== 0) {
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
