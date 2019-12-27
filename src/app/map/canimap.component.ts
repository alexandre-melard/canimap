import {Component, HostListener, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {UserService} from '../_services/user.service';
import {MapService} from '../_services/map.service';
import {DeviceDetectorService} from 'ngx-device-detector';

@Component({
    selector: 'app-canimap-map',
    templateUrl: './canimap.component.html',
    styleUrls: ['./canimap.component.css']
})
export class CanimapComponent implements OnInit {
    notMobile = true;

    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private userService: UserService,
        private mapService: MapService,
        private deviceService: DeviceDetectorService
    ) {
        this.notMobile = !deviceService.isMobile();
    }

    ngOnInit(): void {
        this.userService.currentUser()
            .subscribe(user => {
                if (user) {
                    this.mapService.setMapFromUserPreferences(user).subscribe(() => this.mapService.loadMap());
                } else {
                    this.router.navigate(['/register']);
                }
            }, () => {
                this.router.navigate(['/register']);
            });
    }

    @HostListener('window:beforeunload', ['$event'])
    beforeunloadHandler() {
        return false;
    }

    @HostListener('window:unload', ['$event'])
    unloadHandler() {
        return false;
    }
}
