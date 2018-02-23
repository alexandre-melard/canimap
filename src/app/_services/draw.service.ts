import { Injectable, OnDestroy } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';
import { Subject } from 'rxjs/Subject';
import { MenuEventService } from './menuEvent.service';
import { MapService } from './map.service';
import { CaniDrawObjectService } from './caniDrawObject.service';
import {
  Attribution, Feature, Map, Sphere, geom, style, StyleFunction, View, format,
  tilegrid, proj, extent, control, interaction, source, layer
} from 'openlayers';
import * as ol from 'openlayers';

import { MapBox } from '../_models/mapBox';
import { LayerBox } from '../_models/layerBox';
import { CaniDraw } from '../_models/caniDraw';
import { CaniStyle } from '../_models/caniStyle';
import { Tooltip } from '../_utils/map-tooltip';
import { drawInteractions } from '../_consts/drawings';
import { SETTINGS } from '../_consts/settings';
import { styleFunction } from '../_utils/map-style';
import { hexToRgb } from '../_utils/color-hex-to-rgb';
import { CaniDrawObject } from '../_models/caniDrawObject';
import { LogService } from '../_services/log.service';

import * as $ from 'jquery';

@Injectable()
export class DrawService implements OnDestroy {
  private map: Map;
  vector: layer.Vector;
  source: source.Vector;
  modify: interaction.Modify;
  select: interaction.Select;
  delete: interaction.Select;
  snap: interaction.Snap;
  tooltip = new Tooltip();
  private watchId;
  private track: ol.geom.LineString;

  private subscriptions = new Array<Subscription>();
  public color = '#F00';

