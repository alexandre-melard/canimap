import { Injectable } from '@angular/core';
import { DialogHelperComponent } from '../_dialogs/helper.component';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { HttpClient } from '@angular/common/http';
import { User } from '../_models/user';
import { Helper } from '../_models/helper';
import { UserService } from '../_services/user.service';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class HelperEventService {

  constructor(
    public dialog: MatDialog,
    private userService: UserService,
    private http: HttpClient) {
  }


  getHelper(key: string): Observable<Helper> {
    const helperObs = new Observable<Helper>((observer) => {
      const currentUser = this.userService.currentUser();
      currentUser.subscribe(user => {
        if (user.helpers === undefined) {
          user.helpers = new Array<Helper>();
        }
        let helper;
        if ((helper = user.helpers.find((h) => h.key === key)) === undefined) {
          helper = new Helper();
          helper.key = key;
          helper.visible = true;
          user.helpers.push(helper);
        }
        observer.next(helper);
      });
    });
    return helperObs;
  }

  isHelper(key: string): boolean {
    return (this.getHelper(key) !== undefined);
  }

  showHelper(key: string, proceed: Function): void {
    this.getHelper(key)
      .subscribe(helper => {
        if ((helper !== undefined) && helper.visible) {
          this.http.get('../assets/helpers/' + key + '.json')
            .subscribe((data: any) => {
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
      });
  }

  dismissHelp(key: string) {
    this.getHelper(key).subscribe(helper => {
      helper.visible = false;
      this.userService.currentUser().subscribe(user => this.userService.update(user).subscribe());
    });
  }
}
