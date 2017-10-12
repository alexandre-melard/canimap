import * as ol from 'openlayers';

/**
 * @typedef {{color: (ol.Color|ol.ColorLike|undefined)}}
 */
export function fillOptions(feature: ol.Feature, key?: string): olx.style.FillOptions {
  const fillOptions: olx.style.FillOptions = {};
  ['color'].forEach((param) => {
    if (feature.get((key ? key : 'custom.fill.') + param)) {
      fillOptions[param] = feature.get((key ? key : 'custom.fill.') + param);
    }
  });
  return fillOptions;
}
