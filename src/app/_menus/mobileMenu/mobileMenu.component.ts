import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { MenuEventService } from '../../_services/menuEvent.service';

@Component({
    selector: 'app-canimap-menu-mobile',
    moduleId: module.id.toString(),
    templateUrl: 'mobileMenu.component.html'
})

export class MenuMobileComponent implements OnInit {
    recordTrackStatus = false;

    constructor(private menuEventService: MenuEventService) {
    }

    recordTrack() {
        this.recordTrackStatus = !this.recordTrackStatus;
        this.menuEventService.callEvent('recordTrack', this.recordTrackStatus);
    }

    ngOnInit() {
    }
}
