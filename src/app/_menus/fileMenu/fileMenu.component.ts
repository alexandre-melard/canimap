import { Component, OnInit, HostListener } from '@angular/core';
import { Router } from '@angular/router';
import { EventService } from '../../_services/event.service';
import { HelperEventService } from '../../_services/helperEvent.service';
import { Events } from '../../_consts/events';
import { Helpers } from '../../_consts/helpers';
import { LogService } from '../../_services/log.service';

declare var $;

export enum KEY_CODE {
  RIGHT_ARROW = 39,
  LEFT_ARROW = 37,
  ESC = 27
}

@Component({
  selector: 'app-canimap-file-menu',
  moduleId: module.id.toString(),
  templateUrl: 'fileMenu.component.html'
})

export class FileMenuComponent implements OnInit {
  model: any = {};
  menuVisible = true;

  constructor(
    private log: LogService,
    private eventService: EventService,
    private helperEventService: HelperEventService,
    private router: Router
  ) { }

  get visible(): boolean {
    return this.router.url === '/map';
  }

  ngOnInit() {
    this.log.debug('[FileMenuComponent] [INIT]');
  }

  printScreen(e: MouseEvent) {
    this.print();
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

  print() {
    if (this.visible) {
      $('.canimap-menu *, app-canimap-location, app-compass').hide();
      this.menuVisible = false;
      this.log.info('Appuyez sur la touche Esc pour retrouver les menus');
    }
  }

  @HostListener('window:keyup', ['$event'])
  keyEvent(event: KeyboardEvent) {
    if (event.keyCode === KEY_CODE.ESC && !this.menuVisible) {
      $('.canimap-menu *, app-canimap-location, app-compass').show();
      this.menuVisible = true;
    }
  }

}
