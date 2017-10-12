import * as ol from 'openlayers';
import { formatLength } from '../_utils/map-format-length';
import { hexToRgb } from '../_utils/color-hex-to-rgb';
import { colorGetBrightness } from '../_utils/color-brightness';

export function lineStringStyle(feature: ol.Feature): ol.style.Style[] {
  const styles = new Array<ol.style.Style>();
  const geometry: ol.geom.LineString = <ol.geom.LineString>feature.getGeometry();

  /**
   * @typedef {{
   *     color: (ol.Color|string|undefined),
   *     lineCap: (string|undefined),
   *     lineJoin: (string|undefined),
   *     lineDash: (Array.<number>|undefined),
   *     miterLimit: (number|undefined),
   *     width: (number|undefined)
   * }}
   */
  const strokeOptions: olx.style.StrokeOptions = {};
  ['color', 'lineCap', 'lineJoin', 'lineDash', 'miterLimit', 'width'].forEach((param) => {
    if (feature.get('custom.stroke.' + param)) {
      strokeOptions[param] = feature.get('custom.stroke.' + param);
    }
  });

  /**
   * @typedef {{font: (string|undefined),
   *     offsetX: (number|undefined),
   *     offsetY: (number|undefined),
   *     scale: (number|undefined),
   *     rotateWithView: (boolean|undefined),
   *     rotation: (number|undefined),
   *     text: (string|undefined),
   *     textAlign: (string|undefined),
   *     textBaseline: (string|undefined),
   *     fill: (ol.style.Fill|undefined),
   *     stroke: (ol.style.Stroke|undefined)}}
   */
  const textOptions: olx.style.TextOptions = {};
  ['font', 'offsetX', 'offsetY', 'scale', 'rotateWithView', 'rotation', 'text', 'textAlign', 'textBaseline'].forEach((param) => {
    if (feature.get('custom.text.' + param)) {
      textOptions[param] = feature.get('custom.text.' + param);
    }
  });

  /**
   * @typedef {{color: (ol.Color|ol.ColorLike|undefined)}}
   */
  const textFillOptions: olx.style.FillOptions = {};
  ['color'].forEach((param) => {
    if (feature.get('custom.text.fill.' + param)) {
      textFillOptions[param] = feature.get('custom.text.fill.' + param);
    }
  });
  const textStrokeOptions: olx.style.StrokeOptions = {};
  ['color', 'lineCap', 'lineJoin', 'lineDash', 'miterLimit', 'width'].forEach((param) => {
    if (feature.get('custom.text.stroke.' + param)) {
      textStrokeOptions[param] = feature.get('custom.text.stroke.' + param);
    }
  });

  const iconsOptions: olx.style.IconOptions = {
    rotateWithView: false
  };
  ['enabled', 'frequency', 'anchor', 'anchorOrigin', 'anchorXUnits', 'anchorYUnits', 'color', 'crossOrigin',
    'img', 'offset', 'offsetOrigin', 'opacity', 'scale', 'snapToPixel', 'rotateWithView',
    'rotation', 'size', 'imgSize', 'src'].forEach((param) => {
      if (feature.get('custom.arrow.' + param)) {
        iconsOptions[param] = feature.get('custom.arrow.' + param);
      }
    });

  if (!feature.get('custom.immutable') && feature.get('custom.user.color')) {
    const color = feature.get('custom.user.color');
    strokeOptions.color = color;
    textFillOptions.color = color;
    textStrokeOptions.color = color;
    iconsOptions.color = color;
  }

  if (!textOptions.text) {
    textOptions.text = formatLength(geometry);
  }
  if (!textOptions.font) {
    textOptions.font = '18px Calibri,sans-serif';
  }
  textStrokeOptions.color = (colorGetBrightness(hexToRgb(<string>textStrokeOptions.color)) < 220) ? 'white' : 'black';

  textOptions.fill = new ol.style.Fill(textFillOptions);
  textOptions.stroke = new ol.style.Stroke(textStrokeOptions);


  styles.push(new ol.style.Style({
    stroke: new ol.style.Stroke(strokeOptions),
    text: new ol.style.Text(textOptions)
  }));

  if (iconsOptions['enabled']) {
    const frequency = iconsOptions['frequency'];
    let i = 0;
    geometry.forEachSegment(function (start, end) {
      if (frequency && ((++i % frequency) !== 0)) {
        return;
      }
      const dx = end[0] - start[0];
      const dy = end[1] - start[1];
      iconsOptions.rotation = -Math.atan2(dy, dx);

      // arrows
      styles.push(new ol.style.Style({
        geometry: new ol.geom.Point([start[0] + dx / 2, start[1] + dy / 2]),
        image: new ol.style.Icon(iconsOptions)
      }));
    });
  }
  return styles;
}
