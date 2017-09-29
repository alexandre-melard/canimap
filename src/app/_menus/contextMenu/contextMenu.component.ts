import { Component, Input, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MenuEventService } from '../../_services/index';
import { Subscription } from 'rxjs/Subscription';
import * as L from 'leaflet';
import * as $ from 'jquery';

@Component({
  selector: 'app-canimap-context-menu',
  moduleId: module.id.toString(),
  templateUrl: 'contextMenu.component.html'
})

export class ContextMenuComponent implements OnInit {
  @Input() visible = false;
  @Input() states: { label: string, link: HTMLElement }[];
  private subscriptions = new Array<Subscription>();

  constructor(private menuEventService: MenuEventService) { }

  ngOnInit() {
    this.subscriptions.push(this.menuEventService.getObservable('mapLoaded').subscribe(
      (map) => {
        map.on(L.Draw.Event.DRAWSTART, (e: L.DrawEvents.Edited) => {
          this.visible = true;
        });
        map.on(L.Draw.Event.DRAWSTOP, (e: L.DrawEvents.Edited) => {
          this.visible = false;
        });
      })
    );
  }

  click(event: any, state: any) {
    const link = $('.leaflet-draw-actions a:visible')[state.id];
    link.click();
  }
}
