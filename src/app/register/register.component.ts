import { Component } from '@angular/core';
import { Router } from '@angular/router';

import { AlertService, UserService } from '../_services/index';

@Component({
  moduleId: module.id.toString(),
  templateUrl: 'register.component.html',
  styleUrls: ['register.component.css']
})

export class RegisterComponent {
  model: any = {};
  loading = false;
  error: string;
  success: string;
  udpate: boolean;

  constructor(
    private router: Router,
    private userService: UserService,
    private alertService: AlertService) {
    const user = this.userService.currentUser();
    if (user !== undefined) {
      this.model = user;
      this.udpate = true;
    }
  }
  save() {
    if (this.udpate) {
      this.edit();
    } else {
      this.register();
    }
  }

  edit() {
    this.loading = true;
    this.userService.update(this.model)
      .subscribe(
      data => {
        this.success = 'Enregistrement réussit';
        this.loading = false;
      },
      error => {
        this.error = error;
        this.loading = false;
      });
  }

  register() {
    this.loading = true;
    this.userService.create(this.model)
      .subscribe(
      data => {
        this.success = 'Enregistrement réussit';
        this.router.navigate(['/']);
      },
      error => {
        this.error = error;
        this.loading = false;
      });
  }
}
