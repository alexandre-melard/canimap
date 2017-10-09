import { Component } from '@angular/core';
import { Router } from '@angular/router';

import { AlertService, UserService } from '../_services/index';

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

    constructor(
        private router: Router,
        private userService: UserService,
        private alertService: AlertService) { }

    register() {
        this.loading = true;
        this.userService.create(this.model)
            .subscribe(
                data => {
                    this.success = 'Enregistrement réussit';
                    this.router.navigate(['/']);
                },
                error => {
                    this.error = error;
                    this.loading = false;
                });
    }
}
