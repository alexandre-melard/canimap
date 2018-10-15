
import { getLength as SphereGetLength } from 'ol/sphere';
import { Geometry } from 'ol/geom';
import { LineString } from 'ol/geom/LineString';
import { Point } from 'ol/geom/Point';
import { Feature } from 'ol/Feature';
import { Style } from 'ol/style/Style';
import { Icon } from 'ol/style/Icon';
import { Fill } from 'ol/style/Fill';
import { Stroke } from 'ol/style/Stroke';
import { Text } from 'ol/style/Text';

import { formatLength, getLength } from '../_utils/map-format-length';
import { CaniDrawLineStringOptions } from '../_models/caniDrawLineString';

export function lineStringStyle(feature: Feature, resolution: number): any[] {
  const styles = new Array<Style>();
  const geometry: LineString = <LineString>feature.getGeometry();

  const configuredStyle = <CaniDrawLineStringOptions>feature.get('style');

  // if (configuredStyle.textOptions.text !== ' ') {
  //   configuredStyle.textOptions.text = formatLength(geometry);
  // }
  // configuredStyle.fill = new Fill(configuredStyle.fillOptions);
  // configuredStyle.stroke = new Stroke(configuredStyle.strokeOptions);
  // configuredStyle.textOptions.fill = new Fill(configuredStyle.textOptions.fillOptions);
  // configuredStyle.textOptions.stroke = new Stroke(configuredStyle.textOptions.strokeOptions);
  // configuredStyle.text = new Text(configuredStyle.textOptions);
  // styles.push(new Style(configuredStyle));

  // if (configuredStyle.imageOptions) {
  //   let frequency = configuredStyle.imageOptions.frequency;
  //   const length = getLength(geometry);
  //   let cursor = 0, segments = 0;
  //   geometry.forEachSegment(function (start, end) {
  //     ++segments;
  //   });
  //   frequency = Math.ceil((frequency * resolution) / (length / segments));
  //   geometry.forEachSegment(function (start, end) {
  //     if ((++cursor % frequency) !== 0) {
  //       return;
  //     }
  //     const dx = end[0] - start[0];
  //     const dy = end[1] - start[1];
  //     configuredStyle.imageOptions.rotation = -Math.atan2(dy, dx);

  //     // arrows
  //     styles.push(new Style({
  //       geometry: new Point([start[0] + dx / 2, start[1] + dy / 2]),
  //       image: new Icon(configuredStyle.imageOptions)
  //     }));
  //   });
  // }
  return styles;
}
