import { Injectable, OnDestroy } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';
import { Subject } from 'rxjs/Subject';
import { MenuEventService } from './menuEvent.service';
import { UserService } from './user.service';
import { Attribution, Map, View, tilegrid, proj, extent, control, source, layer } from 'openlayers';

import { MapBox } from '../_models/mapBox';
import { LayerBox } from '../_models/layerBox';
import { User } from '../_models/user';

@Injectable()
export class MapService implements OnDestroy {
  private map: ol.Map;
  user: User;
  private subject = new Subject<any>();
  private keepAfterNavigationChange = false;
  private subscriptions = new Array<Subscription>();

  get layerBoxes(): LayerBox[] {
    return [this.ignPlan, this.ignSatellite, this.googleSatellite, this.bingHybride, this.bingSatellite];
  }

  googleSatellite = new LayerBox(
    'googleSatellite',
    'Google Satellite',
    this.getGoogleLayer('googleSatellite', 's')
  );
  bingSatellite = new LayerBox(
    'bingSatellite',
    'Bing Satellite',
    this.getBingLayer('bingSatellite', 'Aerial')
  );
  bingHybride = new LayerBox(
    'bingHybride',
    'Bing Hybride',
    this.getBingLayer('bingHybride', 'AerialWithLabels')
  );
  ignPlan = new LayerBox(
    'ignPlan',
    'IGN Topo',
    this.getIgnLayer('ignPlan', 'GEOGRAPHICALGRIDSYSTEMS.MAPS')
  );
  ignSatellite = new LayerBox(
    'ignSatellite',
    'IGN Photo Aeriennes',
    this.getIgnLayer('ignSatellite', 'ORTHOIMAGERY.ORTHOPHOTOS')
  );

  constructor(
    private menuEventService: MenuEventService,
    private userService: UserService
  ) {
    this.user = this.userService.currentUser();
    this.subscriptions.push(this.menuEventService.getObservable('mapMove').subscribe(
      (coords) => {
        console.log('map move to :', JSON.stringify(coords));
        this.map.getView().setCenter(proj.fromLonLat([coords.lng, coords.lat]));
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
          this.user.mapBoxes.slice(this.user.mapBoxes.lastIndexOf( m ), 1);
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
    const map = new Map({
      target: 'map',
      controls: control.defaults({
        attributionOptions: /** @type {olx.control.AttributionOptions} */ ({
          collapsible: false
        })
      }),
      loadTilesWhileAnimating: false,
      view: new View({
        zoom: 15,
        center: proj.transform([5.347022, 45.419364], 'EPSG:4326', 'EPSG:3857')
      })
    });

    this.setMapFromUserPreferences();

    this.layerBoxes.map(layerBox => map.addLayer(layerBox.layer));

    this.map = map;
    this.menuEventService.callEvent('mapLoaded', map);
  }

  getBingLayer(key: string, type: string) {
    const l = new layer.Tile(
      {
        visible: false,
        opacity: 0,
        preload: Infinity,
        source: new source.BingMaps({
          key: 'AkI1BkPAQ-KOw7uZLelGWgLQ5Vbxq7-5K8p-2oMsMuboW8wGBMKA6T63GJ1nJVFK',
          // key: 'Anx1E8hu2hbq_faVPR_tOe-umWyZsOgtB64ruHLNdoMwYY-Rg2FUmMA5g7i1dSy8',
          imagerySet: type
          // use maxZoom 19 to see stretched tiles instead of the BingMaps
          // "no photos at this zoom level" tiles
          // maxZoom: 19
        })
      });
    l.set('id', key);
    return l;
  }

  getGoogleLayer(key: string, type: string) {
    const l = new layer.Tile(
      {
        visible: false,
        opacity: 0,
        source: new source.TileImage(
          {
            url: 'http://khm{0-3}.googleapis.com/kh?v=742&hl=pl&&x={x}&y={y}&z={z}',
            projection: proj.get('EPSG:3857')
          })
      });
    l.set('id', key);
    return l;
  }

  getIgnLayer(key: string, type: string): layer.Base {
    const resolutions = [];
    const matrixIds = [];
    const proj3857 = proj.get('EPSG:3857');
    const maxResolution = extent.getWidth(proj3857.getExtent()) / 256;

    for (let i = 0; i < 18; i++) {
      matrixIds[i] = i.toString();
      resolutions[i] = maxResolution / Math.pow(2, i);
    }

    const tileGrid = new tilegrid.WMTS({
      origin: [-20037508, 20037508],
      resolutions: resolutions,
      matrixIds: matrixIds
    });

    // API key valid for 'openlayers.org' and 'localhost'.
    // Expiration date is 06/29/2018.
    const apiKey = '6i88pkdxubzayoady4upbkjg';

    const ign_source = new source.WMTS({
      url: 'https://wxs.ign.fr/' + apiKey + '/wmts',
      layer: type,
      matrixSet: 'PM',
      format: 'image/jpeg',
      projection: 'EPSG:3857',
      tileGrid: tileGrid,
      style: 'normal',
      attributions: [new Attribution({
        html: '<a href="http://www.geoportail.fr/" target="_blank">' +
        '<img src="https://api.ign.fr/geoportail/api/js/latest/' +
        'theme/geoportal/img/logo_gp.gif"></a>'
      })]
    });

    const ign = new layer.Tile({
      visible: true,
      source: ign_source
    });
    ign.set('id', key);

    return ign;
  }

  getLayer(map: Map, id): layer.Base {
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
