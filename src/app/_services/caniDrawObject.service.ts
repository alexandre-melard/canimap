import { Injectable, Inject, Component, OnInit, OnDestroy } from '@angular/core';
import { MatDialog } from '@angular/material';

import { EventService } from '../_services/event.service';

import { Observable ,  Subscription ,  Observer } from 'rxjs';
import { DialogObjectsDisplayComponent } from '../_dialogs/objectsDisplay.component';
import { CaniDrawPoint } from '../_models/caniDrawPoint';
import { CaniDrawObject } from '../_models/caniDrawObject';
import { DialogObjectsAddComponent } from '../_dialogs/objectsAdd.component';
import * as ol from 'openlayers';
import { MapService } from './map.service';
import { Events } from '../_consts/events';

@Injectable()
export class CaniDrawObjectService implements OnDestroy {
  private objects = new Array<CaniDrawObject>();
  private map: ol.Map;
  private selectInteraction: ol.interaction.Select;

  constructor(
    private eventService: EventService,
    private mapService: MapService,
    public dialog: MatDialog
  ) {
    const me = this;
    eventService.subscribe(Events.MAP_STATE_LOADED,
      (map: ol.Map) => me.mapLoaded(map)
    );
  }


  mapLoaded(map: ol.Map) {
    const me = this;
    me.map = map;
    me.selectInteraction = new ol.interaction.Select({
      condition: ol.events.condition.singleClick,
      filter: (f: ol.Feature) => {
        return me.objects.find((object: CaniDrawObject) => (object.feature === f)) !== undefined;
      }
    });
    me.selectInteraction.on(Events.OL_DRAW_SELECT,
      (event: ol.interaction.Select.Event) => {
        if (event.selected.length > 0) {
          console.log('point click detected');
          me.eventService.call(Events.MAP_DRAW_OBJECT_DISPLAY, null);
        }
      });
    me.map.addInteraction(this.selectInteraction);

    this.eventService.subscribe(Events.MAP_DRAW_EDIT,
      () => {
        this.selectInteraction.setActive(false);
      }
    );

    this.eventService.subscribe(Events.MAP_DRAW_INTERACTIONS_DISABLE,
      () => {
        this.selectInteraction.setActive(true);
      }
    );
    this.eventService.subscribe(Events.MAP_DRAW_OBJECT_REGISTER,
      (feature: ol.Feature) => {
        const properties: any = feature.getProperties();
        const ruObject: CaniDrawObject = new CaniDrawObject();
        ruObject.name = properties['name'];
        ruObject.position = properties['Position'];
        ruObject.color = properties['Couleur'];
        ruObject.fabric = properties['Matière'];
        ruObject.specificity = properties['Spécificité'] || properties['specificity'];
        ruObject.wind = properties['Vent'];
        ruObject.feature = feature;
        properties['type'] = ruObject.type;
        feature.setProperties(properties);
        me.objects.push(ruObject);
        console.log('adding object: ' + ruObject.name);
      }
    );

    this.eventService.subscribe(Events.MAP_DRAW_OBJECT_DISPLAY,
      () => {
        const dialogRef = this.dialog.open(DialogObjectsDisplayComponent, {
          width: '800px',
          data: { objects: this.objects }
        });

        dialogRef.afterClosed().subscribe(result => {
          console.log('The dialog was closed');
          this.objects.forEach((object: CaniDrawObject) => {
            me.writeRuObjectToFeature(object);
          });
        });
      },
      e => console.log('onError: %s', e),
      () => console.log('onCompleted')
    );

    this.eventService.subscribe(Events.MAP_DRAW_FEATURE_CREATED,
      (data: { feature: ol.Feature, draw: any }) => {
        const feature = data.feature;
        const draw = data.draw;
        console.log('draw end detected');
        if (feature.getGeometry().getType() === 'Point') {
          console.log('point draw detected');
          const properties = feature.getProperties();
          if (draw.properties && draw.properties.specificity) {
            properties['specificity'] = draw.properties.specificity;
            feature.setProperties(properties);
            me.eventService.call(Events.MAP_DRAW_OBJECT_REGISTER, feature);
          }
        }
      },
      e => console.log('onError: %s', e),
      () => console.log('onCompleted')
    );
  }

  createObject(feature: ol.Feature) {
    const obs = new Observable((observer: Observer<CaniDrawObject>) => {
      const dialogRef = this.dialog.open(DialogObjectsAddComponent, {
        width: '800px'
      });
      dialogRef.afterClosed().subscribe(result => {
        console.log('The dialog was closed');
        result.feature = feature;
        this.writeRuObjectToFeature(result);
        observer.next(result);
      });
    });
    return obs;
  }

  writeRuObjectToFeature(ruObject: CaniDrawObject) {
    const feature = ruObject.feature;
    const properties: any = feature.getProperties();
    properties['name'] = ruObject.name;
    properties['Position'] = ruObject.position;
    properties['Couleur'] = ruObject.color;
    properties['Matière'] = ruObject.fabric;
    properties['Spécificité'] = ruObject.specificity;
    properties['Vent'] = ruObject.wind;
    properties['type'] = 'RuObject';
    feature.setProperties(properties);
    return feature;
  }

  ngOnDestroy() {
  }

}

