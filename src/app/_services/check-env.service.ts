import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { CanActivate } from '@angular/router';

@Injectable()
export class CheckEnv implements CanActivate {

    constructor(private router: Router) { }

    canActivate() {
        console.log('checking env');
        const currentUser = localStorage.getItem('currentUser');
        if (currentUser !== null && currentUser.startsWith('{') && currentUser.endsWith('}')) {
            const user: any = JSON.parse(currentUser);
            if (user === undefined ||
                user === null ||
                user === 'null' ||
                user.email === undefined ||
                user.email === null ||
                user.email === '' ||
                user.currentUser !== undefined) {
                localStorage.removeItem('currentUser');
                console.log('removing current user, bad format');
            }
        } else if (currentUser !== null) {
            localStorage.removeItem('currentUser');
            console.log('removing current user, bad format');
        }
        return true;
    }
}
