import { Injectable, OnDestroy, Output } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';
import { ReplaySubject } from 'rxjs/ReplaySubject';
import { Subject } from 'rxjs/Subject';
import { EventService } from './event.service';
import { UserService } from './user.service';

import { DeviceDetectorService } from 'ngx-device-detector';
import { LogService } from '../_services/log.service';

import { MapBox } from '../_models/mapBox';
import { LayerBox } from '../_models/layerBox';
import { User } from '../_models/user';

import { SETTINGS } from '../_consts/settings';

import { Overlay } from 'ol/Overlay';
import { View } from 'ol/View';

import { Map } from 'ol/Map';
import { Feature } from 'ol/Feature';
import { Vector, Tile, Base } from 'ol/layer';
import { Vector as VectorSource, WMTSSource as WMTSSource, BingMaps, TileImage} from 'ol/source';
import { Point } from 'ol/geom';
import { getWidth } from 'ol/extent';
import { Circle, Style, Stroke, Fill } from 'ol/style';
import { AttributionOptions, ScaleLine, defaults } from 'ol/control';
import { fromLonLat, transform, get } from 'ol/proj';
import { toStringHDMS } from 'ol/coordinate';
import { WMTS } from 'ol/tilegrid';
import { Events } from '../_consts/events';

declare var $;
declare var GyroNorm;

@Injectable()
export class MapService implements OnDestroy {

  private gn: any;
  private watchPositionId: number;
  private map: Map;
  private keepAfterNavigationChange = false;

  private get user(): Observable<User> {
    return this.userService.currentUser();
  }

  get layerBoxes(): LayerBox[] {
    return [this.ignPlan, this.ignSatellite, this.googleSatellite, this.bingSatellite, this.bingHybride];
  }

