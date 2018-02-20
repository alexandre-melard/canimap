import { Component } from '@angular/core';
import { Router } from '@angular/router';

import { AlertService, UserService } from '../_services/index';
import { User } from '../_models/user';
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

  constructor(
    private router: Router,
    private userService: UserService,
    private alertService: AlertService) {
    userService.currentUser()
      .subscribe(user => {
        if (user === null) {
          this.model = new User();
          this.model.email = localStorage.getItem('email');
          console.log('creating new user with email:' + this.model.email);
        } else {
          this.model = user;
          this.udpate = true;
          console.log('editing user with email:' + this.model.email);
        }
      });
  }
  save() {
    this.success = '';
    this.error = '';
    if (this.udpate) {
      this.edit();
    } else {
      this.register();
    }
  }

  edit() {
    this.loading = true;
    $('.loading').css('visibility', 'visible');
    this.userService.update(this.model)
      .subscribe((user: User) => {
        this.success = 'Enregistrement réussit';
        this.loading = false;
        $('.loading').css('visibility', 'hidden');
      }, error => {
        this.error = error;
        this.loading = false;
        $('.loading').css('visibility', 'hidden');
      });
  }

  register() {
    this.loading = true;
    $('.loading').css('visibility', 'visible');
    this.userService.create(this.model)
      .subscribe((user: User) => {
        this.success = 'Votre utilisateur a été créé avec succès';
        this.router.navigate(['/']);
        $('.loading').css('visibility', 'hidden');
      }, error => {
        this.error = error;
        this.loading = false;
        $('.loading').css('visibility', 'hidden');
      });
  }
}
