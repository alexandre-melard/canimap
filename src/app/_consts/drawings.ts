import { CaniDraw } from '../_models/caniDraw';
import { CaniStyle } from '../_models/caniStyle';
import { hexToRgb } from '../_utils/color-hex-to-rgb';

export class Drawings {
  public static drawInteractions: CaniDraw[] = [
    new CaniDraw('draw-Point', 'Point', '', 'Point',
      [
        new CaniStyle('type', 'Point')
      ]
    ),
    new CaniDraw('draw-ParkingMarker', 'ParkingMarker', 'marker', 'Point',
      [
        new CaniStyle('type', 'Marker'),
        new CaniStyle('icon.anchor', [50, 50]),
        new CaniStyle('icon.anchorXUnits', 'pixels'),
        new CaniStyle('icon.anchorYUnits', 'pixels'),
        new CaniStyle('icon.scale', 0.15),
        new CaniStyle('icon.src', '../assets/icons/parking.svg')
      ]
    ),
    new CaniDraw('draw-PoseMarker', 'PoseMarker', 'marker', 'Point',
      [
        new CaniStyle('type', 'Marker'),
        new CaniStyle('icon.src', '../assets/icons/dot_green.png')
      ]
    ),
    new CaniDraw('draw-SuspenduMarker', 'SuspenduMarker', 'marker', 'Point',
      [
        new CaniStyle('type', 'Marker'),
        new CaniStyle('icon.src', '../assets/icons/dot_blue.png')
      ]
    ),
    new CaniDraw('draw-CacheMarker', 'CacheMarker', 'marker', 'Point',
      [
        new CaniStyle('type', 'Marker'),
        new CaniStyle('icon.src', '../assets/icons/dot_purple.png')
      ]
    ),
    new CaniDraw('draw-VictimPath', 'VictimPath', 'polyline', 'LineString',
      [
        new CaniStyle('type', 'LineString'),
        new CaniStyle('immutable', true),
        new CaniStyle('stroke.color', '#00F'),
        new CaniStyle('stroke.width', 3),
        new CaniStyle('text.offsetY', -20),
        new CaniStyle('text.fill.color', '#00F'),
        new CaniStyle('text.stroke.color', '#00F'),
        new CaniStyle('text.stroke.width', 3),
        new CaniStyle('icon.enabled', true),
        new CaniStyle('icon.color', '#00F'),
        new CaniStyle('icon.crossOrigin', 'anonymous'),
        new CaniStyle('icon.src', '../assets/icons/arrow_20.png'),
        new CaniStyle('icon.anchor', [0.75, 0.5]),
        new CaniStyle('icon.rotateWithView', true)
      ]
    ),
    new CaniDraw('draw-K9Path', 'K9Path', 'polyline', 'LineString',
      [
        new CaniStyle('type', 'LineString'),
        new CaniStyle('immutable', true),
        new CaniStyle('stroke.color', '#F93'),
        new CaniStyle('stroke.width', 3),
        new CaniStyle('text.text', ' '),
        new CaniStyle('text.offsetY', -20),
        new CaniStyle('text.fill.color', '#F93'),
        new CaniStyle('text.stroke.color', '#F93'),
        new CaniStyle('text.stroke.width', 3),
        new CaniStyle('icon.enabled', true),
        new CaniStyle('icon.color', '#F93'),
        new CaniStyle('icon.crossOrigin', 'anonymous'),
        new CaniStyle('icon.src', '../assets/icons/arrow_20.png'),
        new CaniStyle('icon.anchor', [0.75, 0.5]),
        new CaniStyle('icon.rotateWithView', true)
      ]
    ),
    new CaniDraw('draw-LineStringGps', 'LineStringGps', 'polyline', 'LineString',
      [
        new CaniStyle('type', 'LineString'),
        new CaniStyle('immutable', false),
        new CaniStyle('stroke.width', 3),
        new CaniStyle('text.offsetY', -20),
        new CaniStyle('text.stroke.width', 3),
        new CaniStyle('icon.enabled', true),
        new CaniStyle('icon.crossOrigin', 'anonymous'),
        new CaniStyle('icon.src', '../assets/icons/arrow_16.png'),
        new CaniStyle('icon.anchor', [0.75, 0.5]),
        new CaniStyle('icon.rotateWithView', true),
        new CaniStyle('icon.frequency', 5)
      ]
    ),
    new CaniDraw('draw-LineStringArrow', 'LineStringArrow', 'polyline', 'LineString',
    [
      new CaniStyle('type', 'LineString'),
      new CaniStyle('immutable', false),
      new CaniStyle('stroke.width', 3),
      new CaniStyle('text.offsetY', -20),
      new CaniStyle('text.stroke.width', 3),
      new CaniStyle('icon.enabled', true),
      new CaniStyle('icon.crossOrigin', 'anonymous'),
      new CaniStyle('icon.src', '../assets/icons/arrow_20.png'),
      new CaniStyle('icon.anchor', [0.75, 0.5]),
      new CaniStyle('icon.rotateWithView', true)
    ]
  ),
  new CaniDraw('draw-LineString', 'LineString', 'polyline', 'LineString',
    [
      new CaniStyle('type', 'LineString'),
      new CaniStyle('immutable', false),
      new CaniStyle('stroke.width', 3),
      new CaniStyle('text.offsetY', -20),
      new CaniStyle('text.stroke.width', 3),
      new CaniStyle('icon.enabled', false),
    ]
  ),
  new CaniDraw('draw-Polygon', 'Polygon', 'polygon', 'Polygon',
      [
        new CaniStyle('type', 'Polygon')
      ]
    ),
    new CaniDraw('draw-Rectangle', 'Rectangle', 'rectangle', 'Circle',
      [
        new CaniStyle('type', 'Rectangle')
      ]
    ),
    new CaniDraw('draw-Circle', 'Circle', 'circle', 'Circle',
      [
        new CaniStyle('type', 'Circle')
      ]
    )
  ];
}
export const drawInteractions = Drawings.drawInteractions;
