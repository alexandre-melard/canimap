import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { AlertService, AuthenticationService } from '../_services/index';
import { MenuEventService } from '../_services/menuEvent.service';

@Component({
  selector: 'canimap-menu-mobile',
  moduleId: module.id.toString(),
  templateUrl: 'mobile.component.html'
})

export class MenuMobileComponent implements OnInit {
  model:any = {};
  loading = false;
  onTrackStatus:boolean = false;
  recordTrackStatus:boolean = false;

  constructor(private menuEventService:MenuEventService) {
  }

  onTrack() {
    this.onTrackStatus = !this.onTrackStatus;
    this.menuEventService.callEvent("onTrack", this.onTrackStatus);
  }

  recordTrack() {
    this.recordTrackStatus = !this.recordTrackStatus;
    this.menuEventService.callEvent("recordTrack", this.recordTrackStatus);
  }

  ngOnInit() {
  }
}
