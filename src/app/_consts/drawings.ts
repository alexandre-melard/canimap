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
        new CaniStyle('anchor', [50, 50]),
        new CaniStyle('anchorXUnits', 'pixels'),
        new CaniStyle('anchorYUnits', 'pixels'),
        new CaniStyle('scale', 0.15),
        new CaniStyle('src', '../assets/icons/parking.svg')
      ]
    ),
    new CaniDraw('draw-PoseMarker', 'PoseMarker', 'marker', 'Point',
      [
        new CaniStyle('type', 'Marker'),
        new CaniStyle('src', '../assets/icons/dot_green.png')
      ]
    ),
    new CaniDraw('draw-SuspenduMarker', 'SuspenduMarker', 'marker', 'Point',
      [
        new CaniStyle('type', 'Marker'),
        new CaniStyle('src', '../assets/icons/dot_blue.png')
      ]
    ),
    new CaniDraw('draw-CacheMarker', 'CacheMarker', 'marker', 'Point',
      [
        new CaniStyle('type', 'Marker'),
        new CaniStyle('src', '../assets/icons/dot_purple.png')
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
        new CaniStyle('text.stroke.width', 2),
        new CaniStyle('arrow.enabled', true),
        new CaniStyle('arrow.color', '#00F'),
        new CaniStyle('arrow.crossOrigin', 'anonymous'),
        new CaniStyle('arrow.src', '../assets/icons/arrow_20.png'),
        new CaniStyle('arrow.anchor', [0.75, 0.5]),
        new CaniStyle('arrow.rotateWithView', true)
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
        new CaniStyle('text.stroke.width', 2),
        new CaniStyle('arrow.enabled', true),
        new CaniStyle('arrow.color', '#F93'),
        new CaniStyle('arrow.crossOrigin', 'anonymous'),
        new CaniStyle('arrow.src', '../assets/icons/arrow_20.png'),
        new CaniStyle('arrow.anchor', [0.75, 0.5]),
        new CaniStyle('arrow.rotateWithView', true)
      ]
    ),
    new CaniDraw('draw-LineStringGps', 'LineStringGps', 'polyline', 'LineString',
      [
        new CaniStyle('type', 'LineString'),
        new CaniStyle('immutable', false),
        new CaniStyle('stroke.width', 3),
        new CaniStyle('text.offsetY', -20),
        new CaniStyle('text.stroke.width', 2),
        new CaniStyle('arrow.enabled', true),
        new CaniStyle('arrow.crossOrigin', 'anonymous'),
        new CaniStyle('arrow.src', '../assets/icons/arrow_16.png'),
        new CaniStyle('arrow.anchor', [0.75, 0.5]),
        new CaniStyle('arrow.rotateWithView', true),
        new CaniStyle('arrow.frequency', 4)
      ]
    ),
    new CaniDraw('draw-LineStringArrow', 'LineStringArrow', 'polyline', 'LineString',
    [
      new CaniStyle('type', 'LineString'),
      new CaniStyle('immutable', false),
      new CaniStyle('stroke.width', 3),
      new CaniStyle('text.offsetY', -20),
      new CaniStyle('text.stroke.width', 2),
      new CaniStyle('arrow.enabled', true),
      new CaniStyle('arrow.crossOrigin', 'anonymous'),
      new CaniStyle('arrow.src', '../assets/icons/arrow_20.png'),
      new CaniStyle('arrow.anchor', [0.75, 0.5]),
      new CaniStyle('arrow.rotateWithView', true)
    ]
  ),
  new CaniDraw('draw-LineString', 'LineString', 'polyline', 'LineString',
    [
      new CaniStyle('type', 'LineString'),
      new CaniStyle('immutable', false),
      new CaniStyle('stroke.width', 3),
      new CaniStyle('text.offsetY', -20),
      new CaniStyle('text.stroke.width', 2),
      new CaniStyle('arrow.enabled', false),
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
