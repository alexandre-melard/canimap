import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { User } from '../_models/index';
import { UserService } from '../_services/user.service';
import { AuthService } from '../_services/auth.service';
import { MatTabChangeEvent } from '@angular/material';
import * as $ from 'jquery';

const CHANGES = [
  '4.13.1', '4.13.0',
  '4.12.0',
  '4.11.4', '4.11.3', '4.11.2', '4.11.1', '4.11.0',
  '4.10.4', '4.10.3', '4.10.2', '4.10.1', '4.10.0',
  '4.9.2', '4.9.1', '4.9.0',
  '4.8.4', '4.8.3', '4.8.2', '4.8.1', '4.8.0',
  '4.7.1',
  '4.6.0',
  '4.5.0',
  '4.4.0',
  '4.3.3', '4.3.2', '4.3.1', '4.3.0',
  '4.2.3', '4.2.2', '4.2.1', '4.2.0',
  '4.1.1', '4.1.0',
  '4.0.0'
];

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
    userService.currentUser().subscribe(user => this.currentUser = user);
  }

  loadChanges() {
    CHANGES.forEach(change => {
      const changeElement = $('<div class="changelog"></div>').load('../assets/changelogs/' + change + '.html');
      $('#modifications').append(changeElement);
    });
    $('#modifications').append($('<hr/>'));
  }

  change(event: MatTabChangeEvent) {
    console.log('tab changed');
    switch (event.index) {
      case 1:
        this.loadChanges();
        break;
      case 2:
        break;
    }
  }

  resetPassword() {
    this.authenticationService.login();
  }

  ngOnInit() {
  }

  logout() {
    this.authenticationService.logout();
    this.router.navigate(['/']);
  }

  deleteUser() {
    this.userService.delete(this.currentUser.email).subscribe((user: User) => {
      this.logout();
    });
  }
}
