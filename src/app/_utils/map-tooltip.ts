/**
 * Created by a140980 on 17/04/2015.
 */
import {formatLength} from './map-format-length';
import {formatArea} from './map-format-area';
import {Events} from '../_consts/events';
import Map from 'ol/Map';
import Polygon from 'ol/geom/Polygon';
import LineString from 'ol/geom/LineString';
import Point from 'ol/geom/Point';
import Overlay from 'ol/Overlay';
import Feature from 'ol/Feature';
import {unByKey} from 'ol/Observable';

declare var $;

/**
 * Message to show when the user is drawing a polygon.
 * @type {string}
 */
const continuePolygonMsg = 'Cliquez pour continuer le polygone';

/**
 * Message to show when the user is drawing a line.
 * @type {string}
 */
const continueLineMsg = 'Cliquez pour continuer le tracé';

export class Tooltip {
    static helpTooltipElement = null;
    static helpTooltip = null;
    static measureTooltipElement = null;
    static measureTooltip = null;
    static sketch = null;
    static map = null;
    static moveListenerKey = null;

    removePointerMoveHandler(map: Map) {
        this.deleteTooltip(map, null, null);
        Tooltip.moveListenerKey = null;
    }

    /**
     * Handle pointer move.
     * @param {ol.MapBrowserEvent} evt
     */
    pointerMoveHandler(evt) {
        if (evt.dragging) {
            return;
        }
        /** @type {string} */
        let helpMsg = 'Cliquez pour commencer à dessiner';
        /** @type {ol.Coordinate|undefined} */
        let tooltipCoord = evt.coordinate;

        if (Tooltip.sketch) {
            let output = null;
            const geom = Tooltip.sketch.getGeometry();
            if (geom instanceof Polygon) {
                output = formatArea(Tooltip.map.getView().getProjection(), geom);
                helpMsg = continuePolygonMsg;
                tooltipCoord = geom.getInteriorPoint().getCoordinates();
            } else if (geom instanceof LineString) {
                output = formatLength(geom);
                helpMsg = continueLineMsg;
                tooltipCoord = geom.getLastCoordinate();
            } else if (geom instanceof Point) {
                helpMsg = 'Cliquez pour ajouter un point';
            }
            if (output) {
                Tooltip.measureTooltipElement.innerHTML = output;
                Tooltip.measureTooltip.setPosition(tooltipCoord);
            }
        }
        Tooltip.helpTooltipElement.innerHTML = helpMsg;
        Tooltip.helpTooltip.setPosition(evt.coordinate);
    }

    createTooltip(map, tooltipDom, tooltipOverlay, options) {
        if (tooltipDom) {
            tooltipDom.parentNode.removeChild(tooltipDom);
        }
        tooltipDom = document.createElement('div');
        tooltipDom.className = options.class;
        tooltipOverlay = new Overlay(
            $.extend({element: tooltipDom}, options)
        );
        map.addOverlay(tooltipOverlay);
        return {overlay: tooltipOverlay, element: tooltipDom};
    }

    /**
     * Creates a new help tooltip
     */
    createHelpTooltip(map) {
        const ret = this.createTooltip(map, Tooltip.helpTooltipElement, Tooltip.helpTooltip,
            {
                offset: [15, 0],
                positioning: 'center-left',
                class: 'app-canimap-tooltip-help'
            });
        Tooltip.helpTooltip = ret.overlay;
        Tooltip.helpTooltipElement = ret.element;
    }

    /**
     * Creates a new measure tooltip
     */
    createMeasureTooltip(map) {
        const ret = this.createTooltip(map, Tooltip.measureTooltipElement, Tooltip.measureTooltip,
            {
                offset: [50, -18],
                positioning: 'bottom-center',
                class: 'app-canimap-tooltip-measure'
            });
        Tooltip.measureTooltip = ret.overlay;
        Tooltip.measureTooltipElement = ret.element;
    }

    createTooltips(map: Map, sketch?: Feature) {
        this.createMeasureTooltip(map);
        this.createHelpTooltip(map);
        Tooltip.sketch = sketch;
        Tooltip.map = map;
        Tooltip.moveListenerKey = map.on(Events.OL_MAP_POINTERMOVE, this.pointerMoveHandler, this);
    }

    deleteTooltip(map: Map, tooltipDom, tooltipOverlay) {
        if (tooltipDom) {
            tooltipDom.parentNode.removeChild(tooltipDom);
        }
        if (tooltipOverlay) {
            map.removeOverlay(tooltipOverlay);
        }
        if (Tooltip.moveListenerKey) {
            unByKey(Tooltip.moveListenerKey);
        }
    }

    /**
     * Creates a new help tooltip
     */
    deleteHelpTooltip(map) {
        this.deleteTooltip(map, Tooltip.helpTooltipElement, Tooltip.helpTooltip);
        Tooltip.helpTooltipElement = null;
        Tooltip.helpTooltip = null;
    }

    /**
     * Creates a new measure tooltip
     */
    deleteMeasureTooltip(map) {
        this.deleteTooltip(map, Tooltip.measureTooltipElement, Tooltip.measureTooltip);
        Tooltip.measureTooltipElement = null;
        Tooltip.measureTooltip = null;
    }

    deleteTooltips(map) {
        this.deleteHelpTooltip(map);
        this.deleteMeasureTooltip(map);
        this.removePointerMoveHandler(map);
    }

    resetTooltips(map) {
        this.deleteTooltips(map);
        this.createTooltips(map, null);
    }
}
