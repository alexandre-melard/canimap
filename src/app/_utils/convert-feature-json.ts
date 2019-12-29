import Feature from 'ol/Feature';
import GeometryType from 'ol/geom/GeometryType';
import GeoJSON from 'ol/format/GeoJSON';
import Circle from 'ol/geom/Circle';

export function feature2json(feature: Feature) {
    const geojsonFormat = new GeoJSON();
    const jsonStr = geojsonFormat.writeFeature(feature);
    const json = JSON.parse(jsonStr);
    json.properties = {
        type: feature.get('type'),
        color: getColor(feature)
    };
    if (GeometryType.CIRCLE === json.properties.type) {
        json.geometry = {
            type: GeometryType.CIRCLE, coordinates: {
                center: (<Circle>feature.getGeometry()).getCenter(),
                radius: (<Circle>feature.getGeometry()).getRadius()
            }
        };
    }
    return json;
}

function getColor(feature: Feature) {
    return feature.get('color') ||
        (feature.getStyle() && (typeof feature.getStyle() === 'function') && feature.getStyle()(feature)[0].getFill().getColor()) ||
        (feature.getStyle() && feature.getStyle().getFill() && feature.getStyle().getFill().getColor()) ||
        (feature.getStyle() && feature.getStyle().getStroke() && feature.getStyle().getStroke().getColor());
}
