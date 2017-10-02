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

import { MapBox } from '../_models/mapBox';
import { LayerBox } from '../_models/layerBox';
import { User } from '../_models/user';
import * as $ from 'jquery';

class DrawingType {
  type: string;
  draw: interaction.Draw;
}

@Injectable()
export class DrawService implements OnDestroy {
  private map: Map;
  user: User;
  vector: layer.Vector;
  source: source.Vector;
  modify: interaction.Modify;
  select: interaction.Select;
  snap: interaction.Snap;
  drawInteractions: DrawingType[] = [
    { type: 'Point', draw: null },
    { type: 'LineString', draw: null },
    { type: 'Polygon', draw: null },
    { type: 'Rectangle', draw: null },
    { type: 'Circle', draw: null }
  ];

  private subscriptions = new Array<Subscription>();
  public color = '#F00';
  private predefinedColor;


  styleFunction(feature: Feature) {
    const colorGetBrightness = (rgb) => {
      return Math.sqrt(
        rgb.r * rgb.r * 0.299 +
        rgb.g * rgb.g * 0.587 +
        rgb.b * rgb.b * 0.114);
    };

    const formatLength = (line: geom.Geometry) => {
      const length = Sphere.getLength(line);
      let output;
      if (length > 100) {
        output = (Math.round(length / 1000 * 100) / 100) +
          ' ' + 'km';
      } else {
        output = (Math.round(length * 100) / 100) +
          ' ' + 'm';
      }
      return output;
    };
    const hexToRgb = (hex: string) => {
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
    };

    const geometry: geom.LineString = <geom.LineString>feature.getGeometry();
    const color = feature.get('stroke.color');
    const rgb = hexToRgb(color);
    const icon = undefined;
    const styles = new Array<style.Style>();
    if (geometry.getType() === 'LineString') {
      styles.push(new style.Style({
        stroke: new style.Stroke({
          color: color,
          width: 3
        }),
        text: new style.Text({
          text: formatLength(geometry),
          font: '18px Calibri,sans-serif',
          fill: new style.Fill({
            color: color
          }),
          stroke: new style.Stroke({
            color: (colorGetBrightness(rgb) < 220) ? 'white' : 'black',
            width: 3
          })
        })
      })
      );

      geometry.forEachSegment(function (start, end) {
        const dx = end[0] - start[0];
        const dy = end[1] - start[1];
        const rotation = Math.atan2(dy, dx);

        // arrows
        styles.push(new style.Style({
          geometry: new geom.Point([start[0] + dx / 2, start[1] + dy / 2]),
          image: new style.Icon({
            color: color,
            crossOrigin: 'anonymous',
            // src: 'https://openlayers.org/en/v4.3.4/examples/data/dot.png',
            src: '../assets/' + ((icon === undefined) ? 'arrow_20.png' : icon),
            anchor: [0.75, 0.5],
            rotateWithView: true,
            rotation: -rotation
          })
        }));
      });
    } else {
      styles.push(new style.Style({
        fill: new style.Fill({
          color: 'rgba(' + rgb.r + ',' + rgb.g + ',' + rgb.b + ', 0.5)'
        }),
        stroke: new style.Stroke({
          color: color,
          width: 3
        })
      }));
    }
    return styles;
  }

  configureFeature(drawingType: DrawingType) {
    drawingType.draw.on('drawend', (event: interaction.Draw.Event) => {
      const feature = event.feature;
      let color = this.predefinedColor;
      if (color === undefined) {
        color = this.color;
      }
      const rgb = this.hexToRgb(this.color);
      feature.set('fill.color', 'rgba(' + rgb.r + ',' + rgb.g + ',' + rgb.b + ', 0.5)');
      feature.set('stroke.color', color);
      feature.set('stroke.width', 3);
      //      feature.setStyle(this.styleFunction(feature, color, undefined));
      this.predefinedColor = undefined;
    });
    $(document).keydown((e) => {
      if (e.which === 27) {
        drawingType.draw.removeLastPoint();
      } else if (e.which === 46) {
        drawingType.draw.setActive(false);
      }
    });
  }

