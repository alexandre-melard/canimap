import { Inject, Component } from '@angular/core';
import { MdDialog, MdDialogRef, MD_DIALOG_DATA } from '@angular/material';

@Component({
  selector: 'app-dialog-file-save',
  templateUrl: './templates/app-dialog-file-save.html',
})
export class DialogFileSaveComponent {
  constructor(
    public dialogRef: MdDialogRef<DialogFileSaveComponent>,
    @Inject(MD_DIALOG_DATA) public data: any) { }

  onNoClick(): void {
    this.dialogRef.close();
  }
}
