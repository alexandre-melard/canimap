import { Injectable } from '@angular/core';
import { DialogHelperComponent } from '../_dialogs/helper.component';
import { MdDialog, MdDialogRef, MD_DIALOG_DATA } from '@angular/material';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { User } from '../_models/user';
import { Helper } from '../_models/helper';
import { UserService } from '../_services/user.service';

@Injectable()
export class HelperEventService {

  constructor(
    public dialog: MdDialog,
    private userService: UserService,
    private http: Http) {
  }


  getHelper(key: string): Promise<Helper> {
    let helper: Helper;
    return new Promise<Helper>((resolve, reject) => {
      this.userService.currentUser()
        .then(user => {
          if (user.helpers === undefined) {
            user.helpers = new Array<Helper>();
          }
          if ((helper = user.helpers.find((h) => h.key === key)) === undefined) {
            helper = new Helper();
            helper.key = key;
            helper.visible = true;
            user.helpers.push(helper);
          }
          resolve(helper);
        })
        .catch(err => reject(err));
    });
  }

  isHelper(key: string): boolean {
    return (this.getHelper(key) !== undefined);
  }

  showHelper(key: string, proceed: Function): void {
    this.getHelper(key)
      .then(helper => {
        if ((helper !== undefined) && helper.visible) {
          this.http.get('../assets/helpers/' + key + '.json')
            .subscribe((data: any) => {
              data = data.json();
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
      })
      .catch(err => console.log(err));
  }

  dismissHelp(key: string) {
    this.getHelper(key).then(helper => {
      helper.visible = false;
      this.userService.currentUser().then(user => this.userService.update(user));
    });
  }
}
