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
    users: User[] = [];

    constructor(private userService: UserService,
        private router: Router,
        private authenticationService: AuthenticationService) {
        this.currentUser = userService.currentUser();
    }

    ngOnInit() {
        this.loadAllUsers();
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

    deleteUser(id: number) {
        this.userService.delete(id).subscribe(() => this.loadAllUsers());
    }

    private loadAllUsers() {
        this.userService.getAll().subscribe(users => { this.users = users; });
    }
}
