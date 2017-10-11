import { Injectable } from '@angular/core';
import { DialogHelperComponent } from '../_dialogs/helper.component';
import { MdDialog, MdDialogRef, MD_DIALOG_DATA } from '@angular/material';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { User } from '../_models/user';
import { Helper } from '../_models/helper';
import { UserService } from '../_services/user.service';

@Injectable()
export class HelperEventService {
  user: User;
  constructor(
    public dialog: MdDialog,
    private userService: UserService,
    private http: Http) {
    this.user = this.userService.currentUser();
  }


  getHelper(key: string): Helper {
    let helper: Helper;
    const user = this.user;
    if (user.helpers === undefined) {
      user.helpers = new Array<Helper>();
    }
    if ((helper = user.helpers.find((h) => h.key === key)) === undefined) {
      helper = new Helper();
      helper.key = key;
      helper.visible = true;
      user.helpers.push(helper);
      this.userService.update(user);
    }
    return helper;
  }

  isHelper(key: string): boolean {
    return (this.getHelper(key) !== undefined);
  }

  showHelper(key: string, proceed: Function): void {
    const helper = this.getHelper(key);
    if ((helper !== undefined) && helper.visible) {
      this.http.get('../assets/helpers/' + key + '.json')
        .map(res => res.json())
        .subscribe(data => {
          const dialogRef = this.dialog.open(DialogHelperComponent, {
            width: '700px',
            data: { title: data.title, body: data.body, key: key, dismissHelp: false }
          });
          dialogRef.afterClosed().subscribe(result => {
            console.log('The dialog was closed: ' + key);
            if (result !== undefined && result.dismissHelp) {
              this.dismissHelp(key);
            }
            proceed();
          });
        },
        err => console.log(err),
        () => console.log('Completed'));
    } else {
      proceed();
    }
  }

  dismissHelp(key: string) {
    this.getHelper(key).visible = false;
    this.userService.update(this.user);
  }
}
