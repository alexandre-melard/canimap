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
      appId: '133634944031998',
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
                  if (response.status === 'connected') {
                    console.log('connnected');
                    me.postImageToFacebook(response.authResponse.accessToken,
                      'Canvas to Facebook', 'image/png', blob, window.location.href);
                  } else {
                    FB.login({ scope: 'publish_actions' })
                      .then(function (r) {
                        if (r.status === 'connected') {
                          console.log('connnected');
                          me.postImageToFacebook(r.authResponse.accessToken,
                            'Canvas to Facebook', 'image/png', blob, window.location.href);
                        } else if (r.status === 'not_authorized') {
                          console.log('not authorized');
                        } else {
                          console.log('not logged into facebook');
                        }
                      })
                      .catch(function (r) {
                        console.log(r);
                      });
                    console.log('not authorized');
                  }
                }).catch(function (response) {
                  console.log(response);
                });
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

  postImageToFacebook(token, filename, mimeType, imageData, message) {
    const fd = new FormData();
    fd.append('access_token', token);
    fd.append('source', imageData);
    fd.append('no_story', 'true');

    // Upload image to facebook without story(post to feed)
    $.ajax({
      url: 'https://graph.facebook.com/me/photos?access_token=' + token,
      type: 'POST',
      data: fd,
      processData: false,
      contentType: false,
      cache: false,
      success: (data) => {
        console.log('success: ', data);
      },
      error: function (shr, status, data) {
        console.log('error ' + data + ' Status ' + shr.status);
      },
      complete: function (data) {
        console.log('Post to facebook Complete');
      }
    });
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

