import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { EventService } from '../../_services/event.service';
import * as NoSleep from 'nosleep.js';
import { Events } from '../../_consts/events';

@Component({
    selector: 'app-canimap-menu-mobile',
    moduleId: module.id.toString(),
    templateUrl: 'mobileMenu.component.html'
})

export class MenuMobileComponent implements OnInit {
    recordTrackStatus = false;
    noSleep;

    constructor(private eventService: EventService) {
        this.noSleep = new NoSleep();
    }

    recordTrack() {
        this.recordTrackStatus = !this.recordTrackStatus;
        if (this.recordTrackStatus) {
            this.noSleep.enable();
        } else {
            this.noSleep.disable();
        }
        this.eventService.call(Events.MAP_DRAW_TRACK_RECORD, this.recordTrackStatus);
    }

    addObject() {
        this.eventService.call(Events.MAP_DRAW_OBJECT_ADD, this.recordTrackStatus);
    }

    get color(): string {
        return  this.recordTrackStatus ? 'warn' : 'default';
    }

    ngOnInit() {
    }
}
