import { Feature } from 'ol/Feature';
import { Options as StrokeOptions } from 'ol/style/Stroke';

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
export function strokeOptions(feature: Feature, key?: string): StrokeOptions {
  const strokeOptions: StrokeOptions = {};
  ['color', 'lineCap', 'lineJoin', 'lineDash', 'miterLimit', 'width'].forEach((param) => {
    if (feature.get((key ? key : 'custom.stroke.') + param)) {
      strokeOptions[param] = feature.get((key ? key : 'custom.stroke.') + param);
    }
  });
  return strokeOptions;
}
