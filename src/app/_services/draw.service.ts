import {Injectable, OnDestroy} from '@angular/core';
import {EventService} from './event.service';
import {CaniDrawObjectService} from './caniDrawObject.service';
import {CaniDraw} from '../_models/caniDraw';
import {Tooltip} from '../_utils/map-tooltip';
import {drawInteractions} from '../_consts/drawings';
import {SETTINGS} from '../_consts/settings';
import {styleFunction} from '../_utils/map-style';
import {CaniDrawObject} from '../_models/caniDrawObject';
import {LogService} from '../_services/log.service';
import {formatLength} from '../_utils/map-format-length';
import {Events} from '../_consts/events';
import {writeScaleToCanvas} from '../_utils/write-scale-to-canvas';
import {randomColor} from 'randomcolor';
import {popupName} from '../_utils/map-popup';

import * as ol from 'openlayers';

declare var $;

@Injectable()
export class DrawService implements OnDestroy {
    vector: ol.layer.Vector;
    source: ol.source.Vector;
    modify: ol.interaction.Modify;
    select: ol.interaction.Select;
    delete: ol.interaction.Select;
    snap: ol.interaction.Snap;
    tooltip = new Tooltip();
    public color = undefined;
    private map: ol.Map;
    private watchId;
    private track: ol.geom.LineString;

    constructor(
        private eventService: EventService,
        private caniDrawObjectService: CaniDrawObjectService,
        private log: LogService
    ) {
        const me = this;
        this.eventService.subscribe(Events.MAP_STATE_LOADED,
            (map: ol.Map) => {
                me.mapLoaded(map);
            }
        );
    }

    ngOnDestroy() {
    }

    configureFeature(draw: CaniDraw) {
        draw.interaction.on(Events.OL_DRAW_START, (event: ol.interaction.Draw.Event) => {
            this.tooltip.sketch = event.feature;
        });
        draw.interaction.on(Events.OL_DRAW_END, (event: ol.interaction.Draw.Event) => {
            const feature = event.feature;
            feature.set('style', draw.style(this.color));
            this.tooltip.sketch = null;
            this.tooltip.resetTooltips(this.map);
            this.eventService.call(Events.MAP_STATE_MOVE);
            this.eventService.call(Events.MAP_DRAW_FEATURE_CREATED, {feature: feature, draw: draw});
        });
        $(document).keydown((e) => {
            if (e.which === 27) {
                draw.interaction.removeLastPoint();
            } else if (e.which === 46) {
                draw.interaction.setActive(false);
            }
        });
    }

