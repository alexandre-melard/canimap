import { Injectable, OnDestroy } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';
import { Subject } from 'rxjs/Subject';
import { MenuEventService } from './menuEvent.service';
import { UserService } from './user.service';
import * as ol from 'openlayers';

import { MapBox } from '../_models/mapBox';
import { LayerBox } from '../_models/layerBox';
import { User } from '../_models/user';
import * as $ from 'jquery';

@Injectable()
export class MapService implements OnDestroy {
  private map: ol.Map;
  private subject = new Subject<any>();
  private keepAfterNavigationChange = false;
  private subscriptions = new Array<Subscription>();
  private overlay: ol.Overlay;
  private gpsHandler: ol.EventsKey;

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

  _user: User;

  get user(): User {
    if (this._user === undefined || this._user === null) {
      this._user = this.userService.currentUser();
    }
    return this._user;
  }

  constructor(
    private menuEventService: MenuEventService,
    private userService: UserService
  ) {
    this.subscriptions.push(this.menuEventService.getObservable('mapMove').subscribe(
      (coords) => {
        console.log('map move to :', JSON.stringify(coords));
        this.map.getView().setCenter(ol.proj.fromLonLat([coords.lng, coords.lat]));
        coords.success();
      }
    ));
    this.subscriptions.push(this.menuEventService.getObservable('addMarker').subscribe(
      (coords) => {
        console.log('map add marker to :', JSON.stringify(coords));
        const iconFeature = new ol.Feature({
          geometry: new ol.geom.Point(ol.proj.fromLonLat([coords.lng, coords.lat])),
        });
        iconFeature.setStyle(new ol.style.Style({
          image: new ol.style.Circle({
            radius: 10,
            stroke: new ol.style.Stroke({
              color: 'purple',
              width: 2
            }),
            fill: new ol.style.Fill({
              color: 'rgba(255,0,0,0.5)'
            })
          })
        }));
        this.map.addLayer(new ol.layer.Vector({ source: new ol.source.Vector({ features: [iconFeature] }) }));
      }
    ));
    this.subscriptions.push(this.menuEventService.getObservable('gpsMarker').subscribe(
      () => {
        console.log('drawing gpsMarker start');
        this.menuEventService.callEvent('disableInteractions');
        const options = {
          element: $('#popup').get(0),
          autoPan: true,
          offset: [0, -25],
          autoPanAnimation: {
            duration: 250,
            source: null
          }
        };
        const overlay = new ol.Overlay(options);
        this.map.addOverlay(overlay);
        $('#map').css('cursor', 'crosshair');
        const me = this;
        this.gpsHandler = <ol.EventsKey>me.map.on('singleclick', function (evt) {
          const coordinate = evt.coordinate;
          let hdms = ol.coordinate.toStringHDMS(ol.proj.transform(
            coordinate, 'EPSG:3857', 'EPSG:4326'));
          hdms = hdms.split(' ').join('');
          hdms = hdms.replace('N', 'N ');
          hdms = hdms.replace('S', 'S ');
          $('#popup-content').html('<code>' + hdms + '</code>');
          overlay.setPosition(coordinate);
        });
        this.overlay = overlay;
      }
    ));
    this.subscriptions.push(this.menuEventService.getObservable('gpsMarkerDismiss').subscribe(
      () => {
        console.log('drawing gpsMarkerDismiss start');
        $('#map').css('cursor', '');
        ol.Observable.unByKey(this.gpsHandler);
        this.overlay.setPosition(undefined);
      }
    ));
  }

  setMapFromUserPreferences() {
    if (this.user.mapBoxes !== undefined) {
      this.user.mapBoxes.forEach(m => {
        const layerBox = this.layerBoxes.find(l => m.key === l.key);
        if (layerBox !== undefined) {
          layerBox.layer.setOpacity(m.opacity);
          layerBox.layer.setVisible(m.visible);
        } else {
          // there is a problem with the saved data, removed corrupted entry
          this.user.mapBoxes.slice(this.user.mapBoxes.lastIndexOf(m), 1);
        }
      });
    } else {
      this.user.mapBoxes = new Array<MapBox>();
      this.layerBoxes.forEach(layerBox => {
        this.user.mapBoxes.push(new MapBox(layerBox.key, layerBox.layer.getOpacity(), layerBox.layer.getVisible()));
      });
    }
  }

