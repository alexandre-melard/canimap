import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { HelperEventService } from '../../_services/helperEvent.service';
import { EventService } from '../../_services/event.service';
import { BaseMenuComponent } from '../baseMenu';
import { Events } from '../../_consts/events';

@Component({
  selector: 'app-canimap-track-menu',
  moduleId: module.id.toString(),
  templateUrl: 'trackMenu.component.html'
})

export class TrackMenuComponent extends BaseMenuComponent {
  gpsMarkerToggle = true;
  contextVisible = false;
  constructor(
    public eventService: EventService,
    public helperEventService: HelperEventService) {
    super(eventService, helperEventService);
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
