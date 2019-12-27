import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {User} from '../_models';
import {UserService} from '../_services/user.service';
import {AuthService} from '../_services/auth.service';
import {MatTabChangeEvent} from '@angular/material';

declare var $;

@Component({
    moduleId: module.id.toString(),
    templateUrl: 'home.component.html'
})

export class HomeComponent implements OnInit {
    currentUser = new User();
    success;
    error;

    constructor(
        private userService: UserService,
        private router: Router,
        private authenticationService: AuthService) {
        userService.currentUser().subscribe(user => this.currentUser = user);
    }

    loadChanges() {
        const changeElement = $('<div class="changelog"></div>').load('../assets/changelog.html');
        $('#modifications').append(changeElement);
    }

    change(event: MatTabChangeEvent) {
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

}
