import { Injectable, OnDestroy } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';
import { Subject } from 'rxjs/Subject';
import { MenuEventService } from './menuEvent.service';
import { UserService } from './user.service';
import { MapService } from './map.service';
import {
  Attribution, Feature, Map, Sphere, geom, style, StyleFunction, View, format,
  tilegrid, proj, extent, control, interaction, source, layer
} from 'openlayers';
import * as ol from 'openlayers';

import { MapBox } from '../_models/mapBox';
import { LayerBox } from '../_models/layerBox';
import { CaniDraw } from '../_models/caniDraw';
import { CaniStyle } from '../_models/caniStyle';
import { User } from '../_models/user';
import { Tooltip } from '../_utils/map-tooltip';
import { drawInteractions } from '../_consts/drawings';

import { styleFunction } from '../_utils/map-style';
import { hexToRgb } from '../_utils/color-hex-to-rgb';
import * as $ from 'jquery';


@Injectable()
export class DrawService implements OnDestroy {
  private map: Map;
  user: User;
  vector: layer.Vector;
  source: source.Vector;
  modify: interaction.Modify;
  select: interaction.Select;
  snap: interaction.Snap;
  tooltip = new Tooltip();
  overlay: ol.Overlay;

  private subscriptions = new Array<Subscription>();
  public color = '#F00';
  private predefinedColor;

  configureFeature(draw: CaniDraw) {
    draw.interaction.on('drawstart', (event: interaction.Draw.Event) => {
      this.tooltip.sketch = event.feature;
    });
    draw.interaction.on('drawend', (event: interaction.Draw.Event) => {
      const feature = event.feature;
      let color = this.color;
      const colorStyle = draw.style.filter((style: CaniStyle) => style.name === 'color');
      if (colorStyle !== undefined && colorStyle.length > 0) {
        color = colorStyle[0].value;
      }
      const rgb = hexToRgb(this.color);
      feature.set('custom.type', draw.type);
      feature.set('fill.color', 'rgba(' + rgb.r + ',' + rgb.g + ',' + rgb.b + ', 0.5)');
      feature.set('stroke.color', color);
      feature.set('stroke.width', 3);
      this.predefinedColor = undefined;
      this.tooltip.sketch = null;
      this.tooltip.resetTooltips(this.map);
    });
    $(document).keydown((e) => {
      if (e.which === 27) {
        draw.interaction.removeLastPoint();
      } else if (e.which === 46) {
        draw.interaction.setActive(false);
      }
    });
  }

  mapLoaded(map: Map) {
    this.source = new source.Vector({ wrapX: false });
    this.vector = new layer.Vector({
      source: this.source,
      style: styleFunction,
      map: map
    });
    drawInteractions.forEach((drawInteraction) => {
      const options: olx.interaction.DrawOptions = {
        source: this.source,
        type: drawInteraction.geometry,
      };
      if (drawInteraction.type === 'Rectangle') {
        options.geometryFunction = interaction.Draw.createBox();
      } else {
      }
      drawInteraction.interaction = new interaction.Draw(options);
      this.configureFeature(drawInteraction);
      map.addInteraction(drawInteraction.interaction);
      drawInteraction.interaction.setActive(false);
    });

    this.select = new interaction.Select();
    map.addInteraction(this.select);
    this.select.setActive(false);
    const selectedFeatures = this.select.getFeatures();
    this.select.on('change:active', () => {
      selectedFeatures.forEach(selectedFeatures.remove, selectedFeatures);
    });
    this.select.on('select', (selectEvent: interaction.Select.Event) => {
      const selected = selectEvent.selected;
      $(document).keydown((e) => {
        if (e.which === 46) {
          while (selected.length > 0) {
            this.source.removeFeature(selectEvent.selected.pop());
          }
        }
      });
    });

    this.modify = new interaction.Modify({
      features: this.select.getFeatures()
    });
    map.addInteraction(this.modify);
    this.modify.setActive(false);

    // The snap interaction must be added after the Modify and Draw interactions
    // in order for its map browser event handlers to be fired first. Its handlers
    // are responsible of doing the snapping.
    this.snap = new interaction.Snap({
      source: this.vector.getSource()
    });
    map.addInteraction(this.snap);
    this.map = map;
  }

