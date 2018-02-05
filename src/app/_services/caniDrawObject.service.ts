import { Injectable, Inject, Component, OnInit, OnDestroy } from '@angular/core';
import { MdDialog } from '@angular/material';

import { MenuEventService } from '../_services/menuEvent.service';

import { Subscription } from 'rxjs/Subscription';
import { saveAs } from 'file-saver';
import { DialogFileOpenComponent } from '../_dialogs/fileOpen.component';
import { DialogFilesOpenComponent } from '../_dialogs/filesOpen.component';
import { DialogFileSaveComponent } from '../_dialogs/fileSave.component';
import { DialogDisplayObjectsComponent } from '../_dialogs/displayObjects.component';
import { environment } from '../../environments/environment';
import { CaniDrawObject } from '../_models/caniDrawObject';
import * as ol from 'openlayers';

@Injectable()
export class CaniDrawObjectService implements OnDestroy {
  private subscriptions = new Array<Subscription>();
  private objects = new Array<CaniDrawObject>();
  private map: ol.Map;
  private selectInteraction: ol.interaction.Select;

  constructor(
    private menuEventService: MenuEventService,
    public dialog: MdDialog
  ) {
    const me = this;
    this.subscriptions.push(this.menuEventService.getObservable('mapLoaded').subscribe(
      (map: ol.Map) => {
        me.map = map;
        me.selectInteraction = new ol.interaction.Select({
          condition: ol.events.condition.singleClick,
          filter: (f: ol.Feature) => {
            return me.objects.find((object: CaniDrawObject) => (object.feature === f)) !== undefined;
          }
        });
        me.map.addInteraction(this.selectInteraction);
    }));
    this.subscriptions.push(this.menuEventService.getObservable('registerObject').subscribe(
      (feature: ol.Feature) => {
        const properties: any = feature.getProperties();
        const ruObject: CaniDrawObject = new CaniDrawObject();
        ruObject.name = properties['name'];
        ruObject.position = properties['Position'];
        ruObject.color = properties['Couleur'];
        ruObject.fabric = properties['Matière'];
        ruObject.specificity = properties['Spécificité'];
        ruObject.wind = properties['Vent'];
        ruObject.feature = feature;
        me.objects.push(ruObject);
        console.log('adding object: '  + ruObject.name);
    }));

    this.subscriptions.push(this.menuEventService.getObservable('displayObjects').subscribe(
      () => {
        const dialogRef = this.dialog.open(DialogDisplayObjectsComponent, {
          width: '800px',
          data: { objects: this.objects }
        });

        dialogRef.afterClosed().subscribe(result => {
          console.log('The dialog was closed');
        });
      },
      e => console.log('onError: %s', e),
      () => console.log('onCompleted')
    ));
    this.subscriptions.push(this.menuEventService.getObservable('drawend').subscribe(
      (feature: ol.Feature) => {
        console.log('draw end detected');
        if (feature.getGeometry().getType() === 'Point') {
          console.log('point draw detected');
          me.menuEventService.callEvent('registerObject', feature);
          this.selectInteraction.on('select',
          () => {
            console.log('point click detected');
          });
        }
      },
      e => console.log('onError: %s', e),
      () => console.log('onCompleted')
    ));
  }

  ngOnDestroy() {
    // prevent memory leak when component destroyed
    console.log('unsubscribing from canimap service');
    for (const subscription of this.subscriptions) {
      subscription.unsubscribe();
    }
  }

}

