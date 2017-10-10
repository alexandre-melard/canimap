import { Inject, Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AlertService, AuthenticationService } from '../_services/index';
import { MdDialog, MdDialogRef, MD_DIALOG_DATA } from '@angular/material';
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

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private authenticationService: AuthenticationService,
    private alertService: AlertService,
    public dialogRef: MdDialogRef<DialogLoginComponent>) { }

  ngOnInit() {
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
    $('.loading').css('visibility', 'visible');
    this.authenticationService.login(this.model.username, this.model.password)
      .subscribe(
      data => {
        this.dialogRef.close();
        this.router.navigate([this.returnUrl]);
      },
      error => {
        this.error = error;
        this.loading = false;
        $('.loading').css('visibility', 'hidden');
      });
  }
}
