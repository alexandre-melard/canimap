import { CaniDraw } from '../_models/caniDraw';
import { CaniStyle } from '../_models/caniStyle';

export class Drawings {
    public static drawInteractions: CaniDraw[] = [
        new CaniDraw( 'draw-Point', 'Point', '', 'Point'),
        new CaniDraw( 'draw-ParkingMarker', 'ParkingMarker', 'marker', 'Point'),
        new CaniDraw( 'draw-PoseMarker', 'PoseMarker', 'marker', 'Point'),
        new CaniDraw( 'draw-SuspenduMarker', 'SuspenduMarker', 'marker', 'Point'),
        new CaniDraw( 'draw-CacheMarker', 'CacheMarker', 'marker', 'Point'),
        new CaniDraw( 'draw-VictimPath', 'VictimPath', 'polyline', 'LineString', null, [ new CaniStyle('color', '#00F') ]),
        new CaniDraw( 'draw-K9Path', 'K9Path', 'polyline', 'LineString', null, [ new CaniStyle('color', '#F93') ]),
        new CaniDraw( 'draw-LineString', 'LineString', 'polyline', 'LineString'),
        new CaniDraw( 'draw-Polygon', 'Polygon', 'polygon', 'Polygon'),
        new CaniDraw( 'draw-Rectangle', 'Rectangle', 'rectangle', 'Circle'),
        new CaniDraw( 'draw-Circle', 'Circle', 'circle', 'Circle')
    ];
}
export const drawInteractions = Drawings.drawInteractions;
