import * as ol from 'openlayers';

/**
 * @typedef {{
 *     lineCap: (string|undefined),
 *     lineJoin: (string|undefined),
 *     lineDash: (Array.<number>|undefined),
 *     miterLimit: (number|undefined),
 *     width: (number|undefined)
 * }}
 */
export function strokeOptions(feature: ol.Feature, key?: string): ol.olx.style.StrokeOptions {
    const options: ol.olx.style.StrokeOptions = {};
    ['color', 'lineCap', 'lineJoin', 'lineDash', 'miterLimit', 'width'].forEach((param) => {
        if (feature.get((key ? key : 'custom.stroke.') + param)) {
            options[param] = feature.get((key ? key : 'custom.stroke.') + param);
        }
    });
    return options;
}
