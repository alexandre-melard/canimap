import {Injectable, OnDestroy} from '@angular/core';
import {Observable} from 'rxjs/Observable';
import {EventService} from './event.service';
import {UserService} from './user.service';
import {DeviceDetectorService} from 'ngx-device-detector';
import {LogService} from './log.service';
import {MapBox} from '../_models/mapBox';
import {LayerBox} from '../_models/layerBox';
import {User} from '../_models';
import {Events} from '../_consts/events';
import {popupDMS} from '../_utils/map-popup';
import Feature from 'ol/Feature';
import Map from 'ol/Map';
import Point from 'ol/geom/Point';
import Circle from 'ol/style/Circle';
import Fill from 'ol/style/Fill';
import Stroke from 'ol/style/Stroke';
import Style from 'ol/style/Style';
import {fromLonLat, get, transform} from 'ol/proj';
import Layer from 'ol/layer/Layer';
import TileLayer from 'ol/layer/Tile';
import VectorLayer from 'ol/layer/Vector';
import BingMaps from 'ol/source/BingMaps';
import OSM from 'ol/source/OSM';
import WMTS from 'ol/source/WMTS';
import XYZ from 'ol/source/XYZ';
import VectorSource from 'ol/source/Vector';
import {defaults as defaultsControl, ScaleLine} from 'ol/control';
import View from 'ol/View';
import {MapBrowserEvent} from 'ol/MapBrowserEvent';
import {getWidth} from 'ol/extent';
import WMTSTileGrid from 'ol/tilegrid/WMTS';

declare var $;
declare var GyroNorm;

@Injectable()
export class MapService implements OnDestroy {

    osm = new LayerBox(
        'osm',
        'Osm',
        this.getOsmLayer('osm', 0, false)
    );
    bingSatellite = new LayerBox(
        'bingSatellite',
        'Bing Satellite',
        this.getBingLayer('bingSatellite', 'Aerial', 0, false)
    );
    googleSatellite = new LayerBox(
        'googleSatellite',
        'Google Satellite',
        this.getGoogleLayer('googleSatellite', 's', 0, false)
    );
    googleHybride = new LayerBox(
        'googleHybride',
        'Google Hybride',
        this.getGoogleLayer('googleSatellite', 'y', 0, false)
    );
    bingHybride = new LayerBox(
        'bingHybride',
        'Bing Hybride',
        this.getBingLayer('bingHybride', 'AerialWithLabels', 1, true)
    );
    ignPlan = new LayerBox(
        'ignPlan',
        'IGN Topo',
        this.getIgnLayer('ignPlan', 'GEOGRAPHICALGRIDSYSTEMS.MAPS', 0, false)
    );
    ignSatellite = new LayerBox(
        'ignSatellite',
        'IGN Photo Aeriennes',
        this.getIgnLayer('ignSatellite', 'ORTHOIMAGERY.ORTHOPHOTOS', 0, false)
    );
    private gn: any;
    private watchPositionId: number;
    private map: Map;

    constructor(
        private eventService: EventService,
        private userService: UserService,
        private deviceService: DeviceDetectorService,
        private log: LogService
    ) {
        if (deviceService.isMobile()) {
            this.gn = new GyroNorm();
        }
        this.eventService.subscribe(Events.MAP_MOVE, (
            (coords: any) => {
                this.log.debug('[MapService] moving map to :' + JSON.stringify(coords));
                this.map.getView().setCenter(fromLonLat([coords.lng, coords.lat]));
                this.map.getView().setZoom(18);
                if (coords.success) {
                    coords.success();
                }
            }
        ));
        this.eventService.subscribe(Events.MAP_SET_RESOLUTION, (
            (resolution: number) => {
                this.log.debug('[MapService] setting map scale to :' + resolution);
                resolution = resolution / 3570;
                this.map.getView().setResolution(resolution);
            }
        ));
    }

    get layerBoxes(): LayerBox[] {
        return [this.ignPlan, this.ignSatellite, this.googleSatellite, this.googleHybride, this.osm, this.bingSatellite, this.bingHybride];
    }

    private get user(): Observable<User> {
        return this.userService.currentUser();
    }

