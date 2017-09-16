import { Injectable, Inject, Component, OnInit, OnDestroy } from '@angular/core';
import { MdDialog, MdDialogRef, MD_DIALOG_DATA } from '@angular/material';

import { MenuEventService } from '../_services/menuEvent.service';
import { CanimapService } from '../_services/canimap.service';
import { Subscription } from 'rxjs/Subscription';
import { saveAs } from 'file-saver';

import * as $ from 'jquery';
import { Map } from 'leaflet';
import * as L from 'leaflet';

@Injectable()
export class FileService implements OnDestroy {
  private map: Map;
  private subscriptions = new Array<Subscription>();

  constructor(
    private menuEventService: MenuEventService,
    private canimapService: CanimapService,
    public dialog: MdDialog
  ) { }

  subscribe() {
    const map = this.map;

    this.subscriptions.push(this.menuEventService.getObservable('fileSave').subscribe(
      () => {
        let fileName = 'carte.geoJSON';
        const dialogRef = this.dialog.open(DialogFileSaveComponent, {
          width: '320px',
          data: { name: fileName }
        });

        dialogRef.afterClosed().subscribe(result => {
          console.log('The dialog was closed');
          if (result !== undefined) {
            fileName = result;

            // Get geojson data
            const geoJson = this.canimapService.geoJSON;
            const data: any = {};
            data['type'] = 'FeatureCollection';
            data['features'] = geoJson;

            // Stringify the GeoJson
            const convertedData = 'text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(data));
            saveAs(new Blob([JSON.stringify(data)]), fileName);
          }
        });
      },
      e => console.log('onError: %s', e),
      () => console.log('onCompleted')
    ));
    this.subscriptions.push(this.menuEventService.getObservable('fileOpen').subscribe(
      () => {
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

@Component({
  selector: 'app-dialog-file-save',
  templateUrl: './templates/app-dialog-file-save.html',
})
export class DialogFileSaveComponent {

  constructor(
    public dialogRef: MdDialogRef<FileService>,
    @Inject(MD_DIALOG_DATA) public data: any) { }

  onNoClick(): void {
    this.dialogRef.close();
  }

}
