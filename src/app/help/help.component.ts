import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { User } from '../_models/index';
import { UserService } from '../_services/index';

import * as $ from 'jquery';

@Component({
  moduleId: module.id.toString(),
  templateUrl: 'help.component.html'
})

export class HelpComponent implements OnInit {
  currentUser: User;
  users: User[] = [];
  content = {
    'fileSave': { title: '', body: '' },
    'filesOpen': { title: '', body: '' },
    'loadGPS': { title: '', body: '' },
    'polyline': { title: '', body: '' },
    'marker': { title: '', body: '' },
    'gps': { title: '', body: '' }
  };

  constructor(private userService: UserService,
    private router: Router) {
      userService.currentUser().subscribe(user => this.currentUser = user as User);
    }

  ngOnInit() {
    ['fileSave', 'filesOpen', 'loadGPS', 'polyline', 'marker', 'gps'].forEach((what) => {
      this.getJson(what, (res) => {
        this.content[what].title = res.title;
        this.content[what].body = res.body;
      });
    });
  }

  getJson(name: string, success: Function) {
    const me = this;
    $.get('../assets/helpers/' + name + '.json', function (data) {
      success(data);
    });
  }
}