    mapLoaded(map: ol.Map) {
        const me = this;
        this.source = new ol.source.Vector({wrapX: false});
        this.vector = new ol.layer.Vector({
            source: this.source,
            style: styleFunction,
            map: map
        });
        drawInteractions.forEach((drawInteraction) => {
            const options: ol.olx.interaction.DrawOptions = {
                source: this.source,
                type: drawInteraction.geometry,
            };
            if (drawInteraction.type === 'Rectangle') {
                options.geometryFunction = ol.interaction.Draw.createBox();
            } else {
            }
            drawInteraction.interaction = new ol.interaction.Draw(options);
            this.configureFeature(drawInteraction);
            map.addInteraction(drawInteraction.interaction);
            drawInteraction.interaction.setActive(false);
        });

        this.select = new ol.interaction.Select();
        map.addInteraction(this.select);
        this.select.setActive(false);
        this.select.on(Events.OL_DRAW_SELECT, (selectEvent: ol.interaction.Select.Event) => {
            const selected = selectEvent.selected;
            $(document).keydown((e) => {
                if (e.which === 46) {
                    while (selected.length > 0) {
                        this.source.removeFeature(selectEvent.selected.pop());
                    }
                }
            });
        });

        this.delete = new ol.interaction.Select();
        map.addInteraction(this.delete);
        this.delete.setActive(false);
        const deletedFeatures = this.delete.getFeatures();
        this.delete.on(Events.OL_MAP_CHANGE_ACTIVE, () => {
            deletedFeatures.forEach(deletedFeatures.remove, deletedFeatures);
        });
        this.delete.on(Events.OL_DRAW_SELECT, (selectEvent: ol.interaction.Select.Event) => {
            while (selectEvent.selected.length > 0) {
                this.source.removeFeature(selectEvent.selected.pop());
            }
        });

        this.modify = new ol.interaction.Modify({
            features: this.select.getFeatures()
        });
        map.addInteraction(this.modify);
        this.modify.setActive(false);

        // The snap interaction must be added after the Modify and Draw interactions
        // in order for its map browser event handlers to be fired first. Its handlers
        // are responsible of doing the snapping.
        this.snap = new ol.interaction.Snap({
            source: this.vector.getSource()
        });
        map.addInteraction(this.snap);
        this.map = map;

        this.eventService.subscribe(Events.MAP_STATE_MOVE,
            () => {
                me.eventService.call(Events.MAP_DRAW_INTERACTIONS_DISABLE);
            }
        );
        drawInteractions.forEach((drawInteraction) => {
            this.eventService.subscribe(drawInteraction.event,
                () => {
                    this.log.debug('[DrawService] drawing ' + drawInteraction.type);
                    me.enableDrawInteraction(drawInteraction.type);
                }
            );
        });
        this.eventService.subscribe(Events.MAP_DRAW_INTERACTIONS_DISABLE,
            () => {
                this.disableInteractions();
            }
        );
        this.eventService.subscribe(Events.MAP_DRAW_EDIT,
            () => {
                this.disableInteractions();
                this.select.setActive(true);
                this.modify.setActive(true);
            }
        );
        this.eventService.subscribe(Events.MAP_DRAW_DELETE,
            () => {
                this.disableInteractions();
                this.delete.setActive(true);
            }
        );
        this.eventService.subscribe(Events.MAP_DRAW_JSON_LAYERS_ADD,
            (file: any) => {
                const fileName = file.fileName;
                const json = JSON.parse(file.content);
                let features = new Array<ol.Feature>();
                this.log.debug('[DrawService] MAP_DRAW_JSON_LAYERS_ADD: importing json as draw');
                let i = 0;
                const toDelete = new Array();
                json.features.forEach((f) => {
                    if (f.geometry.type === 'Circle') {
                        const feature = new ol.Feature(new ol.geom.Circle(f.geometry.coordinates.center, f.geometry.coordinates.radius));
                        feature.set('style', f.properties.style);
                        features.push(feature);
                        toDelete.push(i);
                    }
                    i++;
                });
                // Delete circles features
                while (toDelete.length > 0) {
                    json.features.splice(toDelete.pop(), 1);
                }

                const geojsonFormat = new ol.format.GeoJSON();
                features = features.concat(geojsonFormat.readFeatures(json));
                features.forEach((f: ol.Feature) => {
                    const properties = f.getProperties();
                    let lStyle;
                    drawInteractions.forEach((draw) => {
                        if (
                            (draw.type === f.getGeometry().getType())
                            ||
                            (properties.style.type && (draw.type === properties.style.type))) {
                            lStyle = properties.style;
                        }
                    });
                    f.set('style', lStyle);
                    if ((f.getGeometry().getType() === 'Point') && f.getProperties().type && (f.getProperties().type === 'RuObject')) {
                        this.log.debug('[DrawService] MAP_DRAW_JSON_LAYERS_ADD: found object');
                        me.eventService.call(Events.MAP_DRAW_OBJECT_REGISTER, f);
                    }
                    f.set('fileName', fileName.slice(0, -8));
                });
                me.source.addFeatures(features);
                me.map.getView().fit(me.source.getExtent());
            }
        );
        this.eventService.subscribe(Events.MAP_DRAW_KML_EXPORT,
            (success: Function) => {
                this.log.debug('[DrawService] MAP_DRAW_KML_EXPORT: converting drawings to KML');
                const kmlFormat = new ol.format.KML();
                const kml = kmlFormat.writeFeatures(me.source.getFeatures(),
                    {
                        dataProjection: 'EPSG:4326',
                        featureProjection: 'EPSG:3857'
                    });
                success(kml);
            }
        );
        this.eventService.subscribe(Events.MAP_DRAW_GPX_EXPORT,
            (success: Function) => {
                this.log.debug('[DrawService] MAP_DRAW_GPX_EXPORT: converting drawings to GPX');
                const gpxFormat = new ol.format.GPX();
                const gpx = gpxFormat.writeFeatures(me.source.getFeatures(),
                    {
                        dataProjection: 'EPSG:4326',
                        featureProjection: 'EPSG:3857'
                    });
                success(gpx);
            }
        );
        this.eventService.subscribe(Events.MAP_DRAW_GEO_JSON_EXPORT,
            (success: Function) => {
                this.log.debug('[DrawService] MAP_DRAW_GEO_JSON_EXPORT: converting drawings to geoJson');
                const geojsonFormat = new ol.format.GeoJSON();
                const jsonStr = geojsonFormat.writeFeatures(me.source.getFeatures());
                const json = JSON.parse(jsonStr);
                const circles = json.features.filter((f) => (f.properties.style.type === 'Circle'));
                const featCircles = me.source.getFeatures().filter((f) => (f.getGeometry().getType() === 'Circle'));
                const coords = new Array();
                featCircles.map((f) => coords.push(
                    {
                        center: (<ol.geom.Circle>f.getGeometry()).getCenter(),
                        radius: (<ol.geom.Circle>f.getGeometry()).getRadius()
                    }
                ));
                let i;
                for (i = 0; i < featCircles.length; i++) {
                    circles[i].geometry = {type: 'Circle', coordinates: coords[i]};
                }
                success(JSON.stringify(json));
            }
        );
        this.eventService.subscribe(Events.MAP_DRAW_PNG_EXPORT,
            (success: Function) => {
                this.log.debug('[DrawService] MAP_DRAW_PNG_EXPORT: converting drawings to png');
                me.map.once('postcompose', function (event: ol.render.Event) {
                    let canvas = event.context.canvas;
                    canvas.setAttribute('crossOrigin', 'anonymous');
                    const olscale = $('.ol-scale-line-inner');
                    canvas = writeScaleToCanvas(event, canvas, olscale);
                    canvas.setAttribute('crossOrigin', 'Anonymous');
                    try {
                        canvas.toBlob(function (blob) {
                            success(blob);
                        }, 'image/jpeg', 0.80);
                    } catch (e) {
                        if (e.name !== 'SecurityError') {
                            throw e;
                        }
                    }
                });
                me.map.renderSync();
            }
        );
        this.eventService.subscribe(Events.MAP_DRAW_GPS_IMPORT,
            (gps: { content, type }) => {
                this.log.debug('[DrawService] MAP_DRAW_GPS_IMPORT: importing gps path as draw');
                let f;
                switch (gps.type) {
                    case 'gpx':
                        f = new ol.format.GPX();
                        break;
                    case 'kml':
                        f = new ol.format.KML();
                        break;
                }
                const features = f.readFeatures(gps.content, {dataProjection: 'EPSG:4326', featureProjection: 'EPSG:3857'});
                features.forEach((feature: ol.Feature) => {
                    const lStyle = drawInteractions.find((draw) => (draw.type === 'LineStringGps')).style;
                    if (feature.getGeometry().getType() === 'MultiLineString') {
                        (<ol.geom.MultiLineString>feature.getGeometry()).getLineStrings().forEach((lineStringGeom: ol.geom.LineString) => {
                            const feat = new ol.Feature(lineStringGeom);
                            feat.set('style', lStyle(this.color ? this.color : randomColor()));
                            me.source.addFeature(feat);
                        });
                    } else {
                        feature.set('style', lStyle(this.color ? this.color : randomColor()));
                        me.source.addFeature(feature);
                    }
                    if ((feature.getGeometry().getType() === 'Point') && feature.getProperties().type &&
                        (feature.getProperties().type === 'RuObject')) {
                        this.log.debug('[DrawService] MAP_DRAW_GPS_IMPORT: found object');
                        me.eventService.call(Events.MAP_DRAW_OBJECT_REGISTER, feature);
                    }
                });
                me.map.getView().fit(me.source.getExtent());
            }
        );
        this.eventService.subscribe(Events.MAP_DRAW_TRACK_RECORD,
            (status: Function) => {
                if (status) {
                    this.log.info('[DrawService] MAP_DRAW_TRACK_RECORD starting track recording');
                    me.source.clear();
                    me.track = null;
                    let first = true;
                    me.watchId = navigator.geolocation.watchPosition((position) => {
                            this.log.debug('[DrawService] MAP_DRAW_TRACK_RECORD: ' + position.coords);
                            const lat = position.coords.latitude;
                            const lng = position.coords.longitude;
                            const coords = ol.proj.transform([lng, lat], 'EPSG:4326', 'EPSG:3857');
                            me.map.getView().setCenter(coords);

                            // We skip the first coordinates as it's always the last known position and not always right
                            if (first) {
                                first = false;
                            } else {
                                if (!me.track) {
                                    me.track = new ol.geom.LineString([coords]);
                                    const lStyle = drawInteractions.find((draw) => (draw.type === 'LineStringGps')).style;
                                    const feature = new ol.Feature({geometry: me.track});
                                    feature.set('style', lStyle(SETTINGS.TRACK.COLOR));
                                    me.source.addFeature(feature);
                                } else {
                                    const coordinates = me.track.getCoordinates();
                                    const lastCoordinates = coordinates[coordinates.length - 1];
                                    let tmpLine = new ol.geom.LineString([lastCoordinates, coords]);
                                    if (tmpLine.getLength() > SETTINGS.TRACK.FREQUENCY) {
                                        coordinates.push(coords);
                                        me.track.setCoordinates(coordinates);
                                        me.log.info('Longueur: ' + formatLength(me.track), true);
                                    }
                                    tmpLine = undefined;
                                }
                            }
                        },
                        (failure) => {
                        },
                        {
                            enableHighAccuracy: true
                        });
                } else {
                    this.log.success('[DrawService] MAP_DRAW_TRACK_RECORD stopping track recording');
                    navigator.geolocation.clearWatch(this.watchId);
                    this.eventService.call(Events.MAP_FILE_SAVE, null);
                    this.track = undefined;
                }
            }
        );
        this.eventService.subscribe(Events.MAP_DRAW_OBJECT_ADD,
            () => {
                this.log.debug('[DrawService] MAP_DRAW_OBJECT_ADD: add object on track');
                navigator.geolocation.getCurrentPosition((position) => {
                    this.log.debug('[DrawService] MAP_DRAW_OBJECT_ADD: ' + position.coords);
                    const lat = position.coords.latitude;
                    const lng = position.coords.longitude;
                    const coords = ol.proj.transform([lng, lat], 'EPSG:4326', 'EPSG:3857');
                    me.map.getView().setCenter(coords);
                    const feature = new ol.Feature(new ol.geom.Point(coords));
                    this.caniDrawObjectService.createObject(feature).subscribe((object: CaniDrawObject) => {
                        const lStyle = drawInteractions.find((drawInteraction) => drawInteraction.type === object.type).style;
                        feature.set('style', lStyle(this.color));
                        this.source.addFeature(feature);
                    });
                });
            }
        );
        let drawNameDisplayKey;
        this.eventService.subscribe(Events.MAP_DRAW_NAME_DISPLAY_SUBSCRIBE,
            () => {
                this.log.debug('[DrawService] MAP_DRAW_NAME_DISPLAY_SUBSCRIBE: subscribe display name on track');
                if (!drawNameDisplayKey) {
                    drawNameDisplayKey = me.map.on('click', function (evt: ol.MapBrowserEvent) {
                        popupName('.ol-popup-name', me.map, me.eventService);
                    });
                }
            }
        );
        this.eventService.subscribe(Events.MAP_DRAW_NAME_DISPLAY_UNSUBSCRIBE,
            () => {
                this.log.debug('[DrawService] MAP_DRAW_NAME_DISPLAY_UNSUBSCRIBE: unsubscribe display name on track');
                if (drawNameDisplayKey) {
                    ol.Map.unByKey(drawNameDisplayKey);
                }
                me.eventService.call(Events.MAP_STATE_MOVE);
            }
        );
        this.log.info('[DrawService] draw services loaded');
    }

    disableInteractions() {
        drawInteractions.map((drawInteraction) => drawInteraction.interaction.setActive(false));
        this.select.setActive(false);
        this.delete.setActive(false);
        this.modify.setActive(false);
        this.tooltip.deleteTooltips(this.map);
    }

    getDrawInteraction(type: string): ol.interaction.Draw {
        return drawInteractions.find((drawInteraction) => drawInteraction.type === type).interaction;
    }

    enableDrawInteraction(type: string) {
        this.disableInteractions();
        this.getDrawInteraction(type).setActive(true);
        this.tooltip.createTooltips(this.map, null);
    }
}
