import { Inject, Component } from '@angular/core';
import { MdDialog, MdDialogRef, MD_DIALOG_DATA } from '@angular/material';
import {HelperEventService} from '../_services/helperEvent.service';

@Component({
  selector: 'app-dialog-helper',
  templateUrl: './templates/app-dialog-helper.html',
})
export class DialogHelperComponent {

  constructor(
    public dialogRef: MdDialogRef<DialogHelperComponent>,
    @Inject(MD_DIALOG_DATA) public data: any) {
      this.data = data;
  }

  set dismissHelp(dh: boolean) {
    this.data.dismissHelp = true;
  }

  close(): void {
    this.dialogRef.close(this.data);
  }
}
