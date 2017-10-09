import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { User } from '../_models/index';
import { UserService } from '../_services/index';
import { AuthenticationService } from '../_services/authentication.service';

import * as $ from 'jquery';

@Component({
    moduleId: module.id.toString(),
    templateUrl: 'help.component.html'
})

export class HelpComponent implements OnInit {
    currentUser: User;
    users: User[] = [];
    content = {
        files: {
            'fileSave': { title: '', body: '' }, 'filesOpen': { title: '', body: '' }, 'loadGPS': { title: '', body: '' }
        },
        ru: { 'polyline': { title: '', body: '' }, 'marker': { title: '', body: '' }, 'gps': { title: '', body: '' } }
    };

    constructor(private userService: UserService,
        private router: Router,
        private authenticationService: AuthenticationService) {
        this.currentUser = userService.currentUser();
    }

    ngOnInit() {
        this.getJson('fileSave', (res) => {
            this.content.files.fileSave.title = res.title;
            this.content.files.fileSave.body = res.body;
        });
    }

    getJson(name: string, success: Function) {
        const me = this;
        $.get('../assets/helpers/' + name + '.json', function (data) {
            success(data);
        });
    }
}
