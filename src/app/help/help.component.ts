import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { User } from '../_models/index';
import { UserService } from '../_services/user.service';
import { Helpers } from '../_consts/helpers';

declare var $;

@Component({
  moduleId: module.id.toString(),
  templateUrl: 'help.component.html'
})

export class HelpComponent implements OnInit {
  currentUser: User;
  users: User[] = [];
  helps = [];

  constructor(private userService: UserService,
    private router: Router) {
    userService.currentUser().subscribe(user => this.currentUser = user as User);

  }

  ngOnInit() {
    const me = this;
    [
      Helpers.MAP_FILE_SAVE,
      Helpers.MAP_FILES_OPEN,
      Helpers.MAP_FILE_LOAD_GPS,
      Helpers.MAP_DRAW_POLYLINE,
      Helpers.MAP_DRAW_MARKER,
      Helpers.MAP_DRAW_GPS
    ].forEach(
      what => {
        me.getJson(
          what,
          res => {
            me.helps.push(res);
          }
        );
      }
    );
  }

  getJson(name: string, success: Function) {
    const me = this;
    $.get('../assets/helpers/' + name + '.json', function (data) {
      success(data);
    });
  }
}
