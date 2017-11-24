import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { User } from '../_models/index';
import { UserService } from '../_services/index';
import { AuthService } from '../_services/auth.service';

import * as $ from 'jquery';

@Component({
  moduleId: module.id.toString(),
  templateUrl: 'home.component.html'
})

export class HomeComponent implements OnInit {
  currentUser = new User();
  model = { password: '1', passwordConfirm: '2' };
  success;
  error;

  constructor(
    private userService: UserService,
    private router: Router,
    private authenticationService: AuthService) {
    userService.currentUser().then(user => this.currentUser = user);
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
    this.userService.modifyPassword(this.currentUser.email, this.model.password);
    this.success = 'Modification du mot de passe enregistrée';
  }

  ngOnInit() {
  }

  logout() {
    this.authenticationService.logout();
    this.router.navigate(['/']);
  }

  deleteUser() {
    this.userService.delete(this.currentUser.email).then((user: User) => {
      this.logout();
    });
  }
}
