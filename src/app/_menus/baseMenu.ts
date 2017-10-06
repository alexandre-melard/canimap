import { Component } from '@angular/core';
import { HelperEventService } from '../_services/helperEvent.service';
import { MenuEventService } from '../_services/menuEvent.service';
import { drawInteractions } from '../_consts/drawings';

@Component({
  selector: 'app-canimap-base-menu',
  moduleId: module.id.toString(),
  template: ''
})

export class BaseMenuComponent {
  constructor(
    public menuEventService: MenuEventService,
    public helperEventService: HelperEventService
  ) { }

  color(state: any) {
    let color = 'black';
    if (this.menuEventService.state === 'draw-' + state) {
      color = 'red';
    }
    return color;
  }

  draw(what: string) {
    const drawInteraction = drawInteractions.filter((d) => d.type === what)[0];
    if (drawInteraction !== undefined) {
      this.menuEventService.prepareEvent(drawInteraction.event, null);
      this.helperEventService.showHelper(drawInteraction.helper, () => {
        this.menuEventService.proceed();
      });
    }
  }
}
