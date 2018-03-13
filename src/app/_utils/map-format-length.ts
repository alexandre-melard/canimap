import * as ol from 'openlayers';

export function formatLength(line: ol.geom.Geometry) {
    const length = ol.Sphere.getLength(line);
    let output;
    if (length > 1000) {
        output = (Math.round(length / 1000 * 100) / 100) +
            ' ' + 'km';
    } else {
        output = (Math.round(length * 100 / 100)) +
            ' ' + 'm';
    }
    return output;
}

export function getLength(line: ol.geom.Geometry) {
    return ol.Sphere.getLength(line);
}
