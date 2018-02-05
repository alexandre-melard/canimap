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

@Injectable()
export class CaniDrawObjectService implements OnDestroy {
  private subscriptions = new Array<Subscription>();
  private objects = new Array<Object>();

  constructor(
    private menuEventService: MenuEventService,
    public dialog: MdDialog
  ) {
    const me = this;

    this.subscriptions.push(this.menuEventService.getObservable('registerObject').subscribe(
      (data: any) => {
        const ruObject: CaniDrawObject = new CaniDrawObject();
        ruObject.name = data['name'];
        ruObject.position = data['Position'];
        ruObject.color = data['Couleur'];
        ruObject.fabric = data['Matière'];
        ruObject.specificity = data['Spécificité'];
        ruObject.wind = data['Vent'];
        this.objects.push(ruObject);
        console.log('adding object: '  + ruObject.name);
      }
      ));

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
  }

  ngOnDestroy() {
    // prevent memory leak when component destroyed
    console.log('unsubscribing from canimap service');
    for (const subscription of this.subscriptions) {
      subscription.unsubscribe();
    }
  }

}

