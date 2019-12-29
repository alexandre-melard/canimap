import {getLength} from 'ol/sphere';

export function formatLength(line) {
    const length = getLength(line);
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

