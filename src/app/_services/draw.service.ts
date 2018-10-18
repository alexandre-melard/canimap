import { Injectable, OnDestroy } from '@angular/core';
import { Observable ,  Subscription ,  Subject } from 'rxjs';
import { EventService } from './event.service';
import { CaniDrawObjectService } from './caniDrawObject.service';

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
import { formatLength } from '../_utils/map-format-length';
import { MapService } from './map.service';
import { Events } from '../_consts/events';
import { writeScaleToCanvas } from '../_utils/write-scale-to-canvas';

declare var $;

@Injectable()
export class DrawService implements OnDestroy {
  private map: ol.Map;
  vector: ol.layer.Vector;
  source: ol.source.Vector;
  modify: ol.interaction.Modify;
  select: ol.interaction.Select;
  delete: ol.interaction.Select;
  snap: ol.interaction.Snap;
  tooltip = new Tooltip();
  private watchId;
  private track: ol.geom.LineString;

  public color = '#F00';

  constructor(
    private eventService: EventService,
    private caniDrawObjectService: CaniDrawObjectService,
    private mapService: MapService,
    private logService: LogService
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
      this.eventService.call(Events.MAP_DRAW_FEATURE_CREATED, { feature: feature, draw: draw });
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
    this.source = new ol.source.Vector({ wrapX: false });
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
    const selectedFeatures = this.select.getFeatures();
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
        console.log('drawing stop');
        me.eventService.call(Events.MAP_DRAW_INTERACTIONS_DISABLE);
      }
    );
    drawInteractions.forEach((drawInteraction) => {
      this.eventService.subscribe(drawInteraction.event,
        () => {
          console.log('drawing ' + drawInteraction.type);
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
      (jsonStr: string) => {
        const json = JSON.parse(jsonStr);
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
            console.log('found object');
            me.eventService.call(Events.MAP_DRAW_OBJECT_REGISTER, f);
          }

        });
        me.source.addFeatures(features);
        me.map.getView().fit(me.source.getExtent());
      }
    );
    this.eventService.subscribe(Events.MAP_DRAW_KML_EXPORT,
      (success: Function) => {
        console.log('converting drawings to KML');
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
        console.log('converting drawings to GPX');
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
        console.log('converting drawings to geoJson');
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
          circles[i].geometry = { type: 'Circle', coordinates: coords[i] };
        }
        success(JSON.stringify(json));
      }
    );
    this.eventService.subscribe(Events.MAP_DRAW_PNG_EXPORT,
      (success: Function) => {
        console.log('converting drawings to png');
        me.map.once('postcompose', function (event: ol.render.Event) {
          let canvas = event.context.canvas;
          canvas.setAttribute('crossOrigin', 'anonymous');
          const olscale = $('.ol-scale-line-inner');
          canvas = writeScaleToCanvas(event, canvas, olscale);
          canvas.toBlob(function (blob) {
            success(blob);
          });
        });
        me.map.renderSync();
      }
    );
    this.eventService.subscribe(Events.MAP_DRAW_GPS_IMPORT,
      (gps: { content, type }) => {
        console.log('importing gps path as draw');
        let f;
        switch (gps.type) {
          case 'gpx':
            f = new ol.format.GPX();
            break;
          case 'kml':
            f = new ol.format.KML();
            break;
        }
        const features = f.readFeatures(gps.content, { dataProjection: 'EPSG:4326', featureProjection: 'EPSG:3857' });
        const rgb = hexToRgb(me.color);
        features.forEach((feature: ol.Feature) => {
          const lStyle = drawInteractions.find((draw) => (draw.type === 'LineStringGps')).style;
          if (feature.getGeometry().getType() === 'MultiLineString') {
            (<ol.geom.MultiLineString>feature.getGeometry()).getLineStrings().forEach((lineStringGeom: ol.geom.LineString) => {
              const feat = new ol.Feature(lineStringGeom);
              feat.set('style', lStyle(this.color));
              me.source.addFeature(feat);
            });
          } else {
            feature.set('style', lStyle(this.color));
            me.source.addFeature(feature);
          }
          if ((feature.getGeometry().getType() === 'Point') && feature.getProperties().type &&
            (feature.getProperties().type === 'RuObject')) {
            console.log('found object');
            me.eventService.call(Events.MAP_DRAW_OBJECT_REGISTER, feature);
          }
        });
        me.map.getView().fit(me.source.getExtent());
      }
    );
    this.eventService.subscribe(
      Events.MAP_DRAW_TRACK_RECORD,
      (status: Function) => {
        if (status) {
          this.logService.info('starting track recording');
          me.source.clear();
          me.track = null;
          let first = true;
          me.watchId = navigator.geolocation.watchPosition((position) => {
            console.log(position.coords);
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
                const feature = new ol.Feature({ geometry: me.track });
                feature.set('style', lStyle(SETTINGS.TRACK.COLOR));
                me.source.addFeature(feature);
              } else {
                const coordinates = me.track.getCoordinates();
                const lastCoordinates = coordinates[coordinates.length - 1];
                let tmpLine = new ol.geom.LineString([lastCoordinates, coords]);
                if (tmpLine.getLength() > SETTINGS.TRACK.FREQUENCY) {
                  coordinates.push(coords);
                  me.track.setCoordinates(coordinates);
                  me.logService.info('Longueur: ' + formatLength(me.track), true);
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
          this.logService.success('stopping track recording');
          navigator.geolocation.clearWatch(this.watchId);
          this.eventService.call(Events.MAP_FILE_SAVE, null);
          this.track = undefined;
        }
      }
    );
    this.eventService.subscribe('addObjectToTrack',
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
      });
    console.log('draw loaded');
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
