import { Sphere, geom } from 'openlayers';

export function formatLength(line: geom.Geometry) {
    const length = Sphere.getLength(line);
    let output;
    if (length > 100) {
        output = (Math.round(length / 1000 * 100) / 100) +
            ' ' + 'km';
    } else {
        output = (Math.round(length * 100) / 100) +
            ' ' + 'm';
    }
    return output;
}
