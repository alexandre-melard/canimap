import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { CanActivate } from '@angular/router';
import { LogService } from '../_services/log.service';

@Injectable()
export class CheckEnv implements CanActivate {

    constructor(
        private router: Router,
        private log: LogService
    ) { }

    canActivate() {
        const currentUser = localStorage.getItem('currentUser');
        if (currentUser && currentUser.startsWith('{') && currentUser.endsWith('}')) {
            const user: any = JSON.parse(currentUser);
            if (!user ||
                user === 'null' ||
                !user.email ||
                user.email === '') {
                localStorage.removeItem('currentUser');
                this.log.info('you have an old version of the app, cleaning up local cookies');
            }
        } else if (currentUser) {
            localStorage.removeItem('currentUser');
            this.log.info('you have an old version of the app, cleaning up local cookies');
        }
        return true;
    }
}
