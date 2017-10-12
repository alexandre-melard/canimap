import * as ol from 'openlayers';

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
export function textOptions(feature: ol.Feature, key?: string): olx.style.TextOptions {
  const textOptions: olx.style.TextOptions = {};
  ['font', 'offsetX', 'offsetY', 'scale', 'rotateWithView', 'rotation', 'text', 'textAlign', 'textBaseline'].forEach((param) => {
    if (feature.get((key ? key : 'custom.text.') + param)) {
      textOptions[param] = feature.get((key ? key : 'custom.text.') + param);
    }
  });
  return textOptions;
}
