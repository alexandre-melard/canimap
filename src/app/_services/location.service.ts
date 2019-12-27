import {Injectable, OnDestroy} from '@angular/core';
import {EventService} from './event.service';
import {LogService} from './log.service';
import {Events} from '../_consts/events';

@Injectable()
export class LocationService implements OnDestroy {

    constructor(
        private eventService: EventService,
        private log: LogService
    ) {
        this.eventService.subscribe(Events.MAP_MOVE_CURRENT, () => this.moveToCurrentPosition());
    }

    moveToCurrentPosition() {
        navigator.geolocation.getCurrentPosition(
            position => {
                this.eventService.call(
                    Events.MAP_MOVE,
                    {
                        lat: position.coords.latitude, lng: position.coords.longitude
                    });
            },
            error => this.log.error('[LocationComponent] Error while getting current position: ' + JSON.stringify(error)),
            {
                enableHighAccuracy: true
            }
        );
    }

    ngOnDestroy() {
    }
}
