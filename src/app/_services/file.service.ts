import { Injectable, Inject, Component, OnInit, OnDestroy } from '@angular/core';
import { MdDialog } from '@angular/material';

import { MenuEventService } from '../_services/menuEvent.service';
import { DrawService } from '../_services/draw.service';

import { Subscription } from 'rxjs/Subscription';
import { saveAs } from 'file-saver';
import { DialogFileOpenComponent } from '../_dialogs/fileOpen.component';
import { DialogFilesOpenComponent } from '../_dialogs/filesOpen.component';
import { DialogFileSaveComponent } from '../_dialogs/fileSave.component';
import { FacebookService, InitParams } from 'ngx-facebook';

import * as $ from 'jquery';

@Injectable()
export class FileService implements OnDestroy {
  private subscriptions = new Array<Subscription>();

  constructor(
    private menuEventService: MenuEventService,
    private drawService: DrawService,
    private FB: FacebookService,
    public dialog: MdDialog
  ) {
    const initParams: InitParams = {
      appId: '1646279588918669',
      xfbml: true,
      version: 'v2.8'
    };

    FB.init(initParams);

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
              // saveAs(blob, fileName + '.png');
              FB.getLoginStatus()
                .then(function (response) {
                  console.log(response);
                })
                .catch(function (response) {
                  console.log(response);
                });
              const fd = new FormData();
              fd.append('access_token', 'a25a6ef94b2e80b87fae878c7250afbb');
              fd.append('source', blob);
              fd.append('message', 'Photo Text');
              try {
                $.ajax({
                  url: 'https://graph.facebook.com/me/photos?access_token=a25a6ef94b2e80b87fae878c7250afbb',
                  type: 'POST',
                  data: fd,
                  processData: false,
                  contentType: false,
                  cache: false,
                  success: function (data) {
                    console.log('success ' + data);
                  },
                  error: function (shr, status, data) {
                    console.log('error ' + data + ' Status ' + shr.status);
                  },
                  complete: function () {
                    console.log('Posted to facebook');
                  }
                });
              } catch (e) {
                console.log(e);
              }
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
    this.subscriptions.push(this.menuEventService.getObservable('fileReceived').subscribe(
      (file: File) => {
        me.parseFile(file, (content) => {
          me.menuEventService.callEvent('addLayersFromJson', content);
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

