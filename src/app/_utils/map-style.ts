import * as ol from 'openlayers';
import { formatLength } from '../_utils/map-format-length';
import { hexToRgb } from '../_utils/color-hex-to-rgb';
import { colorGetBrightness } from '../_utils/color-brightness';

export function styleFunction(feature: ol.Feature) {
    const geometry: ol.geom.LineString = <ol.geom.LineString>feature.getGeometry();
    const color = feature.get('stroke.color');
    const rgb = hexToRgb(color);
    const icon = undefined;
    const styles = new Array<ol.style.Style>();
    if (geometry.getType() === 'LineString') {
      styles.push(new ol.style.Style({
        stroke: new ol.style.Stroke({
          color: color,
          width: 3
        }),
        text: new ol.style.Text({
          text: formatLength(geometry),
          font: '18px Calibri,sans-serif',
          fill: new ol.style.Fill({
            color: color
          }),
          stroke: new ol.style.Stroke({
            color: (colorGetBrightness(rgb) < 220) ? 'white' : 'black',
            width: 3
          })
        })
      })
      );
      geometry.forEachSegment(function (start, end) {
        const dx = end[0] - start[0];
        const dy = end[1] - start[1];
        const rotation = Math.atan2(dy, dx);

        // arrows
        styles.push(new ol.style.Style({
          geometry: new ol.geom.Point([start[0] + dx / 2, start[1] + dy / 2]),
          image: new ol.style.Icon({
            color: color,
            crossOrigin: 'anonymous',
            src: '../assets/' + ((icon === undefined) ? 'arrow_20.png' : icon),
            anchor: [0.75, 0.5],
            rotateWithView: true,
            rotation: -rotation
          })
        }));
      });
    } else if (feature.get('custom.type') === 'ParkingMarker') {
      const iconStyle = new ol.style.Style({
        image: new ol.style.Icon(/** @type {olx.style.IconOptions} */({
          anchor: [0.5, 46],
          anchorXUnits: 'fraction',
          anchorYUnits: 'pixels',
          src: '../assets/marker-icon.png'
        })),
        text: new ol.style.Text({
          text: 'local_parking',
          offsetX: 2,
          offsetY: -25,
          font: 'normal 18px Material Icons',
          textBaseline: 'Bottom',
          fill: new ol.style.Fill({
            color: 'black',
          })
        })
      });
      styles.push(iconStyle);
    } else if (feature.get('custom.type') === 'PoseMarker') {
      const iconStyle = new ol.style.Style({
        image: new ol.style.Icon({
          crossOrigin: 'anonymous',
          src: '../assets/dot_green.png'
        })
      });
      styles.push(iconStyle);
    } else if (feature.get('custom.type') === 'SuspenduMarker') {
      const iconStyle = new ol.style.Style({
        image: new ol.style.Icon({
          crossOrigin: 'anonymous',
          src: '../assets/dot_blue.png'
        })
      });
      styles.push(iconStyle);
    } else if (feature.get('custom.type') === 'CacheMarker') {
      const iconStyle = new ol.style.Style({
        image: new ol.style.Icon({
          crossOrigin: 'anonymous',
          src: '../assets/dot_purple.png'
        })
      });
      styles.push(iconStyle);
    } else {
      styles.push(new ol.style.Style({
        fill: new ol.style.Fill({
          color: 'rgba(' + rgb.r + ',' + rgb.g + ',' + rgb.b + ', 0.5)'
        }),
        stroke: new ol.style.Stroke({
          color: color,
          width: 3
        })
      }));
    }
    return styles;
  }
