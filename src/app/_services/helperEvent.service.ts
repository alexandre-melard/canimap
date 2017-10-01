import { Injectable } from '@angular/core';
import { DialogHelperComponent } from '../_dialogs/helper.component';
import { MdDialog, MdDialogRef, MD_DIALOG_DATA } from '@angular/material';
import { Http, Response, Headers, RequestOptions } from '@angular/http';

@Injectable()
export class HelperEventService {
  constructor(
    public dialog: MdDialog,
    private http: Http) {
  }

  callHelper(key: string): boolean {
    return ('true' === localStorage.getItem(key + '_dismissHelp'));
  }

  showHelper(key: string, proceed: Function): void {
    if (('true' !== localStorage.getItem(key + '_dismissHelp'))) {
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
    localStorage.setItem(key + '_dismissHelp', 'true');
  }
}
