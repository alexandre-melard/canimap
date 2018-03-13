/**
 * Created by a140980 on 17/04/2015.
 */
import { formatLength } from './map-format-length';
import { formatArea } from './map-format-area';
import { Map, Feature } from 'openlayers';

import * as ol from 'openlayers';
import * as $ from 'jquery';

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
    helpTooltipElement = null;
    helpTooltip = null;
    measureTooltipElement = null;
    measureTooltip = null;
    sketch = null;
    map = null;
    moveListenerKey = null;

    removePointerMoveHandler(map: Map) {
        this.deleteTooltip(map, null, null, this.moveListenerKey);
        this.moveListenerKey = null;
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

        if (this.sketch) {
            let output = null;
            const geom = this.sketch.getGeometry();
            if (geom instanceof ol.geom.Polygon) {
                output = formatArea(this.map.getView().getProjection(), geom);
                helpMsg = continuePolygonMsg;
                tooltipCoord = geom.getInteriorPoint().getCoordinates();
            } else if (geom instanceof ol.geom.LineString) {
                output = formatLength(geom);
                helpMsg = continueLineMsg;
                tooltipCoord = geom.getLastCoordinate();
            } else if (geom instanceof ol.geom.Point) {
                helpMsg = 'Cliquez pour ajouter un point';
            }
            if (output) {
                this.measureTooltipElement.innerHTML = output;
                this.measureTooltip.setPosition(tooltipCoord);
            }
        }
        this.helpTooltipElement.innerHTML = helpMsg;
        this.helpTooltip.setPosition(evt.coordinate);
    }

    createTooltip(map, tooltipDom, tooltipOverlay, options) {
        if (tooltipDom) {
            tooltipDom.parentNode.removeChild(tooltipDom);
        }
        tooltipDom = document.createElement('div');
        tooltipDom.className = options.class;
        tooltipOverlay = new ol.Overlay(
            $.extend({ element: tooltipDom }, options)
        );
        map.addOverlay(tooltipOverlay);
        return { overlay: tooltipOverlay, element: tooltipDom };
    }

    /**
     * Creates a new help tooltip
     */
    createHelpTooltip(map) {
        const ret = this.createTooltip(map, this.helpTooltipElement, this.helpTooltip,
            {
                offset: [15, 0],
                positioning: 'center-left',
                class: 'app-canimap-tooltip-help'
            });
        this.helpTooltip = ret.overlay;
        this.helpTooltipElement = ret.element;
    }

    /**
     * Creates a new measure tooltip
     */
    createMeasureTooltip(map) {
        const ret = this.createTooltip(map, this.measureTooltipElement, this.measureTooltip,
            {
                offset: [50, -18],
                positioning: 'bottom-center',
                class: 'app-canimap-tooltip-measure'
            });
        this.measureTooltip = ret.overlay;
        this.measureTooltipElement = ret.element;
    }

    createTooltips(map: Map, sketch?: Feature) {
        this.createMeasureTooltip(map);
        this.createHelpTooltip(map);
        this.sketch = sketch;
        this.map = map;
        this.moveListenerKey = map.on('pointermove', this.pointerMoveHandler, this);
    }

    deleteTooltip(map, tooltipDom, tooltipOverlay, moveListenerKey) {
        if (tooltipDom) {
            tooltipDom.parentNode.removeChild(tooltipDom);
        }
        if (tooltipOverlay) {
            map.removeOverlay(tooltipOverlay);
        }
        if (moveListenerKey) {
            ol.Observable.unByKey(moveListenerKey);
        }
    }

    /**
     * Creates a new help tooltip
     */
    deleteHelpTooltip(map) {
        this.deleteTooltip(map, this.helpTooltipElement, this.helpTooltip, null);
        this.helpTooltipElement = null;
        this.helpTooltip = null;
    }

    /**
     * Creates a new measure tooltip
     */
    deleteMeasureTooltip(map) {
        this.deleteTooltip(map, this.measureTooltipElement, this.measureTooltip, null);
        this.measureTooltipElement = null;
        this.measureTooltip = null;
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