  disableInteractions() {
    drawInteractions.map((drawInteraction) => drawInteraction.interaction.setActive(false));
    this.select.setActive(false);
    this.modify.setActive(false);
    this.tooltip.deleteTooltips(this.map);
  }

  getDrawInteraction(type: string): interaction.Draw {
    return drawInteractions.find((drawInteraction) => drawInteraction.type === type).interaction;
  }

  enableDrawInteraction(type: string, color?: string) {
    this.predefinedColor = color;
    this.disableInteractions();
    this.getDrawInteraction(type).setActive(true);
    this.tooltip.createTooltips(this.map, null);
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
    this.subscriptions.push(this.menuEventService.getObservable('move').subscribe(
      () => {
        console.log('drawing stop');
        this.disableInteractions();
      }
    ));
    drawInteractions.forEach((drawInteraction) => {
      this.subscriptions.push(this.menuEventService.getObservable(drawInteraction.event).subscribe(
        () => {
          console.log('drawing ' + drawInteraction.type);
          this.enableDrawInteraction(drawInteraction.type);
        }
      ));
    });
    this.subscriptions.push(this.menuEventService.getObservable('gpsMarker').subscribe(
      () => {
        console.log('drawing gpsMarker start');
        this.disableInteractions();
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
        this.map.on('singleclick', function (evt) {
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
        this.map.un('singleclick', () => { });
        this.overlay.setPosition(undefined);
      }
    ));
    this.subscriptions.push(this.menuEventService.getObservable('edit').subscribe(
      () => {
        this.disableInteractions();
        this.select.setActive(true);
        this.modify.setActive(true);
      }
    ));
    this.subscriptions.push(this.menuEventService.getObservable('addLayersFromJson').subscribe(
      (json) => {
        console.log('importing json as draw');
        const geojsonFormat = new format.GeoJSON();
        const features = geojsonFormat.readFeatures(json);
        this.source.addFeatures(features);
        this.map.getView().fit(this.source.getExtent());
      }
    ));
    this.subscriptions.push(this.menuEventService.getObservable('getGeoJson').subscribe(
      (success: Function) => {
        console.log('converting drawings to geoJson');
        const geojsonFormat = new format.GeoJSON();
        const json = geojsonFormat.writeFeatures(this.source.getFeatures());
        success(json);
      }
    ));
    this.subscriptions.push(this.menuEventService.getObservable('loadGPS').subscribe(
      (gps: { content, type }) => {
        console.log('importing json as draw');
        let f;
        switch (gps.type) {
          case 'gpx':
            f = new format.GPX();
            break;
          case 'kml':
            f = new format.KML();
            break;
        }
        const features = f.readFeatures(gps.content, { dataProjection: 'EPSG:4326', featureProjection: 'EPSG:3857' });
        const rgb = hexToRgb(this.color);
        features.forEach((feature) => {
          if (feature.getGeometry().getType() === 'MultiLineString') {
            (<geom.MultiLineString>feature.getGeometry()).getLineStrings().forEach((lineStringGeom: geom.LineString) => {
              const feat = new Feature(lineStringGeom);
              feat.set('fill.color', 'rgba(' + rgb.r + ',' + rgb.g + ',' + rgb.b + ', 0.5)');
              feat.set('stroke.color', this.color);
              feat.set('stroke.width', 3);
              this.source.addFeature(feat);
            });
          } else {
            feature.set('fill.color', 'rgba(' + rgb.r + ',' + rgb.g + ',' + rgb.b + ', 0.5)');
            feature.set('stroke.color', this.color);
            feature.set('stroke.width', 3);
            this.source.addFeature(feature);
          }
        });
        this.map.getView().fit(this.source.getExtent());
      }
    ));
  }

  ngOnDestroy() {
    this.subscriptions.forEach(subscription => {
      subscription.unsubscribe();
    });
  }
}
