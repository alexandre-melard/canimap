import * as ol from 'openlayers';

/**
 * @typedef {{
 *     anchor: (Array.<number>|undefined),
 *     anchorOrigin: (ol.style.IconOrigin|undefined),
 *     anchorXUnits: (ol.style.IconAnchorUnits|undefined),
 *     anchorYUnits: (ol.style.IconAnchorUnits|undefined),
 *     color: (ol.Color|string|undefined),
 *     crossOrigin: (null|string|undefined),
 *     img: (Image|HTMLCanvasElement|undefined),
 *     offset: (Array.<number>|undefined),
 *     offsetOrigin: (ol.style.IconOrigin|undefined),
 *     opacity: (number|undefined),
 *     scale: (number|undefined),
 *     snapToPixel: (boolean|undefined),
 *     rotateWithView: (boolean|undefined),
 *     rotation: (number|undefined),
 *     size: (ol.Size|undefined),
 *     imgSize: (ol.Size|undefined),
 *     src: (string|undefined)
 * }}
 */
export function iconOptions(feature: ol.Feature, key?: string): ol.olx.style.IconOptions {
  const iconOptions: ol.olx.style.IconOptions = {
    rotateWithView: true
  };
  ['enabled', 'frequency', 'anchor', 'anchorOrigin', 'anchorXUnits', 'anchorYUnits', 'color', 'crossOrigin',
    'img', 'offset', 'offsetOrigin', 'opacity', 'scale', 'snapToPixel', 'rotateWithView',
    'rotation', 'size', 'imgSize', 'src'].forEach((param) => {
      if (feature.get((key ? key : 'custom.icon.') + param)) {
        iconOptions[param] = feature.get((key ? key : 'custom.icon.') + param);
      }
    });
  return iconOptions;
}
