import * as ol from 'openlayers';

/**
 * @typedef {{color: (ol.Color|ol.ColorLike|undefined)}}
 */
export function fillOptions(feature: ol.Feature, key?: string): ol.olx.style.FillOptions {
  const opts: ol.olx.style.FillOptions = {};
  ['color'].forEach((param) => {
    if (feature.get((key ? key : 'custom.fill.') + param)) {
      opts[param] = feature.get((key ? key : 'custom.fill.') + param);
    }
  });
  return opts;
}
