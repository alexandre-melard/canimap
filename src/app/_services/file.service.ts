import {Injectable, OnDestroy} from '@angular/core';
import {MatDialog} from '@angular/material';
import {EventService} from './event.service';
import {saveAs} from 'file-saver';
import {DialogFileOpenComponent} from '../_dialogs/fileOpen.component';
import {DialogFilesOpenComponent} from '../_dialogs/filesOpen.component';
import {DialogFileSaveComponent} from '../_dialogs/fileSave.component';
import {Events} from '../_consts/events';
import {LogService} from './log.service';

@Injectable()
export class FileService implements OnDestroy {

    constructor(
        private log: LogService,
        private eventService: EventService,
        public dialog: MatDialog
    ) {
        const me = this;
        this.eventService.subscribe(Events.MAP_FILE_SAVE,
            () => {
                let fileName = 'carte';
                const dialogRef = this.dialog.open(DialogFileSaveComponent, {
                    width: '320px',
                    data: {name: fileName}
                });

                dialogRef.afterClosed().subscribe(result => {
                    this.log.debug('[FileService] DialogFileSaveComponent was closed');
                    if (result) {
                        fileName = result;

                        // Get geojson data
                        me.eventService.call(Events.MAP_DRAW_GEO_JSON_EXPORT,
                            geoJson => saveAs(new Blob([geoJson]), fileName + '.geojson')
                        );
                    }
                });
            },
            e => this.log.error('[FileService] DialogFileSaveComponent: %s', e),
            () => this.log.success('[FileService] DialogFileSaveComponent')
        );
        this.eventService.subscribe(Events.MAP_FILE_EXPORT,
            (type: any) => {
                let fileName = 'piste';
                const dialogRef = this.dialog.open(DialogFileSaveComponent, {
                    width: '320px',
                    data: {name: fileName}
                });
                dialogRef.afterClosed().subscribe(result => {
                    this.log.debug('[FileService] DialogFileSaveComponent was closed');
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
            e => this.log.error('[FileService] DialogFileSaveComponent: %s', e),
            () => this.log.success('[FileService] DialogFileSaveComponent')
        );
        this.eventService.subscribe(Events.MAP_SCREEN_PRINT,
            () => {
                let fileName = 'carte';
                const dialogRef = this.dialog.open(DialogFileSaveComponent, {
                    width: '320px',
                    data: {name: fileName}
                });

                dialogRef.afterClosed().subscribe(result => {
                    this.log.debug('[FileService] DialogFileSaveComponent was closed');
                    if (result) {
                        fileName = result;

                        // Get geojson data
                        me.eventService.call(Events.MAP_DRAW_PNG_EXPORT,
                            blob => saveAs(blob, fileName + '.jpg')
                        );
                    }
                });
            },
            e => this.log.error('[FileService] DialogFileSaveComponent: %s', e),
            () => this.log.success('[FileService] DialogFileSaveComponent')
        );
        this.eventService.subscribe(Events.MAP_FILE_OPEN_MULTIPLE,
            () => {
                this.log.debug('[FileService] MAP_FILE_OPEN_MULTIPLE: opening files open dialog');
                const dialogRef = this.dialog.open(DialogFilesOpenComponent, {
                    width: '700px'
                });

                dialogRef.afterClosed().subscribe(result => {
                    this.log.debug('[FileService] MAP_FILE_OPEN_MULTIPLE was closed');
                    if (result) {
                        const fileList: FileList = result;
                        // loop through files
                        for (let i = 0; i < fileList.length; i++) {
                            const file = fileList.item(i);
                            me.parseFile(file, (content: string, fileName: string) => {
                                    me.eventService.call(Events.MAP_DRAW_JSON_LAYERS_ADD, {content: content, fileName: fileName});
                                }
                            );
                        }
                    }
                });
            },
            e => this.log.error('[FileService] MAP_FILE_OPEN_MULTIPLE: %s', e),
            () => this.log.success('[FileService] MAP_FILE_OPEN_MULTIPLE')
        );
        this.eventService.subscribe(Events.MAP_FILE_LOAD_GPS,
            (data) => {
                const dialogRef = this.dialog.open(DialogFileOpenComponent, {
                    width: '700px',
                    data: {types: data}
                });

                dialogRef.afterClosed().subscribe(result => {
                    this.log.debug('[FileService] DialogFileOpenComponent was closed');
                    if (result) {
                        const file: File = result;
                        me.parseFile(file, (content: string) => {
                            me.eventService.call(Events.MAP_DRAW_GPS_IMPORT, {content: content, type: file.name.split('.').pop()});
                        });
                    }
                });
            },
            e => this.log.error('[FileService] DialogFileOpenComponent: %s', e),
            () => this.log.success('[FileService] DialogFileOpenComponent')
        );
    }

    parseFile(file: File, success: Function): void {
        this.log.debug('[FileService] parseFile file size: ' + file.size);
        const reader = new FileReader();
        reader.onload = (e) => {
            this.log.debug('[FileService] file loaded: ' + e);
        };
        reader.onloadend = () => {
            success(reader.result, file.name);
        };
        reader.readAsText(file);
    }

    ngOnDestroy() {
    }

}

