import { getLength as SphereGetLength } from 'ol/sphere';
import { Geometry } from 'ol/geom';

export function formatLength(line: Geometry) {
    const length = SphereGetLength(line);
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
export function getLength(line: Geometry) {
    return SphereGetLength(line);
}
