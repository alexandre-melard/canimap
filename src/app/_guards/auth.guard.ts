import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { MdDialog } from '@angular/material';
import { DialogLoginComponent } from '../_dialogs/login.component';
import { User } from '../_models/user';

@Injectable()
export class AuthGuard implements CanActivate {

  constructor(private router: Router,
    public dialog: MdDialog
  ) { }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    const user: User = JSON.parse(localStorage.getItem('currentUser'));

    if ((user) && (user.lastLogin !== undefined) && (Math.round((Date.now() - user.lastLogin) / 1000) < (24 * 60 * 60))) {
      // logged in so return true
      return true;
    }
    const dialogRef = this.dialog.open(DialogLoginComponent, {
      width: '500px'
    });

    // not logged in so redirect to login page with the return url
    // this.router.navigate(['/login'], { queryParams: { returnUrl: state.url } });
    return false;
  }
}
