import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { MenuEventService } from '../../_services/menuEvent.service';
import * as NoSleep from 'nosleep.js';

@Component({
    selector: 'app-canimap-menu-mobile',
    moduleId: module.id.toString(),
    templateUrl: 'mobileMenu.component.html'
})

export class MenuMobileComponent implements OnInit {
    recordTrackStatus = false;
    noSleep;

    constructor(private menuEventService: MenuEventService) {
        this.noSleep = new NoSleep();
    }

    recordTrack() {
        this.recordTrackStatus = !this.recordTrackStatus;
        if (this.recordTrackStatus) {
            this.noSleep.enable();
        } else {
            this.noSleep.disable();
        }
        this.menuEventService.callEvent('recordTrack', this.recordTrackStatus);
    }

    addObject() {
        this.menuEventService.callEvent('addObjectToTrack', this.recordTrackStatus);
    }

    get color(): string {
        return  this.recordTrackStatus ? 'warn' : 'default';
    }

    ngOnInit() {
    }
}
