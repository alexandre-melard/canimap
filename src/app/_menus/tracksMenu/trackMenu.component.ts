import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { HelperEventService } from '../../_services/helperEvent.service';
import { MenuEventService } from '../../_services/menuEvent.service';
import { BaseMenuComponent } from '../baseMenu';

@Component({
  selector: 'app-canimap-track-menu',
  moduleId: module.id.toString(),
  templateUrl: 'trackMenu.component.html'
})

export class TrackMenuComponent extends BaseMenuComponent {
  gpsMarkerToggle = true;
  contextVisible = false;
  constructor(
    private router: Router,
    public menuEventService: MenuEventService,
    public helperEventService: HelperEventService) {
    super(menuEventService, helperEventService);
  }
}
