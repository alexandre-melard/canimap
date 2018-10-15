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
import * as ol from 'ol';

function getTextColor(color: string) {
  return (colorGetBrightness(hexToRgb(color)) > 125) ? 'black' : 'white';
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
          src: '../assets/icons/dot_green.png',
        };
      },
      { specificity: 'Posé' }
    ),
    new CaniDrawPoint('SuspenduMarker', 'marker',
      () => {
        return {
          type: 'Marker',
          src: '../assets/icons/dot_blue.png'
        };
      },
      { specificity: 'Suspendu' }
    ),
    new CaniDrawPoint('CacheMarker', 'marker',
      () => {
        return {
          type: 'Marker',
          src: '../assets/icons/dot_purple.png'
        };
      },
      { specificity: 'Caché' }
    ),
    new CaniDrawLineString('VictimPath', 'polyline',
      () => {
        return {
          strokeOptions: {
            color: '#00F',
            width: 3
          },
          textOptions: {
            offsetY: -20,
            font: '18px Calibri,sans-serif',
            fillOptions: {
              color: '#00F'
            },
            strokeOptions: {
              color: getTextColor('#00F'),
              width: 3
            }
          },
          imageOptions: {
            color: '#00F',
            crossOrigin: 'anonymous',
            src: '../assets/icons/arrow_20.png',
            anchor: [0.75, 0.5],
            rotateWithView: true,
            frequency: 25
          }
        };
      }
    ),
    new CaniDrawLineString('K9Path', 'polyline',
      () => {
        return {
          strokeOptions: {
            color: '#F93',
            width: 3
          },
          textOptions: {
            text: ' ',
            offsetY: -20,
            font: '18px Calibri,sans-serif',
            fillOptions: {
              color: '#F93'
            },
            strokeOptions: {
              color: getTextColor('#F93'),
              width: 3
            }
          },
          imageOptions: {
            color: '#F93',
            crossOrigin: 'anonymous',
            src: '../assets/icons/arrow_20.png',
            anchor: [0.75, 0.5],
            rotateWithView: true,
            frequency: 25
          }
        };
      }
    ),
    new CaniDrawLineString('LineStringGps', 'polyline',
      (color) => {
        return {
          strokeOptions: {
            color: color,
            width: 3
          },
          textOptions: {
            offsetY: -20,
            font: '18px Calibri,sans-serif',
            fillOptions: {
              color: color
            },
            strokeOptions: {
              color: getTextColor(color),
              width: 3
            }
          },
          imageOptions: {
            color: color,
            crossOrigin: 'anonymous',
            src: '../assets/icons/arrow_20.png',
            anchor: [0.75, 0.5],
            rotateWithView: true,
            frequency: 25
          }
        };
      }
    ),
    new CaniDrawLineString('LineStringArrow', 'polyline',
      (color) => {
        return {
          strokeOptions: {
            color: color,
            width: 3
          },
          textOptions: {
            text: ' ',
            offsetY: -20,
            font: '18px Calibri,sans-serif',
            fillOptions: {
              color: color
            },
            strokeOptions: {
              color: getTextColor(color),
              width: 3
            }
          },
          imageOptions: {
            color: color,
            crossOrigin: 'anonymous',
            src: '../assets/icons/arrow_20.png',
            anchor: [0.75, 0.5],
            rotateWithView: true,
            frequency: 25
          }
        };
      }
    ),
    new CaniDrawLineString('LineString', 'polyline',
      (color) => {
        return {
          strokeOptions: {
            color: color,
            width: 3
          },
          textOptions: {
            offsetY: -20,
            font: '18px Calibri,sans-serif',
            fillOptions: {
              color: color
            },
            strokeOptions: {
              color: getTextColor(color),
              width: 3
            }
          }
        };
      }
    ),
    new CaniDrawPolygon('Polygon', 'polygon',
      (color) => {
        const rgb = hexToRgb(color);
        return {
          fillOptions: {
            color: 'rgba(' + rgb.r + ',' + rgb.g + ',' + rgb.b + ', 0.5)'
          },
          strokeOptions: {
            color: color,
            width: 3
          }
        };
      }
    ),
    new CaniDrawRectangle('Rectangle', 'rectangle',
      (color) => {
        const rgb = hexToRgb(color);
        return {
          type: 'Rectangle',
          radius: 10,
          fillOptions: {
            color: 'rgba(' + rgb.r + ',' + rgb.g + ',' + rgb.b + ', 0.5)'
          },
          strokeOptions: {
            color: color,
            width: 3
          }
        };
      }
    ),
    new CaniDrawCircle('Circle', 'circle',
      (color) => {
        const rgb = hexToRgb(color);
        return {
          type: 'Circle',
          radius: 10,
          fillOptions: {
            color: 'rgba(' + rgb.r + ',' + rgb.g + ',' + rgb.b + ', 0.5)'
          },
          strokeOptions: {
            color: color,
            width: 3
          }
        };
      }
    )
  ];
}
export const drawInteractions = Drawings.drawInteractions;
