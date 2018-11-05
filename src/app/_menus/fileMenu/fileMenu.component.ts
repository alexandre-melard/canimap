import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { EventService } from '../../_services/event.service';
import { HelperEventService } from '../../_services/helperEvent.service';
import { Events } from '../../_consts/events';
import { Helpers } from '../../_consts/helpers';
import { LogService } from '../../_services/log.service';
import { FileService } from '../../_services/file.service';

@Component({
  selector: 'app-canimap-file-menu',
  moduleId: module.id.toString(),
  templateUrl: 'fileMenu.component.html'
})

export class FileMenuComponent implements OnInit {
  model: any = {};

  constructor(
    private log: LogService,
    private eventService: EventService,
    private helperEventService: HelperEventService,
    private router: Router,
    private fileService: FileService
  ) { }

  get visible(): boolean {
    return this.router.url === '/map';
  }

  ngOnInit() {
    this.log.debug('[FileMenuComponent] [INIT]');
  }

  printScreen(e: MouseEvent) {
    this.eventService.call(Events.MAP_SCREEN_PRINT);
  }

  fileSave(e: MouseEvent) {
    this.helperEventService.showHelper(Helpers.MAP_FILE_SAVE,
      () => this.eventService.call(Events.MAP_FILE_SAVE)
    );
  }

  gpx(e: MouseEvent) {
    this.helperEventService.showHelper(Helpers.MAP_FILE_EXPORT,
      () => this.eventService.call(Events.MAP_FILE_EXPORT, 'gpx')
    );
  }

  kml(e: MouseEvent) {
    this.helperEventService.showHelper(Helpers.MAP_FILE_EXPORT,
      () => this.eventService.call(Events.MAP_FILE_EXPORT, 'kml')
    );
  }

  filesOpen(e: MouseEvent) {
    this.helperEventService.showHelper(Helpers.MAP_FILE_OPEN_MULTIPLE,
      () => this.eventService.call(Events.MAP_FILE_OPEN_MULTIPLE)
    );
  }

  gps(e: MouseEvent) {
    this.helperEventService.showHelper(Helpers.MAP_FILE_LOAD_GPS,
      () => this.eventService.call(Events.MAP_FILE_LOAD_GPS, ['gpx', 'kml'])
    );
  }
}