    compass() {
        if (this.watchPositionId) {
            navigator.geolocation.clearWatch(this.watchPositionId);
            this.gn.end();
            this.watchPositionId = null;
        } else {
            this.watchPositionId = navigator.geolocation.watchPosition(
                position => {
                    this.eventService.call(
                        Events.MAP_MOVE,
                        {
                            lat: position.coords.latitude, lng: position.coords.longitude, success: () => {
                            }
                        }
                    );
                },
                error => this.log.error('[MapService] Error while getting current position: ' + JSON.stringify(error)),
                {enableHighAccuracy: true}
            );
            const initialAngle = this.map.getView().getRotation();
            const me = this;
            me.gn.init({frequency: 50, orientationBase: GyroNorm.GAME}).then(function () {
                me.gn.start(function (event) {
                    const alpha = event.do.alpha * Math.PI * 2 / 360;
                    me.log.info(`a: ${event.do.alpha}`, true);
                    me.map.getView().setRotation(initialAngle + alpha);
                });
            });
        }
    }

    addMarker(coords) {
        this.log.debug('[MapService] adding marker to :' + JSON.stringify(coords));
        const iconFeature = new Feature({
            geometry: new Point(fromLonLat([coords.lng, coords.lat])),
        });
        iconFeature.setStyle(new Style({
            image: new Circle({
                radius: 10,
                stroke: new Stroke({
                    color: 'purple',
                    width: 2
                }),
                fill: new Fill({
                    color: 'rgba(255,0,0,0.5)'
                })
            })
        }));
        this.map.addLayer(new VectorLayer({source: new VectorSource({features: [iconFeature]})}));
    }

    gpsMarker() {
        this.log.debug('[MapService] drawing gps marker');
        this.eventService.call(Events.MAP_DRAW_INTERACTIONS_DISABLE);
        popupDMS('.ol-popup', this.map, this.eventService);
    }

    rotate(radians: number) {
        this.map.getView().setRotation(radians);
    }

    setMapFromUserPreferences(user: User): Observable<any> {
        return new Observable((observer) => {
            if (user.mapBoxes) {
                user.mapBoxes.forEach(m => {
                    const layerBox = this.layerBoxes.find(l => m.key === l.key);
                    if (layerBox) {
                        layerBox.layer.setOpacity(m.opacity);
                        layerBox.layer.setVisible(m.visible);
                    } else {
                        // there is a problem with the saved data, removed corrupted entry
                        user.mapBoxes.slice(user.mapBoxes.lastIndexOf(m), 1);
                    }
                });
            } else {
                user.mapBoxes = new Array<MapBox>();
                this.layerBoxes.forEach(layerBox => {
                    user.mapBoxes.push(new MapBox(layerBox.key, layerBox.layer.getOpacity(), layerBox.layer.getVisible()));
                });
            }
            observer.next();
        });
    }

    loadMap() {
        const map = new Map({
            target: 'map',
            controls: defaultsControl({
                attributionOptions: {
                    collapsible: false
                }
            }).extend([
                new ScaleLine()
            ]),
            loadTilesWhileAnimating: false,
            view: new View({
                zoom: 15,
                center: transform([5.347022, 45.419364], 'EPSG:4326', 'EPSG:3857')
            })
        });

        /**
         * Rustine, permet d'eviter les cartes blanches sur mobile en attendant de trouver la vrai raison
         */
        if (this.deviceService.isMobile) {
            map.on(Events.OL_MAP_POSTRENDER, (event: MapBrowserEvent) => {
                const canva = document.getElementsByTagName('canvas')[0];
                const reload = document.location.href.endsWith('map') && canva && canva.style.display === 'none';
                if (reload) {
                    event.map.updateSize();
                }
            });
        }

        this.layerBoxes.map(layerBox => map.addLayer(layerBox.layer));

        // add slider
        if (this.deviceService.isMobile()) {
            $('.ol-zoom-in').css('display', 'none');
            $('.ol-zoom-out').css('display', 'none');
        }
        this.map = map;
        this.eventService.call(Events.MAP_STATE_LOADED, map);
        this.eventService.call(Events.MAP_MOVE_CURRENT);
        if (this.deviceService.isMobile()) {
            navigator.geolocation.getCurrentPosition(
                position => {
                    this.eventService.call(
                        Events.MAP_MOVE,
                        {
                            lat: position.coords.latitude, lng: position.coords.longitude
                        }
                    );
                },
                error => this.log.error('[MapService] Error while getting current position: ' + JSON.stringify(error)),
                {
                    enableHighAccuracy: true
                }
            );
        }
    }

