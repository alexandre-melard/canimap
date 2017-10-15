import { Injectable, Inject, Component, OnInit, OnDestroy } from '@angular/core';
import { MdDialog } from '@angular/material';

import { MenuEventService } from '../_services/menuEvent.service';
import { DrawService } from '../_services/draw.service';

import { Subscription } from 'rxjs/Subscription';
import { saveAs } from 'file-saver';
import { DialogFileOpenComponent } from '../_dialogs/fileOpen.component';
import { DialogFilesOpenComponent } from '../_dialogs/filesOpen.component';
import { DialogFileSaveComponent } from '../_dialogs/fileSave.component';
import { environment } from '../../environments/environment';

@Injectable()
export class FileService implements OnDestroy {
  private subscriptions = new Array<Subscription>();
  // private FB;

  constructor(
    private menuEventService: MenuEventService,
    private drawService: DrawService,
    public dialog: MdDialog
  ) {
    const me = this;
    this.subscriptions.push(this.menuEventService.getObservable('fileSave').subscribe(
      () => {
        let fileName = 'carte';
        const dialogRef = this.dialog.open(DialogFileSaveComponent, {
          width: '320px',
          data: { name: fileName }
        });

        dialogRef.afterClosed().subscribe(result => {
          console.log('The dialog was closed');
          if (result !== undefined) {
            fileName = result;

            // Get geojson data
            me.menuEventService.callEvent('getGeoJson', (geoJson) => {
              saveAs(new Blob([geoJson]), fileName + '.geojson');
            });
          }
        });
      },
      e => console.log('onError: %s', e),
      () => console.log('onCompleted')
    ));
    this.subscriptions.push(this.menuEventService.getObservable('printScreen').subscribe(
      () => {
        let fileName = 'carte';
        const dialogRef = this.dialog.open(DialogFileSaveComponent, {
          width: '320px',
          data: { name: fileName }
        });

        dialogRef.afterClosed().subscribe(result => {
          console.log('The dialog was closed');
          if (result !== undefined) {
            fileName = result;

            // Get geojson data
            me.menuEventService.callEvent('saveAsPng', (blob) => {
              saveAs(blob, fileName + '.png');
            });
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
                me.menuEventService.callEvent('addLayersFromJson', content);
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
      (data) => {
        const dialogRef = this.dialog.open(DialogFileOpenComponent, {
          width: '700px',
          data: { types: data }
        });

        dialogRef.afterClosed().subscribe(result => {
          console.log('The dialog was closed');
          if (result !== undefined) {
            const file: File = result;
            me.parseFile(file, (content: string) => {
              me.menuEventService.callEvent('loadGPS', { content: content, type: file.name.split('.').pop() });
            });
          }
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

