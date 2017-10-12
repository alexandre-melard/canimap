import * as ol from 'openlayers';

export function markerStyle(feature: ol.Feature): ol.style.Style {
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
  const iconsOptions: olx.style.IconOptions = {
    src: feature.get('custom.src'),
    rotateWithView: true
  };
  ['anchor', 'anchorOrigin', 'anchorXUnits', 'anchorYUnits', 'color', 'crossOrigin',
    'img', 'offset', 'offsetOrigin', 'opacity', 'scale', 'snapToPixel', 'rotateWithView',
    'rotation', 'size', 'imgSize', 'src'].forEach((param) => {
      if (feature.get('custom.' + param)) {
        iconsOptions[param] = feature.get('custom.' + param);
      }
    });
  const iconStyle = new ol.style.Style({
    image: new ol.style.Icon(/** @type {olx.style.IconOptions} */(iconsOptions))
  });
  return iconStyle;
}
