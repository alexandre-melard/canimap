import { Injectable, Inject, Component, OnInit, OnDestroy } from '@angular/core';
import { MatDialog } from '@angular/material';

import { MenuEventService } from '../_services/menuEvent.service';

import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';
import { DialogObjectsDisplayComponent } from '../_dialogs/objectsDisplay.component';
import { CaniDrawPoint } from '../_models/caniDrawPoint';
import { CaniDrawObject } from '../_models/caniDrawObject';
import { DialogObjectsAddComponent } from '../_dialogs/ObjectsAdd.component';
import { Observer } from 'rxjs/Observer';
import * as ol from 'openlayers';

@Injectable()
export class CaniDrawObjectService implements OnDestroy {
  private subscriptions = new Array<Subscription>();
  private objects = new Array<CaniDrawObject>();
  private map: ol.Map;
  private selectInteraction: ol.interaction.Select;

  constructor(
    private menuEventService: MenuEventService,
    public dialog: MatDialog
  ) {
    const me = this;
    this.subscriptions.push(this.menuEventService.getObservable('mapLoaded').subscribe(
      (map: ol.Map) => {
        me.mapLoaded(map);
      }
    ));
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
    me.selectInteraction.on('select',
    (event) => {
      if (event.selected.length > 0) {
        console.log('point click detected');
        me.menuEventService.callEvent('displayObjects', null);
      }
    });
    me.map.addInteraction(this.selectInteraction);

    this.subscriptions.push(this.menuEventService.getObservable('edit').subscribe(
      () => {
        this.selectInteraction.setActive(false);
      }
    ));

    this.subscriptions.push(this.menuEventService.getObservable('disableInteractions').subscribe(
      () => {
        this.selectInteraction.setActive(true);
      }
    ));
    this.subscriptions.push(this.menuEventService.getObservable('registerObject').subscribe(
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
        console.log('adding object: '  + ruObject.name);
    }));

    this.subscriptions.push(this.menuEventService.getObservable('displayObjects').subscribe(
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
    ));
    this.subscriptions.push(this.menuEventService.getObservable('drawend').subscribe(
      (data: {feature: ol.Feature, draw: any}) => {
        const feature = data.feature;
        const draw = data.draw;
        console.log('draw end detected');
        if (feature.getGeometry().getType() === 'Point') {
          console.log('point draw detected');
          const properties = feature.getProperties();
          if (draw.properties && draw.properties.specificity) {
            properties['specificity'] = draw.properties.specificity;
            feature.setProperties(properties);
            me.menuEventService.callEvent('registerObject', feature);
          }
        }
      },
      e => console.log('onError: %s', e),
      () => console.log('onCompleted')
    ));
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
    // prevent memory leak when component destroyed
    console.log('unsubscribing from canimap service');
    for (const subscription of this.subscriptions) {
      subscription.unsubscribe();
    }
  }

}