  googleSatellite = new LayerBox(
    'googleSatellite',
    'Google Satellite',
    this.getGoogleLayer('googleSatellite', 's', 0, false)
  );
  bingSatellite = new LayerBox(
    'bingSatellite',
    'Bing Satellite',
    this.getBingLayer('bingSatellite', 'Aerial', 0, false)
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

  constructor(
    private route: ActivatedRoute,
    private router: Router,
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
        this.log.debug('moving map to :' + JSON.stringify(coords));
        this.map.getView().setCenter(fromLonLat([coords.lng, coords.lat]));
        this.map.getView().setZoom(18);
        if (coords.success) {
          coords.success();
        }
      }
    ));
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
              lat: position.coords.latitude, lng: position.coords.longitude, success: () => { }
            }
          );
        },
        error => this.log.error('Error while getting current position: ' + JSON.stringify(error)),
        { enableHighAccuracy: true }
      );
      const initialAngle = this.map.getView().getRotation();
      const me = this;
      me.gn.init({ frequency: 50, orientationBase: GyroNorm.GAME }).then(function () {
        me.gn.start(function (event) {
          event.do.alpha = event.do.alpha;
          const alpha = event.do.alpha * Math.PI * 2 / 360;
          me.log.info(`a: ${event.do.alpha}`, true);
          me.map.getView().setRotation(initialAngle + alpha);
        });
      });
    }
  }

  addMarker(coords) {
    this.log.debug('adding marker to :' + JSON.stringify(coords));
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
    this.map.addLayer(new Vector({ source: new VectorSource({ features: [iconFeature] }) }));
  }

  gpsMarker() {
    this.log.debug('drawing gps marker');
    this.eventService.call(Events.MAP_DRAW_INTERACTIONS_DISABLE);
    const popup = $('.ol-popup').clone().get(0);
    $(popup).css('display', 'block');
    const options = {
      element: popup,
      autoPan: true,
      offset: [0, -25],
      autoPanAnimation: {
        duration: 250,
        source: null
      }
    };
    const overlay = new Overlay(options);
    const closer = $(popup).find('a');
    this.map.addOverlay(overlay);
    $('#map').css('cursor', 'crosshair');
    const me = this;
    this.map.once('singleclick', function (evt) {
      const coordinate = evt.coordinate;
      let hdms = toStringHDMS(transform(coordinate, 'EPSG:3857', 'EPSG:4326'));
      hdms = hdms.split(' ').join('');
      hdms = hdms.replace('N', 'N ');
      hdms = hdms.replace('S', 'S ');
      const content = $(popup).find('.ol-popup-content');
      content.html('<code>' + hdms + '</code>');
      overlay.setPosition(coordinate);
      $('#map').css('cursor', 'default');
      me.eventService.call(Events.MAP_STATE_MOVE);
    });
    closer.on('click', (event) => {
      overlay.setPosition(undefined);
      closer.blur();
      return false;
    });
  }

  rotate(radians: number) {
    this.map.getView().setRotation(radians);
  }

  setMapFromUserPreferences(): Observable<any> {
    const observable = new Observable((observer) => {
      this.user.subscribe((user) => {
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
    });
    return observable;
  }

  loadMap() {
    const map = new Map({
      target: 'map',
      controls: defaults({
        attributionOptions: /** @type {ol.control.AttributionOptions} */ {
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
      map.on(Events.OL_MAP_POSTRENDER, (event) => {
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
        error => this.log.error('Error while getting current position: ' + JSON.stringify(error)),
        {
          enableHighAccuracy: true
        }
      );
    }
  }

  getBingLayer(key: string, type: string, opacity: number, visible: boolean) {
    const l = new Tile(
      {
        visible: visible,
        opacity: opacity,
        preload: Infinity,
        source: new BingMaps({
          key: 'AkI1BkPAQ-KOw7uZLelGWgLQ5Vbxq7-5K8p-2oMsMuboW8wGBMKA6T63GJ1nJVFK',
          imagerySet: type,
          // use maxZoom 19 to see stretched tiles instead of the BingMaps
          // "no photos at this zoom level" tiles
          // maxZoom: 19
        })
      });
    l.set('id', key);
    return l;
  }

  getGoogleLayer(key: string, type: string, opacity: number, visible: boolean) {
    const l = new Tile(
      {
        visible: visible,
        opacity: opacity,
        source: new TileImage(
          {
            url: 'http://khm{0-3}.googleapis.com/kh?v=742&hl=pl&&x={x}&y={y}&z={z}',
            projection: get('EPSG:3857'),
            crossOrigin: '',
            attributions: SETTINGS.VERSION
          })
      });
    l.set('id', key);
    return l;
  }

  getIgnLayer(key: string, type: string, opacity: number, visible: boolean): Base {
    const resolutions = [];
    const matrixIds = [];
    const proj3857 = get('EPSG:3857');
    const maxResolution = getWidth(proj3857.getExtent()) / 256;

    for (let i = 0; i < 18; i++) {
      matrixIds[i] = i.toString();
      resolutions[i] = maxResolution / Math.pow(2, i);
    }

    const tileGrid = new WMTS({
      origin: [-20037508, 20037508],
      resolutions: resolutions,
      matrixIds: matrixIds
    });

    // API key valid for 'openlayers.org' and 'localhost'.
    // Expiration date is 06/29/2018.
    const apiKey = '6i88pkdxubzayoady4upbkjg';

    const ign_source = new WMTSSource({
      url: 'https://wxs.ign.fr/' + apiKey + '/wmts',
      layer: type,
      matrixSet: 'PM',
      format: 'image/jpeg',
      projection: 'EPSG:3857',
      tileGrid: tileGrid,
      style: 'normal',
      attributions: SETTINGS.VERSION + ' <a href="http://www.geoportail.fr/" target="_blank">' +
        '<img src="https://api.ign.fr/geoportail/api/js/latest/' +
        'theme/geoportal/img/logo_gp.gif"></a>',
      crossOrigin: ''
    });

    const ign = new Tile({
      opacity: opacity,
      visible: visible,
      source: ign_source
    });
    ign.set('id', key);

    return ign;
  }

  getLayer(map: Map, id): Base {
    let layer;
    map.getLayers().forEach(function (lyr) {
      if (id === lyr.get('id')) {
        layer = lyr;
      }
    });
    return layer;
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
        this.log.info('sending settings to the server');
        this.userService.update(user).subscribe(
          () => this.log.success('settings saved on the server'),
          (error) => this.log.error('error while sending settings on the server:' + JSON.stringify(error))
        );
      },
      (error) => this.log.error('error while getting current user:' + JSON.stringify(error))
    );
  }

  setOpacity(layerBox: LayerBox, opacity: number) {
    layerBox.layer.setVisible(opacity !== 0);
    layerBox.layer.setOpacity(opacity);
  }

  ngOnDestroy() {
  }
}
