import * as ol from 'openlayers';
import { iconOptions } from './map-style-options-icon';

export function markerStyle(feature: ol.Feature): ol.style.Style {
  const iconStyle = new ol.style.Style({
    image: new ol.style.Icon(/** @type {olx.style.IconOptions} */(iconOptions(feature)))
  });
  return iconStyle;
}
