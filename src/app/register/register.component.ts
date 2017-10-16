import { Component } from '@angular/core';
import { Router } from '@angular/router';

import { AlertService, UserService } from '../_services/index';
import { User } from '../_models/user';
import { checkPassword } from '../_utils/password-checker';
import * as $ from 'jquery';

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
  private _user: User;

  get user(): User {
    return this.userService.currentUser();
  }

  constructor(
    private router: Router,
    private userService: UserService,
    private alertService: AlertService) {
    const user = this.userService.currentUser();
    if (user !== undefined && user !== null) {
      this.model = user;
      this.udpate = true;
    } else {
      this.model = new User();
    }
  }
  save() {
    this.success = '';
    this.error = '';
    const res = checkPassword(this.model.password, this.model.passwordConfirm);
    if (res.error) {
      this.error = res.error;
    } else {
      if (this.udpate) {
        this.edit();
      } else {
        this.register();
      }
    }
  }

  edit() {
    this.loading = true;
    $('.loading').css('visibility', 'visible');
    this.userService.update(this.model)
      .subscribe(
      data => {
        this.success = 'Enregistrement réussit';
        this.loading = false;
        $('.loading').css('visibility', 'hidden');
      },
      error => {
        this.error = error;
        this.loading = false;
        $('.loading').css('visibility', 'hidden');
      });
  }

  register() {
    this.loading = true;
    $('.loading').css('visibility', 'visible');
    this.userService.create(this.model)
      .subscribe(
      data => {
        this.success = 'Votre utilisateur a été créé avec succès';
        this.router.navigate(['/']);
        $('.loading').css('visibility', 'hidden');
      },
      error => {
        this.error = error;
        this.loading = false;
        $('.loading').css('visibility', 'hidden');
      });
  }
}
