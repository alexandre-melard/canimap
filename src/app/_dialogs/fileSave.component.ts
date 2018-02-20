import { Inject, Component } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

@Component({
  selector: 'app-dialog-file-save',
  templateUrl: './templates/app-dialog-file-save.html',
})
export class DialogFileSaveComponent {
  constructor(
    public dialogRef: MatDialogRef<DialogFileSaveComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) { }

  onNoClick(): void {
    this.dialogRef.close();
  }
}