  loadMap() {
    const map = new ol.Map({
      target: 'map',
      controls: ol.control.defaults({
        attributionOptions: /** @type {olx.control.AttributionOptions} */ ({
          collapsible: false
        })
      }),
      loadTilesWhileAnimating: false,
      view: new ol.View({
        zoom: 15,
        center: ol.proj.transform([5.347022, 45.419364], 'EPSG:4326', 'EPSG:3857')
      })
    });

    this.setMapFromUserPreferences();

    this.layerBoxes.map(layerBox => map.addLayer(layerBox.layer));

    // add slider
    map.addControl(new ol.control.ZoomSlider());

    this.map = map;
    this.menuEventService.callEvent('mapLoaded', map);
  }

  getBingLayer(key: string, type: string, opacity: number, visible: boolean) {
    const l = new ol.layer.Tile(
      {
        visible: visible,
        opacity: opacity,
        preload: Infinity,
        source: new ol.source.BingMaps({
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
    const l = new ol.layer.Tile(
      {
        visible: visible,
        opacity: opacity,
        source: new ol.source.TileImage(
          {
            url: 'http://khm{0-3}.googleapis.com/kh?v=742&hl=pl&&x={x}&y={y}&z={z}',
            projection: ol.proj.get('EPSG:3857'),
            crossOrigin: ''
          })
      });
    l.set('id', key);
    return l;
  }

  getIgnLayer(key: string, type: string, opacity: number, visible: boolean): ol.layer.Base {
    const resolutions = [];
    const matrixIds = [];
    const proj3857 = ol.proj.get('EPSG:3857');
    const maxResolution = ol.extent.getWidth(proj3857.getExtent()) / 256;

    for (let i = 0; i < 18; i++) {
      matrixIds[i] = i.toString();
      resolutions[i] = maxResolution / Math.pow(2, i);
    }

    const tileGrid = new ol.tilegrid.WMTS({
      origin: [-20037508, 20037508],
      resolutions: resolutions,
      matrixIds: matrixIds
    });

    // API key valid for 'openlayers.org' and 'localhost'.
    // Expiration date is 06/29/2018.
    const apiKey = '6i88pkdxubzayoady4upbkjg';

    const ign_source = new ol.source.WMTS({
      url: 'https://wxs.ign.fr/' + apiKey + '/wmts',
      layer: type,
      matrixSet: 'PM',
      format: 'image/jpeg',
      projection: 'EPSG:3857',
      tileGrid: tileGrid,
      style: 'normal',
      attributions: [new ol.Attribution({
        html: '<a href="http://www.geoportail.fr/" target="_blank">' +
        '<img src="https://api.ign.fr/geoportail/api/js/latest/' +
        'theme/geoportal/img/logo_gp.gif"></a>'
      })],
      crossOrigin: ''
    });

    const ign = new ol.layer.Tile({
      opacity: opacity,
      visible: visible,
      source: ign_source
    });
    ign.set('id', key);

    return ign;
  }

  getLayer(map: ol.Map, id): ol.layer.Base {
    let layer;
    map.getLayers().forEach(function (lyr) {
      if (id === lyr.get('id')) {
        layer = lyr;
      }
    });
    return layer;
  }

  saveOpacity() {
    this.layerBoxes.forEach(layerBox => {
      let mapBox = this.user.mapBoxes.find(m => layerBox.key === m.key);
      if (mapBox === undefined) {
        mapBox = new MapBox(layerBox.key, layerBox.layer.getOpacity(), layerBox.layer.getVisible());
        this.user.mapBoxes.push(mapBox);
      }
      mapBox.opacity = layerBox.layer.getOpacity();
      mapBox.visible = layerBox.layer.getVisible();
    });
    this.userService.update(this.user);
  }

  setOpacity(layerBox: LayerBox, opacity: number) {
    layerBox.layer.setVisible(opacity !== 0);
    layerBox.layer.setOpacity(opacity);
  }

  ngOnDestroy() {
    this.subscriptions.forEach(subscription => {
      subscription.unsubscribe();
    });
  }
}
