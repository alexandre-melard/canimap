import { ElementRef, NgZone, ViewChild , Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { MapsAPILoader } from '@agm/core';
import { } from '@types/googlemaps';

import { AlertService, AuthenticationService, MenuEventService, HelperEventService } from '../_services/index';

@Component({
  selector: 'app-canimap-track-menu',
  moduleId: module.id.toString(),
  templateUrl: 'trackMenu.component.html'
})

export class TrackMenuComponent implements OnInit {
  model: any = {};
  loading = false;

  constructor(
    private menuEventService: MenuEventService,
    private helperEventService: HelperEventService,
    private mapsAPILoader: MapsAPILoader,
    private ngZone: NgZone) {}

  ngOnInit() {
  }

  drawVictimPath(e: MouseEvent) {
      this.menuEventService.prepareEvent('drawVictimPath', null);
      const dismissHelp: boolean = this.helperEventService.callHelper('drawVictimPath');
      if (dismissHelp) {
        e.stopPropagation();
        this.menuEventService.proceed();
      }
  }

  drawK9Path(e: MouseEvent) {
    this.menuEventService.prepareEvent('drawK9Path', null);
    const dismissHelp: boolean = this.helperEventService.callHelper('drawK9Path');
    if (dismissHelp) {
      e.stopPropagation();
      this.menuEventService.proceed();
    }
}
}
