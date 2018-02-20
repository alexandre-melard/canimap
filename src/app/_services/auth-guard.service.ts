import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { CanActivate } from '@angular/router';
import { AuthService } from './auth.service';

@Injectable()
export class AuthGuard implements CanActivate {
    deviceInfo = null;

    constructor(
        private auth: AuthService,
        private router: Router
    ) {
    }

    canActivate() {
        if (!this.auth.authenticated) {
            this.router.navigate(['/login']);
            return false;
        }
        return true;
    }
}
