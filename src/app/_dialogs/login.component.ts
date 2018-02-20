import { Inject, Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from '../_services/auth.service';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

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
    private authenticationService: AuthService,
    public dialogRef: MatDialogRef<DialogLoginComponent>) { }

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
    this.authenticationService.login();
  }
}
