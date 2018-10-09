import { Component } from '@angular/core';
import { HelperEventService } from '../_services/helperEvent.service';
import { EventService } from '../_services/event.service';
import { drawInteractions } from '../_consts/drawings';

@Component({
  selector: 'app-canimap-base-menu',
  moduleId: module.id.toString(),
  template: ''
})

export class BaseMenuComponent {
  constructor(
    public eventService: EventService,
    public helperEventService: HelperEventService
  ) { }

  color(state: any) {
    let color = 'black';
    if (this.eventService.state === 'draw-' + state) {
      color = 'red';
    }
    return color;
  }

  draw(what: string) {
    const drawInteraction = drawInteractions.filter((d) => d.type === what)[0];
    if (drawInteraction) {
      this.helperEventService.showHelper(drawInteraction.helper, () => {
        this.eventService.call(drawInteraction.event);
      });
    }
  }
}
