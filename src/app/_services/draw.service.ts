import { Injectable, OnDestroy } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';
import { Subject } from 'rxjs/Subject';
import { MenuEventService } from './menuEvent.service';
import { UserService } from './user.service';
import { MapService } from './map.service';
import {
  Attribution, Feature, Map, style, StyleFunction, View, format,
  tilegrid, proj, extent, control, interaction, source, layer
} from 'openlayers';

import { MapBox } from '../_models/mapBox';
import { LayerBox } from '../_models/layerBox';
import { User } from '../_models/user';
import * as $ from 'jquery';

@Injectable()
export class DrawService implements OnDestroy {
  private map: Map;
  user: User;
  vector: layer.Vector;
  source: source.Vector;
  draw: interaction.Draw;
  modify: interaction.Modify;

  private subscriptions = new Array<Subscription>();
  public color = '#F00';

  mapLoaded(map: Map) {
    this.source = new source.Vector({ wrapX: false });
    this.vector = new layer.Vector({
      source: this.source,
      map: map
    });
    this.map = map;
  }

  constructor(
    private menuEventService: MenuEventService,
    private userService: UserService,
    private mapService: MapService
  ) {
    this.user = this.userService.currentUser();
    const menuEventServiceMapLoaded = this.menuEventService.getObservableAndMissedEvents('mapLoaded');
    menuEventServiceMapLoaded.values.forEach(map => {
      this.mapLoaded(map);
    });
    this.subscriptions.push(menuEventServiceMapLoaded.observable.subscribe(
      (map: Map) => {
        this.mapLoaded(map);
      }
    ));
    this.subscriptions.push(this.menuEventService.getObservable('drawEnd').subscribe(
      () => {
        console.log('drawing stop');
        this.map.removeInteraction(this.draw);
      }
    ));
    this.subscriptions.push(this.menuEventService.getObservable('polyline').subscribe(
      () => {
        console.log('drawing polyline start');
        this.addInteraction('LineString');
      }
    ));
    this.subscriptions.push(this.menuEventService.getObservable('polygon').subscribe(
      () => {
        console.log('drawing polygon start');
        this.addInteraction('Polygon');
      }
    ));
    this.subscriptions.push(this.menuEventService.getObservable('circle').subscribe(
      () => {
        console.log('drawing circle start');
        this.addInteraction('Circle');
      }
    ));
    this.subscriptions.push(this.menuEventService.getObservable('rectangle').subscribe(
      () => {
        console.log('drawing rectangle start');
        this.addInteraction('Rectangle');
      }
    ));
    this.subscriptions.push(this.menuEventService.getObservable('drawVictimPath').subscribe(
      () => {
        console.log('drawing drawVictimPath start');
        this.addInteraction('LineString', '#00F');
      }
    ));
    this.subscriptions.push(this.menuEventService.getObservable('drawK9Path').subscribe(
      () => {
        console.log('drawing drawVictimPath start');
        this.addInteraction('LineString', '#F93');
      }
    ));
    this.subscriptions.push(this.menuEventService.getObservable('edit').subscribe(
      () => {
        console.log('editing features start');
        this.modify = new interaction.Modify({ features: this.source.getFeaturesCollection() });
        this.map.addInteraction(this.modify);
      }
    ));
    this.subscriptions.push(this.menuEventService.getObservable('addLayersFromJson').subscribe(
      (json) => {
        console.log('importing json as draw');
        const geojsonFormat = new format.GeoJSON();
        const features = geojsonFormat.readFeatures(json);
        features.forEach((feature) => {
          feature.setStyle(new style.Style({
            fill: new style.Fill({
              color: feature.get('fill.color')
            }),
            stroke: new style.Stroke({
              color: feature.get('stroke.color'),
              width: feature.get('stroke.width')
            })
          }));
        });
        this.source.addFeatures(features);
        this.map.getView().fit(this.source.getExtent());
      }
    ));
    this.subscriptions.push(this.menuEventService.getObservable('loadGPX').subscribe(
      (gpx) => {
        console.log('importing json as draw');
        const gpxFormat = new format.GPX();
        const features = gpxFormat.readFeatures(gpx, { dataProjection: 'EPSG:4326', featureProjection: 'EPSG:3857' });
        const rgb = this.hexToRgb(this.color);
        features.forEach((feature) => {
          feature.setStyle(new style.Style({
            fill: new style.Fill({
              color: 'rgba(' + rgb.r + ',' + rgb.g + ',' + rgb.b + ', 0.5)'
            }),
            stroke: new style.Stroke({
              color: this.color,
              width: 3
            })
          }));
          feature.set('fill.color', 'rgba(' + rgb.r + ',' + rgb.g + ',' + rgb.b + ', 0.5)');
          feature.set('stroke.color', this.color);
          feature.set('stroke.width', 3);
        });
        this.source.addFeatures(features);
        this.map.getView().fit(this.source.getExtent());
      }
    ));
  }

  // lineStringStyle(feature): style.Style {
  //   return new style.Style();
  // }

  addInteraction(type, color?: string) {
    this.map.removeInteraction(this.draw);
    let options: olx.interaction.DrawOptions;
    if (type === 'Rectangle') {
      options = {
        source: this.source,
        type: 'Circle',
        geometryFunction: interaction.Draw.createBox()
      };
    } else {
      options = {
        source: this.source,
        type: type
      };
    }
    this.draw = new interaction.Draw(options);
    this.draw.on('drawend', (event: interaction.Draw.Event) => {
      if (color === undefined) {
        color = this.color;
      }
      const rgb = this.hexToRgb(this.color);
      // const func: StyleFunction = (feature: Feature, resolution: number) => {
      //   return this.lineStringStyle(feature);
      // };
      event.feature.set('fill.color', 'rgba(' + rgb.r + ',' + rgb.g + ',' + rgb.b + ', 0.5)');
      event.feature.set('stroke.color', color);
      event.feature.set('stroke.width', 3);
      event.feature.setStyle(new style.Style({
        fill: new style.Fill({
          color: 'rgba(' + rgb.r + ',' + rgb.g + ',' + rgb.b + ', 0.5)'
        }),
        stroke: new style.Stroke({
          color: color,
          width: 3
        })
      }));
    });
    $(document).keydown((e) => {
      if (e.which === 27) {
        this.draw.removeLastPoint();
      } else if (e.which === 46) {
        this.map.removeInteraction(this.draw);
      }

    });
    this.map.addInteraction(this.draw);
  }

  hexToRgb(hex: string) {
    // Expand shorthand form (e.g. "03F") to full form (e.g. "0033FF")
    const shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
    hex = hex.replace(shorthandRegex, function (m, r, g, b) {
      return r + r + g + g + b + b;
    });

    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : null;
  }

  getGeoJson(): any {
    const geojsonFormat = new format.GeoJSON();
    const json = geojsonFormat.writeFeatures(this.source.getFeatures());
    return json;
  }

  ngOnDestroy() {
    this.subscriptions.forEach(subscription => {
      subscription.unsubscribe();
    });
  }
}
