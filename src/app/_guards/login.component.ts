import { Component, OnInit, OnDestroy  } from '@angular/core';
import { AuthService } from '../_services/auth.service';
import { Subscription } from 'rxjs/Subscription';
import { Router } from '@angular/router';

@Component({
  template: ``
})
export class LoginComponent implements OnInit, OnDestroy  {
  loggedInSub: Subscription;

  constructor(private auth: AuthService, private router: Router) {
      this.auth.login();
  }

  ngOnInit() {
    this.loggedInSub = this.auth.loggedIn$.subscribe(
      loggedIn => loggedIn ? this.router.navigate(['/map']) : null
    );
  }

  ngOnDestroy() {
    this.loggedInSub.unsubscribe();
  }
}
