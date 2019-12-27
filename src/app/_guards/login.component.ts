import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {AuthService} from '../_services/auth.service';
import {LogService} from '../_services/log.service';

@Component({
    selector: 'app-login',
    templateUrl: './app-login.html',
})
export class LoginComponent implements OnInit {
    model: any = {};
    loading = false;
    error: string;
    dest: string;

    constructor(
        private log: LogService,
        private route: ActivatedRoute,
        private router: Router,
        private authenticationService: AuthService) {
    }

    ngOnInit() {
        this.log.debug('[LoginComponent] [INIT]');
        if (this.route.snapshot.fragment && this.route.snapshot.fragment.startsWith('access_token') || localStorage.getItem('email')) {
            this.authenticationService.login();
        }
    }

    login() {
        this.authenticationService.login();
    }
}
