import * as ol from 'openlayers';

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
export function strokeOptions(feature: ol.Feature, key?: string): olx.style.StrokeOptions {
  const strokeOptions: olx.style.StrokeOptions = {};
  ['color', 'lineCap', 'lineJoin', 'lineDash', 'miterLimit', 'width'].forEach((param) => {
    if (feature.get((key ? key : 'custom.stroke.') + param)) {
      strokeOptions[param] = feature.get((key ? key : 'custom.stroke.') + param);
    }
  });
  return strokeOptions;
}
