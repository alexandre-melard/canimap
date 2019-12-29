import {Events} from '../_consts/events';
import {EventService} from '../_services/event.service';
import Map from 'ol/Map';
import Overlay from 'ol/Overlay';
import {transform} from 'ol/proj';
import {toStringHDMS} from 'ol/coordinate';
import MapBrowserEvent from 'ol/MapBrowserEvent';

declare var $;

export function popup(popupDom: any, overlay: any, map: Map, exec) {
    $(popupDom).css('display', 'block');
    const closer = $(popupDom).find('a');
    map.once('singleclick', exec);
    closer.on('click', () => {
        overlay.setPosition(undefined);
        closer.blur();
        return false;
    });
}

function options(popupDom: any) {
    return {
        element: popupDom,
        autoPan: true,
        offset: [0, -25],
        autoPanAnimation: {
            duration: 250,
            source: null
        }
    };
}

export function popupDMS(selector: string, map: Map, eventService: EventService) {
    const popupDom = $(selector).clone().get(0);
    const overlay = new Overlay(options(popupDom));
    $('#map').css('cursor', 'crosshair');
    return popup(popupDom, overlay, map, function (evt: MapBrowserEvent) {
        map.addOverlay(overlay);
        const coordinate = evt.coordinate;
        let hdms = toStringHDMS(transform(coordinate, 'EPSG:3857', 'EPSG:4326'));
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


export function popupName(selector: string, map: Map) {
    const popupDom = $(selector).clone().get(0);
    const overlay = new Overlay(options(popupDom));
    return popup(popupDom, overlay, map, function (evt: MapBrowserEvent) {
        map.addOverlay(overlay);
        const coordinate = evt.coordinate;
        const f = map.forEachFeatureAtPixel(
            evt.pixel,
            function (ft) {
                return ft;
            },
            {hitTolerance: 20}
        );
        if (f) {
            const content = $(popupDom).find('.ol-popup-content');
            content.html('<code>' + f.get('fileName') + '</code>');
            overlay.setPosition(coordinate);
        }
    });
}
