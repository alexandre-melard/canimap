import { CaniDraw } from '../_models/caniDraw';
import { CaniStyle } from '../_models/caniStyle';
import { hexToRgb } from '../_utils/color-hex-to-rgb';
import { colorGetBrightness } from '../_utils/color-brightness';
import { CaniDrawPoint } from '../_models/caniDrawPoint';
import { CaniDrawLineString } from '../_models/caniDrawLineString';
import { CaniDrawPolygon } from '../_models/caniDrawPolygon';
import { CaniDrawCircle } from '../_models/caniDrawCircle';
import { CaniDrawRectangle } from '../_models/caniDrawRectangle';
import { CaniDrawIcon } from '../_models/caniDrawIcon';
import * as ol from 'openlayers';

function getTextColor(color: string) {
  return (colorGetBrightness(hexToRgb(color)) < 220) ? 'white' : 'black';
}

export class Drawings {
  public static drawInteractions: CaniDraw[] = [
    new CaniDrawPoint('Point', ''),
    new CaniDrawPoint('ParkingMarker', 'marker',
      () => {
        return {
          type: 'Marker',
          anchor: [50, 50],
          anchorXUnits: 'pixels',
          anchorYUnits: 'pixels',
          scale: 0.15,
          src: '../assets/icons/parking.svg'
        };
      }
    ),
    new CaniDrawPoint('PoseMarker', 'marker',
      () => {
        return {
          type: 'Marker',
          src: '../assets/icons/dot_green.png'
        };
      }
    ),
    new CaniDrawPoint('SuspenduMarker', 'marker',
      () => {
        return {
          type: 'Marker',
          src: '../assets/icons/dot_blue.png'
        };
      }
    ),
    new CaniDrawPoint('CacheMarker', 'marker',
      () => {
        return {
          type: 'Marker',
          src: '../assets/icons/dot_purple.png'
        };
      }
    ),
    new CaniDrawLineString('VictimPath', 'polyline',
      () => {
        return {
          type: 'LineString',
          stroke: new ol.style.Stroke({
            color: '#00F',
            width: 3
          }),
          textOptions: {
            offsetY: -20,
            fillOptions: {
              color: '#00F'
            },
            strockeOptions: {
              color: getTextColor('#00F'),
              width: 3
            }
          },
          imageOptions: {
            color: '#00F',
            crossOrigin: 'anonymous',
            src: '../assets/icons/arrow_20.png',
            anchor: [0.75, 0.5],
            rotateWithView: true
          }
        };
      }
    ),
    new CaniDrawLineString('K9Path', 'polyline',
      () => {
        return {
          type: 'LineString',
          stroke: new ol.style.Stroke({
            color: '#F93',
            width: 3
          }),
          text: new ol.style.Text({
            offsetY: -20,
            font: '18px Calibri,sans-serif',
            fill: new ol.style.Fill({
              color: '#F93'
            }),
            stroke: new ol.style.Stroke({
              color: getTextColor('#F93'),
              width: 3
            })
          }),
          imageOptions: {
            color: '#F93',
            crossOrigin: 'anonymous',
            src: '../assets/icons/arrow_20.png',
            anchor: [0.75, 0.5],
            rotateWithView: true
          }
        };
      }
    ),
    new CaniDrawLineString('LineStringGps', 'polyline',
      (color) => {
        return {
          type: 'LineString',
          stroke: new ol.style.Stroke({
            color: color,
            width: 3
          }),
          text: new ol.style.Text({
            offsetY: -20,
            font: '18px Calibri,sans-serif',
            fill: new ol.style.Fill({
              color: color,
            }),
            stroke: new ol.style.Stroke({
              color: getTextColor(color),
              width: 3
            })
          }),
          imageOptions: {
            color: color,
            crossOrigin: 'anonymous',
            src: '../assets/icons/arrow_20.png',
            anchor: [0.75, 0.5],
            rotateWithView: true,
            frequency: 5
          }
        };
      }
    ),
    new CaniDrawLineString('LineStringArrow', 'polyline',
      (color) => {
        return {
          type: 'LineString',
          stroke: new ol.style.Stroke({
            color: color,
            width: 3
          }),
          text: new ol.style.Text({
            offsetY: -20,
            font: '18px Calibri,sans-serif',
            fill: new ol.style.Fill({
              color: color,
            }),
            stroke: new ol.style.Stroke({
              color: getTextColor(color),
              width: 3
            })
          }),
          imageOptions: {
            color: color,
            crossOrigin: 'anonymous',
            src: '../assets/icons/arrow_20.png',
            anchor: [0.75, 0.5],
            rotateWithView: true
          }
        };
      }
    ),
    new CaniDrawLineString('LineString', 'polyline',
      (color) => {
        return {
          type: 'LineString',
          stroke: new ol.style.Stroke({
            color: color,
            width: 3
          }),
          text: new ol.style.Text({
            offsetY: -20,
            font: '18px Calibri,sans-serif',
            fill: new ol.style.Fill({
              color: color,
            }),
            stroke: new ol.style.Stroke({
              color: getTextColor(color),
              width: 3
            })
          })
        };
      }
    ),
    new CaniDrawPolygon('Polygon', 'polygon',
      (color) => {
        const rgb = hexToRgb(color);
        return {
          fill: new ol.style.Fill({
            color: 'rgba(' + rgb.r + ',' + rgb.g + ',' + rgb.b + ', 0.5)'
          }),
          stroke: new ol.style.Stroke({
            color: color,
            width: 3
          })
        };
      }
    ),
    new CaniDrawRectangle('Rectangle', 'polygon',
      (color) => {
        const rgb = hexToRgb(color);
        return {
          type: 'Rectangle',
          radius: 10,
          fill: new ol.style.Fill({
            color: 'rgba(' + rgb.r + ',' + rgb.g + ',' + rgb.b + ', 0.5)'
          }),
          stroke: new ol.style.Stroke({
            color: color,
            width: 3
          })
        };
      }
    ),
    new CaniDrawCircle('Circle', 'circle',
      (color) => {
        const rgb = hexToRgb(color);
        return {
          type: 'Circle',
          radius: 10,
          fill: new ol.style.Fill({
            color: 'rgba(' + rgb.r + ',' + rgb.g + ',' + rgb.b + ', 0.5)'
          }),
          stroke: new ol.style.Stroke({
            color: color,
            width: 3
          })
        };
      }
    )
  ];
}
export const drawInteractions = Drawings.drawInteractions;