    getBingLayer(key: string, type: string, opacity: number, visible: boolean) {
        const l = new TileLayer(
            {
                visible: visible,
                opacity: opacity,
                preload: Infinity,
                source: new BingMaps({
                    key: 'AkI1BkPAQ-KOw7uZLelGWgLQ5Vbxq7-5K8p-2oMsMuboW8wGBMKA6T63GJ1nJVFK',
                    imagerySet: type
                })
            });
        l.set('id', key);
        return l;
    }

    getGoogleLayer(key: string, type: string, opacity: number, visible: boolean) {
        const l = new TileLayer(
            {
                visible: visible,
                opacity: opacity,
                preload: Infinity,
                source: new XYZ({
                    url: `https://mt0.google.com/vt/lyrs=${type}&hl=en&x={x}&y={y}&z={z}&s=Ga`
                })
            });
        l.set('id', key);
        return l;
    }

    getOsmLayer(key: string, opacity: number, visible: boolean) {
        const l = new TileLayer(
            {
                visible: visible,
                opacity: opacity,
                source: new OSM()
            });
        l.set('id', key);
        return l;
    }

    getIgnLayer(key: string, type: string, opacity: number, visible: boolean): Layer {
        const resolutions = [];
        const matrixIds = [];
        const proj3857 = get('EPSG:3857');
        const maxResolution = getWidth(proj3857.getExtent()) / 256;

        for (let i = 0; i < 18; i++) {
            matrixIds[i] = i.toString();
            resolutions[i] = maxResolution / Math.pow(2, i);
        }

        const tileGrid = new WMTSTileGrid({
            origin: [-20037508, 20037508],
            resolutions: resolutions,
            matrixIds: matrixIds
        });

        // API key valid for 'openlayers.org' and 'localhost'.
        // Expiration date is 06/29/2018.
        const apiKey = '6i88pkdxubzayoady4upbkjg';

        const ign_source = new WMTS({
            url: 'https://wxs.ign.fr/' + apiKey + '/wmts',
            layer: type,
            matrixSet: 'PM',
            format: 'image/jpeg',
            projection: 'EPSG:3857',
            tileGrid: tileGrid,
            style: 'normal',
            attributions: '<a href="http://www.geoportail.fr/" target="_blank">' +
                '<img src="https://api.ign.fr/geoportail/api/js/latest/' +
                'theme/geoportal/img/logo_gp.gif" alt="ign"></a>',
            crossOrigin: ''
        });

        const ign = new TileLayer({
            opacity: opacity,
            visible: visible,
            source: ign_source
        });
        ign.set('id', key);

        return ign;
    }

    saveOpacity() {
        this.user.subscribe(
            (user) => {
                this.layerBoxes.forEach(layerBox => {
                    let mapBox = user.mapBoxes.find(m => layerBox.key === m.key);
                    if (!mapBox) {
                        mapBox = new MapBox(layerBox.key, layerBox.layer.getOpacity(), layerBox.layer.getVisible());
                        user.mapBoxes.push(mapBox);
                    }
                    mapBox.opacity = layerBox.layer.getOpacity();
                    mapBox.visible = layerBox.layer.getVisible();
                });
                this.log.info('[MapService] sending settings to the server');
                this.userService.update(user).subscribe(
                    () => this.log.success('[MapService] settings saved on the server'),
                    (error) => this.log.error('[MapService] error while sending settings on the server:' + JSON.stringify(error))
                );
            },
            (error) => this.log.error('[MapService] error while getting current user:' + JSON.stringify(error))
        );
    }

    setOpacity(layerBox: LayerBox, opacity: number) {
        layerBox.layer.setVisible(opacity !== 0);
        layerBox.layer.setOpacity(opacity);
    }

    ngOnDestroy() {
    }
}
