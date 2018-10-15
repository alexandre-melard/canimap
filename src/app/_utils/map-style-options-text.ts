import { Feature } from 'ol/Feature';
import { Options as TextOptions } from 'ol/style/Text';


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
export function textOptions(feature: Feature, key?: string): TextOptions {
  const textOptions: TextOptions = {};
  ['font', 'offsetX', 'offsetY', 'scale', 'rotateWithView', 'rotation', 'text', 'textAlign', 'textBaseline'].forEach((param) => {
    if (feature.get((key ? key : 'custom.text.') + param)) {
      textOptions[param] = feature.get((key ? key : 'custom.text.') + param);
    }
  });
  return textOptions;
}
