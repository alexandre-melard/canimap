import GeoJSON from 'ol/format/GeoJSON';

const geojsonFormat = new GeoJSON();

export function convertFromLegacy(f: any) {
    if (f.properties.style) {
        let type;
        let color;
        const style = f.properties.style;
        if (style.type === 'Marker') {
            if (style.src.contains('dot_green')) {
                type = 'PoseMarker';
            } else if (style.src.contains('dot_blue')) {
                type = 'SuspenduMarker';
            } else if (style.src.contains('dot_purple')) {
                type = 'CacheMarker';
            } else if (style.src.contains('parking')) {
                type = 'ParkingMarker';
            }
        } else if (f.geometry.type === 'LineString') {
            type = 'VictimPath';
            color = style.strokeOptions.color;
        } else if (f.geometry.type === 'Circle') {
            type = 'Circle';
            color = style.strokeOptions.color;
        } else if (f.geometry.type === 'Rectangle') {
            type = 'Rectangle';
            color = style.strokeOptions.color;
        } else if (f.geometry.type === 'Polygon') {
            type = 'Polygon';
            color = style.strokeOptions.color;
        }
        delete f.properties.style;
        f.properties.type = type;
        f.properties.color = color;
    }
    return f;
}
