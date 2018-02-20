﻿import { Inject, Component } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

@Component({
  selector: 'app-dialog-helper',
  templateUrl: './templates/app-dialog-helper.html',
})
export class DialogHelperComponent {

  constructor(
    public dialogRef: MatDialogRef<DialogHelperComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) {
      this.data = data;
  }

  set dismissHelp(dh: boolean) {
    this.data.dismissHelp = true;
  }

  close(): void {
    this.dialogRef.close(this.data);
  }
}
