import { Injectable, Inject, Component, OnInit, OnDestroy } from '@angular/core';
import { MatDialog } from '@angular/material';

import { EventService } from '../_services/event.service';
import { DrawService } from '../_services/draw.service';

import { Subscription } from 'rxjs';
import { saveAs } from 'file-saver';
import { DialogFileOpenComponent } from '../_dialogs/fileOpen.component';
import { DialogFilesOpenComponent } from '../_dialogs/filesOpen.component';
import { DialogFileSaveComponent } from '../_dialogs/fileSave.component';
import { environment } from '../../environments/environment';
import { Events } from '../_consts/events';

@Injectable()
export class FileService implements OnDestroy {

  constructor(
    private eventService: EventService,
    private drawService: DrawService,
    public dialog: MatDialog
  ) {
    const me = this;
    this.eventService.subscribe(Events.MAP_FILE_SAVE,
      () => {
        let fileName = 'carte';
        const dialogRef = this.dialog.open(DialogFileSaveComponent, {
          width: '320px',
          data: { name: fileName }
        });

        dialogRef.afterClosed().subscribe(result => {
          console.log('The dialog was closed');
          if (result) {
            fileName = result;

            // Get geojson data
            me.eventService.call(Events.MAP_DRAW_GEO_JSON_EXPORT,
              geoJson => saveAs(new Blob([geoJson]), fileName + '.geojson')
            );
          }
        });
      },
      e => console.log('onError: %s', e),
      () => console.log('onCompleted')
    );
    this.eventService.subscribe(Events.MAP_FILE_EXPORT,
      (type: any) => {
        let fileName = 'piste';
        const dialogRef = this.dialog.open(DialogFileSaveComponent, {
          width: '320px',
          data: { name: fileName }
        });
        dialogRef.afterClosed().subscribe(result => {
          console.log('The dialog was closed');
          if (result) {
            fileName = result;

            if (type.data === 'kml') {
              me.eventService.call(
                Events.MAP_DRAW_KML_EXPORT,
                kml => saveAs(new Blob([kml]), fileName + '.kml')
              );
            } else {
              me.eventService.call(Events.MAP_DRAW_GPX_EXPORT,
                gpx => saveAs(new Blob([gpx]), fileName + '.gpx')
              );
            }
          }
        });
      },
      e => console.log('onError: %s', e),
      () => console.log('onCompleted')
    );
    this.eventService.subscribe(Events.MAP_SCREEN_PRINT,
      () => {
        let fileName = 'carte';
        const dialogRef = this.dialog.open(DialogFileSaveComponent, {
          width: '320px',
          data: { name: fileName }
        });

        dialogRef.afterClosed().subscribe(result => {
          console.log('The dialog was closed');
          if (result) {
            fileName = result;

            // Get geojson data
            me.eventService.call(Events.MAP_DRAW_PNG_EXPORT,
              blob => saveAs(blob, fileName + '.png')
            );
          }
        });
      },
      e => console.log('onError: %s', e),
      () => console.log('onCompleted')
    );
    this.eventService.subscribe(Events.MAP_FILE_OPEN_MULTIPLE,
      () => {
        console.log('opening files open dialog');
        const dialogRef = this.dialog.open(DialogFilesOpenComponent, {
          width: '700px'
        });

        dialogRef.afterClosed().subscribe(result => {
          console.log('The dialog was closed');
          if (result) {
            const fileList: FileList = result;
            // loop through files
            for (let i = 0; i < fileList.length; i++) {
              const file = fileList.item(i);
              me.parseFile(file, (content: string) => {
                me.eventService.call(Events.MAP_DRAW_JSON_LAYERS_ADD, content);
              }
              );
            }
          }
        });
      },
      e => console.log('onError: %s', e),
      () => console.log('onCompleted')
    );
    this.eventService.subscribe(Events.MAP_FILE_LOAD_GPS,
      (data) => {
        const dialogRef = this.dialog.open(DialogFileOpenComponent, {
          width: '700px',
          data: { types: data }
        });

        dialogRef.afterClosed().subscribe(result => {
          console.log('The dialog was closed');
          if (result) {
            const file: File = result;
            me.parseFile(file, (content: string) => {
              me.eventService.call(Events.MAP_DRAW_GPS_IMPORT, { content: content, type: file.name.split('.').pop() });
            });
          }
        });
      },
      e => console.log('onError: %s', e),
      () => console.log('onCompleted')
    );
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
  }

}

