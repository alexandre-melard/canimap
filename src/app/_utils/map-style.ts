import {lineStringStyle} from './map-style-linestring';
import * as ol from 'openlayers';

export function styleFunction(feature: ol.Feature, resolution: number) {
    const geometry: ol.geom.LineString = <ol.geom.LineString>feature.getGeometry();
    let styles = new Array<ol.style.Style>();
    if (geometry.getType() === 'LineString') {
        styles = styles.concat(lineStringStyle(feature, resolution));
    } else if (geometry.getType() === 'Point') {
        styles.push(new ol.style.Style({image: new ol.style.Icon(feature.get('style'))}));
    } else {
        const style = feature.get('style');
        style.fill = new ol.style.Fill(style.fillOptions);
        style.stroke = new ol.style.Stroke(style.strokeOptions);
        styles.push(new ol.style.Style(style));
    }
    return styles;
}