  configureFeature(draw: CaniDraw) {
    draw.interaction.on('drawstart', (event: interaction.Draw.Event) => {
      this.tooltip.sketch = event.feature;
    });
    draw.interaction.on('drawend', (event: interaction.Draw.Event) => {
      const feature = event.feature;
      feature.set('style', draw.style(this.color));
      this.tooltip.sketch = null;
      this.tooltip.resetTooltips(this.map);
      this.menuEventService.callEvent('move', null);
      this.menuEventService.callEvent('drawend', {feature: feature, draw: draw});
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
    // this.select.on('change:active', () => {
    //   selectedFeatures.forEach(selectedFeatures.remove, selectedFeatures);
    // });
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

    this.delete = new interaction.Select();
    map.addInteraction(this.delete);
    this.delete.setActive(false);
    const deletedFeatures = this.delete.getFeatures();
    this.delete.on('change:active', () => {
      deletedFeatures.forEach(deletedFeatures.remove, deletedFeatures);
    });
    this.delete.on('select', (selectEvent: interaction.Select.Event) => {
      while (selectEvent.selected.length > 0) {
        this.source.removeFeature(selectEvent.selected.pop());
      }
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
    this.delete.setActive(false);
    this.modify.setActive(false);
    this.tooltip.deleteTooltips(this.map);
  }

  getDrawInteraction(type: string): interaction.Draw {
    return drawInteractions.find((drawInteraction) => drawInteraction.type === type).interaction;
  }

  enableDrawInteraction(type: string) {
    this.disableInteractions();
    this.getDrawInteraction(type).setActive(true);
    this.tooltip.createTooltips(this.map, null);
  }

  constructor(
    private menuEventService: MenuEventService,
    private caniDrawObjectService: CaniDrawObjectService,
    private mapService: MapService,
    private logService: LogService
  ) {
    const me = this;
    const menuEventServiceMapLoaded = this.menuEventService.getObservableAndMissedEvents('mapLoaded');
    menuEventServiceMapLoaded.values.forEach(map => {
      me.mapLoaded(map);
    });
    this.subscriptions.push(menuEventServiceMapLoaded.observable.subscribe(
      (map: Map) => {
        me.mapLoaded(map);
      }
    ));
    this.subscriptions.push(this.menuEventService.getObservable('move').subscribe(
      () => {
        console.log('drawing stop');
        me.menuEventService.callEvent('disableInteractions', null);
      }
    ));
    drawInteractions.forEach((drawInteraction) => {
      this.subscriptions.push(this.menuEventService.getObservable(drawInteraction.event).subscribe(
        () => {
          console.log('drawing ' + drawInteraction.type);
          me.enableDrawInteraction(drawInteraction.type);
        }
      ));
    });
    this.subscriptions.push(this.menuEventService.getObservable('disableInteractions').subscribe(
      () => {
        this.disableInteractions();
      }
    ));
    this.subscriptions.push(this.menuEventService.getObservable('edit').subscribe(
      () => {
        this.disableInteractions();
        this.select.setActive(true);
        this.modify.setActive(true);
      }
    ));
    this.subscriptions.push(this.menuEventService.getObservable('delete').subscribe(
      () => {
        this.disableInteractions();
        this.delete.setActive(true);
      }
    ));
    this.subscriptions.push(this.menuEventService.getObservable('addLayersFromJson').subscribe(
      (json) => {
        json = JSON.parse(json);
        let features = new Array<ol.Feature>();
        console.log('importing 1json as draw');
        let i = 0;
        const toDelete = new Array();
        json.features.forEach((f) => {
          if (f.geometry.type === 'Circle') {
            const feature = new ol.Feature(new ol.geom.Circle(f.geometry.coordinates.center, f.geometry.coordinates.radius));
            feature.set('style', f.properties.style);
            features.push(feature);
            toDelete.push(i++);
          }
        });
        // Delete circles features
        while (toDelete.length > 0) {
          json.features.splice(toDelete.pop(), 1);
        }

        const geojsonFormat = new format.GeoJSON();
        features = features.concat(geojsonFormat.readFeatures(json));
        features.forEach((f: Feature) => {
          const properties = f.getProperties();
          let lStyle;
          drawInteractions.forEach((draw) => {
            if (
              (draw.type === f.getGeometry().getType())
              ||
              ((properties.style.type !== undefined) && (draw.type === properties.style.type))) {
                lStyle = properties.style;
            }
          });
          f.set('style', lStyle);
          if ((f.getGeometry().getType() === 'Point') &&
          (f.getProperties().type !== undefined) &&
          (f.getProperties().type === 'RuObject')) {
            console.log('found object');
            me.menuEventService.callEvent('registerObject', f);
          }

        });
        me.source.addFeatures(features);
        me.map.getView().fit(me.source.getExtent());
      }
    ));
    this.subscriptions.push(this.menuEventService.getObservable('getKML').subscribe(
      (success: Function) => {
        console.log('converting drawings to KML');
        const kmlFormat = new format.KML();
        const kml = kmlFormat.writeFeatures(me.source.getFeatures(),
        {
          dataProjection: 'EPSG:4326',
          featureProjection: 'EPSG:3857'
        });
        success(kml);
      }
    ));
    this.subscriptions.push(this.menuEventService.getObservable('getGPX').subscribe(
      (success: Function) => {
        console.log('converting drawings to GPX');
        const gpxFormat = new format.GPX();
        const gpx = gpxFormat.writeFeatures(me.source.getFeatures(),
        {
          dataProjection: 'EPSG:4326',
          featureProjection: 'EPSG:3857'
        });
        success(gpx);
      }
    ));
    this.subscriptions.push(this.menuEventService.getObservable('getGeoJson').subscribe(
      (success: Function) => {
        console.log('converting drawings to geoJson');
        const geojsonFormat = new format.GeoJSON();
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
          circles[i].geometry = { type: 'Circle', coordinates: coords[i] };
        }
        success(JSON.stringify(json));
      }
    ));
    this.subscriptions.push(this.menuEventService.getObservable('saveAsPng').subscribe(
      (success: Function) => {
        console.log('converting drawings to png');
        me.map.once('postcompose', function (event) {
          const canvas = event.context.canvas;
          canvas.setAttribute('crossOrigin', 'anonymous');
          canvas.toBlob(function (blob) {
            success(blob);
          });
        });
        me.map.renderSync();
      }
    ));
    this.subscriptions.push(this.menuEventService.getObservable('loadGPS').subscribe(
      (gps: { content, type }) => {
        console.log('importing gps path as draw');
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
        const rgb = hexToRgb(me.color);
        features.forEach((feature: ol.Feature) => {
          const lStyle = drawInteractions.find((draw) => (draw.type === 'LineStringGps')).style;
          if (feature.getGeometry().getType() === 'MultiLineString') {
            (<geom.MultiLineString>feature.getGeometry()).getLineStrings().forEach((lineStringGeom: geom.LineString) => {
              const feat = new Feature(lineStringGeom);
              feat.set('style', lStyle(this.color));
              me.source.addFeature(feat);
            });
          } else {
            feature.set('style', lStyle(this.color));
            me.source.addFeature(feature);
          }
          if ((feature.getGeometry().getType() === 'Point') &&
          (feature.getProperties().type !== undefined) &&
          (feature.getProperties().type === 'RuObject')) {
            console.log('found object');
            me.menuEventService.callEvent('registerObject', feature);
          }
        });
        me.map.getView().fit(me.source.getExtent());
      }
    ));
    this.subscriptions.push(this.menuEventService.getObservable('recordTrack').subscribe(
      (status: Function) => {
        if (status) {
          this.logService.info('starting track recording');
          me.watchId = navigator.geolocation.watchPosition((position) => {
            console.log(position.coords);
            const lat = position.coords.latitude;
            const lng = position.coords.longitude;
            const coords = ol.proj.transform([lng, lat], 'EPSG:4326', 'EPSG:3857');
            me.map.getView().setCenter(coords);
            if (me.track !== undefined && me.track.getCoordinates().length > 0) {
              const coordinates = me.track.getCoordinates();
              const lastCoordinates = coordinates[coordinates.length - 1];
              let tmpLine = new ol.geom.LineString([lastCoordinates, coords]);
              if (tmpLine.getLength() > SETTINGS.TRACK.FREQUENCY) {
                coordinates.push(coords);
                me.track.setCoordinates(coordinates);
              }
              tmpLine = undefined;
            } else {
              // First coordinates
              me.track = new ol.geom.LineString([coords]);
              const lStyle = drawInteractions.find((draw) => (draw.type === 'LineStringGps')).style;
              const feature = new ol.Feature({geometry: me.track});
              feature.set('style', lStyle(SETTINGS.TRACK.COLOR));
              me.source.addFeature(feature);
            }
          },
          (failure) => {
          },
          {
            enableHighAccuracy: true
          });
        } else {
          this.logService.success('stopping track recording');
          navigator.geolocation.clearWatch(this.watchId);
          this.menuEventService.callEvent('fileSave', null);
          this.track = undefined;
        }
      }
    ));
    this.subscriptions.push(this.menuEventService.getObservable('addObjectToTrack').subscribe(
      () => {
        console.log('add object on track');
        navigator.geolocation.getCurrentPosition((position) => {
          console.log(position.coords);
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
    }));
  }

  ngOnDestroy() {
    this.subscriptions.forEach(subscription => {
      subscription.unsubscribe();
    });
  }
}
