import { Component, OnInit, OnDestroy } from '@angular/core';
import { MenuEventService, CanimapService, FileService } from '../_services/index';
import { Subscription } from 'rxjs/Subscription';

import * as L from 'leaflet';
import * as $ from 'jquery';
import 'leaflet-polylinedecorator';
// import * as N from 'leaflet-illustrate';

import { Map, Polyline, Polygon, Layer, FeatureGroup, Path, LayerEvent, LeafletEvent, LocationEvent } from 'leaflet';
import { FontAwesomeOptions, FontAwesomeIcon } from 'ngx-leaflet-fa-markers/index';

@Component({
  selector: 'app-canimap',
  templateUrl: './canimap.component.html',
  styleUrls: ['./canimap.component.css']
})
export class CanimapComponent implements OnInit {
  map: Map;
  title = 'app';
  color = 'red';
  savedColor: string;
  opacity = 0.5;
  currentLocation: any = null;
  success: Function;
  public geoJson: any[] = new Array();
  private subscriptions = new Array<Subscription>();

  get layers() {
    const layers = new Array<L.TileLayer>();
    [this.googleHybride, this.ignMap, this.googleSatellite].forEach(layer => {
      if (layer.options.opacity > 0) {
        layers.push(layer);
      }
    });
    return layers;
  }

  googleHybride = L.tileLayer('https://{s}.google.com/vt/lyrs=s,h&x={x}&y={y}&z={z}', {
    maxZoom: 20,
    subdomains: ['mt0', 'mt1', 'mt2', 'mt3'],
    opacity: 0
  });
  googleSatellite = L.tileLayer('https://{s}.google.com/vt/lyrs=s&x={x}&y={y}&z={z}', {
    maxZoom: 20,
    subdomains: ['mt0', 'mt1', 'mt2', 'mt3'],
    opacity: 0
  });
  ignMap = L.tileLayer('https://wxs.ign.fr/' +
    '6i88pkdxubzayoady4upbkjg' + '/geoportail/wmts?SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER=' +
    'GEOGRAPHICALGRIDSYSTEMS.MAPS.SCAN25TOUR' + '&STYLE=normal&TILEMATRIXSET=PM&TILEMATRIX={z}&TILEROW={y}&TILECOL={x}&FORMAT=image%2Fjpeg',
    { opacity: 1 });

  options = {
    layers: this.layers,
    zoom: 15,
    center: L.latLng([45.419364, 5.347022])
  };
  featureGroup = new L.FeatureGroup();
  iconOption: FontAwesomeOptions = {
    iconClasses: 'fa fa-info-circle', // you _could_ add other icon classes, not tested.
    // iconColor: '#F00',
    iconUrl: '../assets/marker-icon.png',
    shadowUrl: '../assets/marker-shadow.png'
  };
  icon = new FontAwesomeIcon(this.iconOption);

  drawOptions = {
    position: 'topleft',
    featureGroup: this.featureGroup,
    draw: {
      marker: {
        icon: this.icon,
        draggable: true
      },
      polyline: true,
      circle: {
        shapeOptions: {
          color: '#aaaaaa'
        }
      }
    }
  };

  constructor(
    private menuEventService: MenuEventService,
    private canimapService: CanimapService,
    private fileService: FileService) {
  }

  ngOnInit() {
  }

  onValueChanged(event: any) {
    console.log('received opacity change for:' + event.target + ' new value: ' + event.value);
    switch (event.target) {
      case 'ign':
        this.ignMap.setOpacity(event.value);
        break;
      case 'google':
        this.googleSatellite.setOpacity(event.value);
        break;
      case 'hybride':
        this.googleHybride.setOpacity(event.value);
        break;
      default:
        console.log('no layer found: ' + event.target);
        break;
    }
  }

  onMapReady(map: Map) {
    this.map = map;
    this.canimapService.map = map;
    this.canimapService.subscribe();
    this.fileService.subscribe();
    this.canimapService.geoJSON = this.geoJson;
    this.canimapService.layers = [
        {name: 'ign', layer: this.ignMap},
        {name: 'google hybride', layer: this.googleHybride},
        {name: 'google sattelite', layer: this.googleSatellite}
    ];

    // const textbox = N.Illustrate.textbox(L.latLng(41, -87), {}).addTo(map);
    // textbox.addTo(map);

    this.subscriptions.push(this.menuEventService.getObservable('drawVictimPath').subscribe(
      (value) => {
        this.success = value.success;
        this.savedColor = this.color;
        this.color = 'blue';
        $('.leaflet-draw-draw-polyline')[0].click();
      },
      e => console.log(e),
      () => console.log('onCompleted')
    ));

    this.subscriptions.push(this.menuEventService.getObservable('drawK9Path').subscribe(
      (value) => {
        this.success = value.success;
        this.savedColor = this.color;
        this.color = 'orange';
        $('.leaflet-draw-draw-polyline')[0].click();
      },
      e => console.log(e),
      () => console.log('onCompleted')
    ));

    this.map.on(L.Draw.Event.EDITED, (e: L.DrawEvents.Edited) => {
      this.map.fitBounds(this.map.getBounds());
    });

    this.map.on(L.Draw.Event.CREATED, (e: L.DrawEvents.Created) => {
      try {
        this.success();
        const layer: Layer = e.layer;
        if (e.layerType === 'polyline') {
          const polyline: Polyline = <Polyline>layer;
          let json: any = polyline.toGeoJSON();
          json['properties'] = {color: this.color};
          this.geoJson.push(json);
          polyline.setStyle({ color: this.color });
          const polylineDecoratorOptions = {
            patterns: [
              { offset: 20, repeat: 50,
                symbol: L.Symbol.arrowHead({ pixelSize: 10, polygon: true, pathOptions: { stroke: true, color: this.color } }) }
            ]
          };
          const featureGroup = <FeatureGroup>L.polylineDecorator(polyline, polylineDecoratorOptions);
          this.map.addLayer(featureGroup);
          json = featureGroup.toGeoJSON();
          json['properties'] = {color: this.color};
          this.geoJson.push(json);
          this.color = this.savedColor;
        }
        this.map.addLayer(layer);
    } catch (e) {
        console.log(e);
      }
    });

    setTimeout(function () {
      $('.leaflet-draw-toolbar')
      .first()
      .prepend('<a class="leaflet-draw-draw-color" title="Change color"><span class="sr-only">Change color</span></a>');
      $('.leaflet-draw-draw-color')
      .append($('.colorpicker'));
    }, 500);
  }
}
