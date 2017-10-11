import { Inject, Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AlertService, AuthenticationService } from '../_services/index';
import { MdDialog, MdDialogRef, MD_DIALOG_DATA } from '@angular/material';
import { UserService } from '../_services/user.service';

import * as $ from 'jquery';

@Component({
  selector: 'app-dialog-choose-layers',
  templateUrl: './templates/app-dialog-login.html',
})
export class DialogLoginComponent implements OnInit {
  model: any = {};
  loading = false;
  error: string;
  returnUrl: string;
  showForm: boolean;
  showReset: boolean;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private authenticationService: AuthenticationService,
    private userService: UserService,
    private alertService: AlertService,
    public dialogRef: MdDialogRef<DialogLoginComponent>) { }

  ngOnInit() {
    const users = JSON.parse(localStorage.getItem('users'));
    this.showForm = !(users === undefined || users === null || users.length === 0);
    this.showReset = false;

    // reset login status
    this.authenticationService.logout();

    // get return url from route parameters or default to '/'
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
  }

  register() {
    this.dialogRef.close();
    this.router.navigate(['/register']);
  }

  login() {
    this.loading = true;
    const me = this;
    $('.loading').css('visibility', 'visible');
    this.authenticationService.login(this.model.username, this.model.password)
      .subscribe(
      data => {
        me.loading = false;
        me.router.navigate([this.returnUrl]);
        me.dialogRef.close();
        $('.loading').css('visibility', 'hidden');
      },
      error => {
        this.showReset = true;
        me.error = error;
        me.loading = false;
        $('.loading').css('visibility', 'hidden');
      });
  }
}
