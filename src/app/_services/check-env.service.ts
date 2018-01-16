import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { CanActivate } from '@angular/router';

@Injectable()
export class CheckEnv implements CanActivate {

    constructor(private router: Router) { }

    canActivate() {
        console.log('checking env');
        const user: any = JSON.parse(localStorage.getItem('currentUser'));
        if (user === undefined ||
            user === null ||
            user === 'null' ||
            user.email === undefined ||
            user.email === null ||
            user.email === '') {
            localStorage.removeItem('currentUser');
            console.log('removing current user, bad format');
        }
        return true;
    }
}
