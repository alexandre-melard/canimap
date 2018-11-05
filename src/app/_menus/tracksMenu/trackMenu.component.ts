import { Component, OnInit } from '@angular/core';
import { HelperEventService } from '../../_services/helperEvent.service';
import { EventService } from '../../_services/event.service';
import { BaseMenuComponent } from '../baseMenu';
import { Events } from '../../_consts/events';
import { LogService } from '../../_services/log.service';

@Component({
  selector: 'app-canimap-track-menu',
  moduleId: module.id.toString(),
  templateUrl: 'trackMenu.component.html'
})

export class TrackMenuComponent extends BaseMenuComponent implements OnInit {
  gpsMarkerToggle = true;
  contextVisible = false;
  constructor(
    private log: LogService,
    public eventService: EventService,
    public helperEventService: HelperEventService) {
    super(eventService, helperEventService);
  }
  ngOnInit() {
    this.log.debug('[TrackMenuComponent] [INIT]');
  }

  objects() {
    this.eventService.call(Events.MAP_DRAW_OBJECT_DISPLAY);
  }

  trackName() {
    if (this.eventService.state !== Events.MAP_DRAW_NAME_DISPLAY_SUBSCRIBE) {
      this.eventService.call(Events.MAP_DRAW_NAME_DISPLAY_SUBSCRIBE);
    } else {
      this.eventService.call(Events.MAP_DRAW_NAME_DISPLAY_UNSUBSCRIBE);
    }
  }
}
