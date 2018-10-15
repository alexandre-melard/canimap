import { Options as FillOptions } from 'ol/style/Fill';
import { Feature } from 'ol/Feature';

/**
 * @typedef {{color: (ol.Color|ol.ColorLike|undefined)}}
 */
export function fillOptions(feature: Feature, key?: string): FillOptions {
  const fillOptions: FillOptions = {};
  ['color'].forEach((param) => {
    if (feature.get((key ? key : 'custom.fill.') + param)) {
      fillOptions[param] = feature.get((key ? key : 'custom.fill.') + param);
    }
  });
  return fillOptions;
}
