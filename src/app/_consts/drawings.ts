import {CaniDraw} from '../_models/caniDraw';
import {hexToRgb} from '../_utils/color-hex-to-rgb';
import {colorGetBrightness} from '../_utils/color-brightness';
import {CaniDrawPoint} from '../_models/caniDrawPoint';
import {CaniDrawLineString} from '../_models/caniDrawLineString';
import {CaniDrawPolygon} from '../_models/caniDrawPolygon';
import {CaniDrawCircle} from '../_models/caniDrawCircle';
import {CaniDrawRectangle} from '../_models/caniDrawRectangle';
import {randomColor} from 'randomcolor';
import Style from 'ol/style/Style';
import Fill from 'ol/style/Fill';
import Stroke from 'ol/style/Stroke';
import Icon from 'ol/style/Icon';
import Text from 'ol/style/Text';
import Feature from 'ol/Feature';
import LineString from 'ol/geom/LineString';
import {formatLength} from '../_utils/map-format-length';
import {getLength} from 'ol/sphere';
import Point from 'ol/geom/Point';

function getTextColor(color: string) {
    return (colorGetBrightness(hexToRgb(color)) > 125) ? 'black' : 'white';
}

export class Drawings {
    public static drawInteractions: CaniDraw[] = [
        new CaniDrawPoint('Point', ''),
        new CaniDrawPoint('ParkingMarker', 'marker', () => getParkingStyle()),
        new CaniDrawPoint('PoseMarker', 'marker', () => getPointStyle('dot_green.png'), {specificity: 'Posé'}),
        new CaniDrawPoint('SuspenduMarker', 'marker', () => getPointStyle('dot_blue.png'), {specificity: 'Suspendu'}),
        new CaniDrawPoint('CacheMarker', 'marker', () => getPointStyle('dot_purple.png'), {specificity: 'Caché'}),
        new CaniDrawLineString('VictimPath', 'polyline', (color: string) => getArrowLineStyle(color)),
        new CaniDrawLineString('K9Path', 'polyline', (color: string) => getArrowLineStyle(color)),
        new CaniDrawLineString('LineStringGps', 'polyline', (color: string) => getArrowLineStyle(color)),
        new CaniDrawLineString('LineStringArrow', 'polyline', (color: string) => getArrowLineStyle(color)),
        new CaniDrawLineString('LineString', 'polyline', (color: string) => getLineStyle(color)),
        new CaniDrawPolygon('Polygon', 'polygon', (color: string) => getBasicStyle(color)),
        new CaniDrawRectangle('Rectangle', 'rectangle', (color: string) => getBasicStyle(color)),
        new CaniDrawCircle('Circle', 'circle', (color: string) => getBasicStyle(color))
    ];
}

function getParkingStyle() {
    return new Style({
        image: new Icon({
            anchor: [50, 50],
            anchorXUnits: 'pixels',
            anchorYUnits: 'pixels',
            scale: 0.15,
            src: '../assets/icons/parking.svg'
        })
    });
}

function getPointStyle(icon: string) {
    return new Style({
        image: new Icon({
            crossOrigin: 'anonymous',
            src: '../assets/icons/' + icon
        })
    });
}

function getArrowLineStyle(color: string) {
    color = color ? color : randomColor();
    return (feature: Feature, resolution: number) => {
        const styles = new Array<Style>();
        styles.push(formatText(feature, color));
        let frequency = 25;
        const geometry: LineString = <LineString>feature.getGeometry();
        const length = getLength(geometry);
        let cursor = 0, segments = 0;
        geometry.forEachSegment(() => ++segments);
        frequency = Math.ceil((frequency * resolution) / (length / segments));
        geometry.forEachSegment((start, end) => {
            if ((++cursor % frequency) !== 0) {
                return;
            }
            const dx = end[0] - start[0];
            const dy = end[1] - start[1];
            const arrow = getArrowIcon(color);
            arrow.setRotation(-Math.atan2(dy, dx));
            styles.push(new Style({
                geometry: new Point([start[0] + dx / 2, start[1] + dy / 2]),
                image: arrow
            }));
        });
        return styles;
    };
}

function getLineStyle(color: string) {
    color = color ? color : randomColor();
    return (feature: Feature, resolution: number) => {
        const styles = new Array<Style>();
        styles.push(formatText(feature, color));
        return styles;
    };
}

function formatText(feature: Feature, color: string) {
    const text = getText(color);
    const geometry: LineString = <LineString>feature.getGeometry();
    text.setText(formatLength(geometry));
    return new Style({
        fill: getFillHexa(color),
        stroke: getStroke(color),
        text: text
    });
}

function getText(color: string) {
    return new Text({
        text: ' ',
        offsetY: -20,
        font: '18px Calibri,sans-serif',
        fill: getFillHexa(color),
        stroke: getStroke(getTextColor(color))
    });
}

function getArrowIcon(color: string) {
    return new Icon({
        color: color,
        crossOrigin: 'anonymous',
        src: '../assets/icons/arrow_20.png',
        anchor: [0.75, 0.5],
        rotateWithView: true,
    });
}

function getFillHexa(color: string) {
    return new Fill({
        color: color
    });
}

function getFillRgb(rgb: { r: number, g: number, b: number }) {
    return new Fill({
        color: 'rgba(' + rgb.r + ',' + rgb.g + ',' + rgb.b + ', 0.5)'
    });
}

function getStroke(color: string) {
    return new Stroke({
        color: color,
        width: 3
    });
}

function getBasicStyle(color: string) {
    color = color ? color : randomColor();
    let fill;
    if (color.startsWith('rgba')) {
        fill = getFillHexa(color);
    } else {
        fill = getFillRgb(hexToRgb(color));
    }
    return new Style({
        fill: fill,
        stroke: getStroke(color)
    });
}

export const drawInteractions = Drawings.drawInteractions;
