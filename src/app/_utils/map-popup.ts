import { Events } from '../_consts/events';
import * as ol from 'openlayers';
import { EventService } from '../_services/event.service';

declare var $;

export function popup(popupDom: any, overlay: any, map: ol.Map, exec: ol.EventsListenerFunctionType) {
    $(popupDom).css('display', 'block');
    const closer = $(popupDom).find('a');
    map.once('singleclick', exec);
    closer.on('click', (event) => {
        overlay.setPosition(undefined);
        closer.blur();
        return false;
    });
}

function options(popupDom: any): ol.olx.OverlayOptions {
    const opts: ol.olx.OverlayOptions = {
        element: popupDom,
        autoPan: true,
        offset: [0, -25],
        autoPanAnimation: {
            duration: 250,
            source: null
        }
    };
    return opts;
}

export function popupDMS(selector: string, map: ol.Map, eventService: EventService) {
    const popupDom = $(selector).clone().get(0);
    const overlay = new ol.Overlay(options(popupDom));
    $('#map').css('cursor', 'crosshair');
    return popup(popupDom, overlay, map, function (evt: ol.MapBrowserEvent) {
        map.addOverlay(overlay);
        const coordinate = evt.coordinate;
        let hdms = ol.coordinate.toStringHDMS(ol.proj.transform(coordinate, 'EPSG:3857', 'EPSG:4326'));
        hdms = hdms.split(' ').join('');
        hdms = hdms.replace('N', 'N ');
        hdms = hdms.replace('S', 'S ');
        const content = $(popupDom).find('.ol-popup-content');
        content.html('<code>' + hdms + '</code>');
        overlay.setPosition(coordinate);
        $('#map').css('cursor', 'default');
        eventService.call(Events.MAP_STATE_MOVE);
    });
}


export function popupName(selector: string, map: ol.Map, eventService: EventService) {
    const popupDom = $(selector).clone().get(0);
    const overlay = new ol.Overlay(options(popupDom));
    return popup(popupDom, overlay, map, function (evt: ol.MapBrowserEvent) {
        map.addOverlay(overlay);
        const coordinate = evt.coordinate;
        const f = map.forEachFeatureAtPixel(
            evt.pixel,
            function (ft, layer) { return ft; },
            { hitTolerance: 20 }
        );
        if (f) {
            const content = $(popupDom).find('.ol-popup-content');
            content.html('<code>' + f.get('fileName') + '</code>');
            overlay.setPosition(coordinate);
        }
    });
}
