import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { User } from '../_models/index';
import { UserService } from '../_services/index';
import { AuthenticationService } from '../_services/authentication.service';
import { checkPassword } from '../_utils/password-checker';

import * as $ from 'jquery';

@Component({
  moduleId: module.id.toString(),
  templateUrl: 'home.component.html'
})

export class HomeComponent implements OnInit {
  currentUser: User;
  model = { password: '1', passwordConfirm: '2' };
  success;
  error;

  constructor(
    private userService: UserService,
    private router: Router,
    private authenticationService: AuthenticationService) {
    this.currentUser = userService.currentUser();
  }
  loadChanges() {
    const changelog = $('.changelog');
    $.each(changelog, (i, c) => {
      c = $(c);
      c.load(c.attr('data-include'));
    });
  }

  change(event) {
    console.log('tab changed');
    switch (event) {
      case 1:
        this.loadChanges();
        break;
      case 2:
        break;
    }
  }


  save() {
    this.success = '';
    this.error = '';
    const res = checkPassword(this.model.password, this.model.passwordConfirm);
    if (res.success) {
      this.userService.modifyPassword(this.userService.currentUser().id, this.model.password);
      this.success = res.success;
    }
    if (res.error) {
      this.error = res.error;
    }
  }

  ngOnInit() {
  }

  logout() {
    this.authenticationService.logout();
    this.router.navigate(['/']);
  }

  deleteUser() {
    this.userService.delete(this.currentUser.id).subscribe(() => {
      this.logout();
    });
  }
}
