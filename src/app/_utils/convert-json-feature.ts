import Feature from 'ol/Feature';
import GeometryType from 'ol/geom/GeometryType';
import GeoJSON from 'ol/format/GeoJSON';
import Circle from 'ol/geom/Circle';
import {Drawings} from '../_consts/drawings';

const geojsonFormat = new GeoJSON();

export function json2feature(f: any) {
    let feature: Feature;
    const type = f.properties.type;
    const color = f.properties.color;
    switch (type) {
        case GeometryType.CIRCLE:
            feature = new Feature(new Circle(f.geometry.coordinates.center, f.geometry.coordinates.radius));
            break;
        default:
            feature = geojsonFormat.readFeatureFromObject(f);
            break;
    }
    const style = Drawings.drawInteractions.find(d => d.type === type).style;
    feature.setStyle(style(color));
    feature.set('type', type);
    feature.set('color', color);
    return feature;
}
