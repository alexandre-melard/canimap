import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { AlertService, AuthenticationService, MenuEventService } from '../../_services/index';

@Component({
  selector: 'canimap-menu-mobile',
  moduleId: module.id.toString(),
  templateUrl: 'mobile.component.html'
})

export class MenuMobileComponent implements OnInit {
  model: any = {};
  loading = false;
  onTrackStatus = false;
  recordTrackStatus = false;

  constructor(private menuEventService: MenuEventService) {
  }

  onTrack() {
    this.onTrackStatus = !this.onTrackStatus;
    this.menuEventService.prepareEvent("onTrack", this.onTrackStatus);
  }

  recordTrack() {
    this.recordTrackStatus = !this.recordTrackStatus;
    this.menuEventService.prepareEvent("recordTrack", this.recordTrackStatus);
  }

  ngOnInit() {
  }
}
