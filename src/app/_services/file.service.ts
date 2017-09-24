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
  private subscriptions = new Array<Subscription>();

  constructor(
    private menuEventService: MenuEventService,
    private canimapService: CanimapService,
    public dialog: MdDialog
  ) { }

  subscribe() {
    const me = this;

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
        console.log('open file');
        $('#file').click();
      },
      e => console.log('onError: %s', e),
      () => console.log('onCompleted')
    ));
    this.subscriptions.push(this.menuEventService.getObservable('fileReceived').subscribe(
      (file: File) => {
        console.log(file.size);
        const reader = new FileReader();
        reader.onload = (e) => {
          console.log(e);
        };
        reader.onloadend = (f) => {
          console.log(f);
          console.log(reader.result);
          const json = JSON.parse(reader.result);
          me.menuEventService.callEvent('addLayersFromJson', json);
        };
        reader.readAsText(file);
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
