import {Component} from '@angular/core';
import {environment} from '../environments/environment';
import {AuthService} from './_services/auth.service';
import {AuthGuard} from './_services/auth-guard.service';
import {CaniDrawObjectService} from './_services/caniDrawObject.service';
import {CheckEnv} from './_services/check-env.service';
import {DrawService} from './_services/draw.service';
import {EventService} from './_services/event.service';
import {FileService} from './_services/file.service';
import {HelperEventService} from './_services/helperEvent.service';
import {LocationService} from './_services/location.service';
import {LogService} from './_services/log.service';
import {MapService} from './_services/map.service';
import {UserService} from './_services/user.service';

@Component({
    moduleId: module.id.toString(),
    selector: 'app-canimap',
    templateUrl: 'app.component.html',
    styleUrls: ['./app.component.css']
})

export class AppComponent {
    google_api = environment.google;
    google_src = 'https://www.googletagmanager.com/gtag/js?id=' + this.google_api;

    constructor(
        private authService: AuthService,
        private authGuard: AuthGuard,
        private caniDrawObjectService: CaniDrawObjectService,
        private checkEnv: CheckEnv,
        private drawService: DrawService,
        private eventService: EventService,
        private fileService: FileService,
        private helperEventService: HelperEventService,
        private locationService: LocationService,
        private logService: LogService,
        private mapService: MapService,
        private userService: UserService
    ) {
    }
}