  mapLoaded(map: Map) {
    this.source = new source.Vector({ wrapX: false });
    this.vector = new layer.Vector({
      source: this.source,
      style: this.styleFunction,
      map: map
    });
    this.drawInteractions.forEach((drawInteraction) => {
      let options;
      if (drawInteraction.type === 'Rectangle') {
        options = {
          source: this.vector.getSource(),
          type: 'Circle',
          geometryFunction: interaction.Draw.createBox()
        };
      } else {
        options = {
          source: this.source,
          type: drawInteraction.type
        };
      }
      drawInteraction.draw = new interaction.Draw(options);
      this.configureFeature(drawInteraction);
      map.addInteraction(drawInteraction.draw);
      drawInteraction.draw.setActive(false);
    });

    this.select = new interaction.Select();
    map.addInteraction(this.select);
    this.select.setActive(false);
    const selectedFeatures = this.select.getFeatures();
    this.select.on('change:active', function () {
      selectedFeatures.forEach(selectedFeatures.remove, selectedFeatures);
    });

    this.modify = new interaction.Modify({
      features: this.select.getFeatures()
    });
    map.addInteraction(this.modify);
    this.modify.setActive(false);
    // let s;
    // this.modify.on('modifystart', (e) => {
    //   s = e.features.getArray()[0].getStyle();
    //   e.features.getArray()[0].setStyle([new style.Style({
    //     image: new style.Circle({
    //       radius: 3 * 2,
    //       fill: new style.Fill({
    //         color: [0, 153, 255, 1]
    //       }),
    //       stroke: new style.Stroke({
    //         color: 'white',
    //         width: 3 / 2
    //       })
    //     }),
    //     zIndex: Infinity
    //   })]);
    // });
    // this.modify.on('modifyend', (e) => {
    //   const feature = e.features.getArray()[0];
    //   e.target.setStyle(this.styleFunction(feature, feature.get('stroke.color'), null));
    // });

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
    this.drawInteractions.map((drawInteraction) => drawInteraction.draw.setActive(false));
    this.select.setActive(false);
    this.modify.setActive(false);
  }

  getDrawInteraction(type: string): interaction.Draw {
    return this.drawInteractions.find((drawInteraction) => drawInteraction.type === type).draw;
  }

  enableDrawInteraction(type: string, color?: string) {
    this.predefinedColor = color;
    this.disableInteractions();
    this.getDrawInteraction(type).setActive(true);
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
        this.disableInteractions();
      }
    ));
    this.subscriptions.push(this.menuEventService.getObservable('polyline').subscribe(
      () => {
        console.log('drawing polyline start');
        this.enableDrawInteraction('LineString');
      }
    ));
    this.subscriptions.push(this.menuEventService.getObservable('polygon').subscribe(
      () => {
        console.log('drawing polygon start');
        this.enableDrawInteraction('Polygon');
      }
    ));
    this.subscriptions.push(this.menuEventService.getObservable('circle').subscribe(
      () => {
        console.log('drawing circle start');
        this.enableDrawInteraction('Circle');
      }
    ));
    this.subscriptions.push(this.menuEventService.getObservable('rectangle').subscribe(
      () => {
        console.log('drawing rectangle start');
        this.enableDrawInteraction('Rectangle');
      }
    ));
    this.subscriptions.push(this.menuEventService.getObservable('drawVictimPath').subscribe(
      () => {
        console.log('drawing drawVictimPath start');
        this.enableDrawInteraction('LineString', '#00F');
      }
    ));
    this.subscriptions.push(this.menuEventService.getObservable('drawK9Path').subscribe(
      () => {
        console.log('drawing drawVictimPath start');
        this.enableDrawInteraction('LineString', '#F93');
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
          if (feature.getGeometry().getType() === 'MultiLineString') {
            (<geom.MultiLineString>feature.getGeometry()).getLineStrings().forEach((lineStringGeom: geom.LineString) => {
              const feat = new Feature(lineStringGeom);
              //              feat.setStyle(this.styleFunction(feat, this.color, 'arrow_16.png'));
              feat.set('fill.color', 'rgba(' + rgb.r + ',' + rgb.g + ',' + rgb.b + ', 0.5)');
              feat.set('stroke.color', this.color);
              feat.set('stroke.width', 3);
              this.source.addFeature(feat);
            });
          }
        });
        this.map.getView().fit(this.source.getExtent());
      }
    ));
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
