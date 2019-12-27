import {Component, OnInit} from '@angular/core';
import {MatDialog} from '@angular/material';
import {HelperEventService} from '../../_services/helperEvent.service';
import {EventService} from '../../_services/event.service';
import {BaseMenuComponent} from '../baseMenu';

import {DialogChooseLayersComponent} from '../../_dialogs/chooseLayer.component';


import {MapService} from '../../_services/map.service';
import {Events} from '../../_consts/events';
import {Helpers} from '../../_consts/helpers';
import {LogService} from '../../_services/log.service';

declare var $;

@Component({
    selector: 'app-canimap-map-menu',
    moduleId: module.id.toString(),
    templateUrl: 'mapMenu.component.html'
})

export class MapMenuComponent extends BaseMenuComponent implements OnInit {
    constructor(
        private log: LogService,
        public eventService: EventService,
        public helperEventService: HelperEventService,
        private mapService: MapService,
        public dialog: MatDialog) {
        super(eventService, helperEventService);
    }

    ngOnInit() {
        this.log.debug('[MapMenuComponent] [INIT]');
    }

    color(state: any) {
        let color: string;
        [Events.MAP_STATE_MOVE].forEach((states) => {
            if (this.eventService.state === state) {
                color = 'red';
            } else {
                color = 'black';
            }
        });
        if (!color) {
            color = super.color(state);
        }
        return color;
    }

    move(event?: any): void {
        this.eventService.call(Events.MAP_STATE_MOVE);
    }

    zoom(resolution: number): void {
        this.eventService.call(Events.MAP_SET_RESOLUTION, resolution);
    }

    gpsMarker(e: MouseEvent) {
        this.helperEventService.showHelper(Helpers.MAP_DRAW_GPS,
            () => this.mapService.gpsMarker()
        );
    }

    chooseLayers(event: any) {
        const dialogRef = this.dialog.open(DialogChooseLayersComponent, {
            width: '350px'
        });
    }
}
