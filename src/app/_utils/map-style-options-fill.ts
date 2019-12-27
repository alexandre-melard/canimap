import * as ol from 'openlayers';

export function fillOptions(feature: ol.Feature, key?: string): ol.olx.style.FillOptions {
    const options: ol.olx.style.FillOptions = {};
    ['color'].forEach((param) => {
        if (feature.get((key ? key : 'custom.fill.') + param)) {
            options[param] = feature.get((key ? key : 'custom.fill.') + param);
        }
    });
    return options;
}
