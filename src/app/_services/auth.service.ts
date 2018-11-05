import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { AUTH_CONFIG } from '../_consts/settings';
import { UserService } from '../_services/user.service';
import { LogService } from '../_services/log.service';

import { Auth0Lock } from 'auth0-lock';

@Injectable()
export class AuthService {

  // Create a stream of logged in status to communicate throughout app
  loggedIn: boolean;
  loggedIn$ = new BehaviorSubject<boolean>(this.loggedIn);

  constructor(
    private router: Router,
    private userService: UserService,
    private log: LogService
  ) {
  }

  setLoggedIn(value: boolean) {
    // Update login status subject
    this.loggedIn$.next(value);
    this.loggedIn = value;
  }

  login(route?: string) {
    const lock = new Auth0Lock(
      AUTH_CONFIG.CLIENT_ID,
      AUTH_CONFIG.CLIENT_DOMAIN,
      {
        language: 'fr',
        auth: {
          responseType: AUTH_CONFIG.RESPONSE_TYPE,
          audience: AUTH_CONFIG.AUDIENCE,
          params: {
            scope: AUTH_CONFIG.SCOPE
          }
        },
        theme: {
          logo: AUTH_CONFIG.LOGO,
          primaryColor: AUTH_CONFIG.PRIMARY_COLOR
        },
        languageDictionary: {
          emailInputPlaceholder: 'votre email',
          title: 'Connectez vous!'
        },
      },
      (error, result) => this.log.error('[AuthService] Error while calling Auth0: ' + JSON.stringify(error))
    );
    lock.on('show', () => this.log.debug('[AuthService] lock is shown'));
    lock.on('hide', () => this.log.debug('[AuthService] lock is hidden'));
    lock.on('unrecoverable_error', error => {
      this.log.error('[AuthService] lock unrecoverable_error: ' + JSON.stringify(error));
    });
    lock.on('authorization_error', error => {
      this.log.error('[AuthService] lock authorization_error: ' + JSON.stringify(error));
    });
    const me = this;
    lock.on('authenticated', authResult => {
      lock.hide ();
      me.setLoggedIn(true);
      lock.getUserInfo(authResult.accessToken, function(error, profile) {
        if (error) {
          this.log.error('[AuthService] Error while trying to get user info' + JSON.stringify(error));
          me.router.navigate(['/']);
          return;
        }
        // window.location.hash = '';
        me._setSession(authResult, profile);
        me.userService.currentUser().subscribe(
          user => {
          if (user) {
            me.router.navigate(['/map']);
          } else {
            me.router.navigate(['/register']);
          }
        });
      });
    });
    lock.show();
  }

  private _setSession(authResult, profile) {
    const expTime = authResult.expiresIn * 1000 + Date.now();
    // Save session data and update login status subject
    localStorage.setItem('access_token', authResult.accessToken);
    localStorage.setItem('id_token', authResult.idToken);
    localStorage.setItem('profile', JSON.stringify(profile));
    localStorage.setItem('expires_at', JSON.stringify(expTime));
    localStorage.setItem('email', profile.email);
    this.setLoggedIn(true);
  }

  logout() {
    // Remove tokens and profile and update login status subject
    localStorage.removeItem('access_token');
    localStorage.removeItem('id_token');
    localStorage.removeItem('profile');
    localStorage.removeItem('expires_at');
    localStorage.removeItem('currentUser');
    this.router.navigate(['/']);
    this.setLoggedIn(false);
  }

  get authenticated(): boolean {
    // Check if current date is greater than expiration
    const expiresAt = JSON.parse(localStorage.getItem('expires_at'));
    return Date.now() < expiresAt;
  }
}
