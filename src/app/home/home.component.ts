import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { User } from '../_models/index';
import { UserService } from '../_services/index';
import { AuthenticationService } from '../_services/authentication.service';

import * as $ from 'jquery';

@Component({
  moduleId: module.id.toString(),
  templateUrl: 'home.component.html'
})

export class HomeComponent implements OnInit {
  currentUser: User;

  constructor(private userService: UserService,
    private router: Router,
    private authenticationService: AuthenticationService) {
    this.currentUser = userService.currentUser();
  }

  ngOnInit() {
    const changelog = $('.changelog');
    $.each(changelog, (i, c) => {
      c = $(c);
      c.load(c.attr('data-include'));
    });
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
