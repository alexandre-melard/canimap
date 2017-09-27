import { Injectable, Inject, Component, OnInit, OnDestroy } from '@angular/core';
import { MdDialog } from '@angular/material';

import { MenuEventService } from '../_services/menuEvent.service';
import { CanimapService } from '../_services/canimap.service';
import { Subscription } from 'rxjs/Subscription';
import { saveAs } from 'file-saver';
import { DialogFileOpenComponent } from '../_dialogs/fileOpen.component';
import { DialogFilesOpenComponent } from '../_dialogs/filesOpen.component';
import { DialogFileSaveComponent } from '../_dialogs/fileSave.component';

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
        let fileName = 'carte.geojson';
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
    this.subscriptions.push(this.menuEventService.getObservable('filesOpen').subscribe(
      () => {
        const dialogRef = this.dialog.open(DialogFilesOpenComponent, {
          width: '700px'
        });

        dialogRef.afterClosed().subscribe(result => {
          console.log('The dialog was closed');
          if (result !== undefined) {
            const fileList: FileList = result;
            // loop through files
            for (let i = 0; i < fileList.length; i++) {
              const file = fileList.item(i);
              me.parseFile(file, (content: string) => {
                me.menuEventService.callEvent('addLayersFromJson', JSON.parse(content));
              }
            );
            }
          }
        });
      },
      e => console.log('onError: %s', e),
      () => console.log('onCompleted')
    ));
    this.subscriptions.push(this.menuEventService.getObservable('fileOpen').subscribe(
      () => {
        const dialogRef = this.dialog.open(DialogFileOpenComponent, {
          width: '700px'
        });

        dialogRef.afterClosed().subscribe(result => {
          console.log('The dialog was closed');
          if (result !== undefined) {
            const file: File = result;
            me.parseFile(file, (content: string) => {
              me.menuEventService.callEvent('loadGPX', content);
            });
          }
        });
      },
      e => console.log('onError: %s', e),
      () => console.log('onCompleted')
    ));
    this.subscriptions.push(this.menuEventService.getObservable('fileReceived').subscribe(
      (file: File) => {
        me.parseFile(file, (content) => {
          me.menuEventService.callEvent('addLayersFromJson', JSON.parse(content));
        });
      },
      e => console.log('onError: %s', e),
      () => console.log('onCompleted')
    ));
  }

  parseFile(file: File, success: Function): void {
    const me = this;
    console.log(file.size);
    const reader = new FileReader();
    reader.onload = (e) => {
      console.log(e);
    };
    reader.onloadend = (f) => {
      success(reader.result);
    };
    reader.readAsText(file);
  }

  ngOnDestroy() {
    // prevent memory leak when component destroyed
    console.log('unsubscribing from canimap service');
    for (const subscription of this.subscriptions) {
      subscription.unsubscribe();
    }
  }

}


