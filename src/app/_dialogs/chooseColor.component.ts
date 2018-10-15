﻿import { Inject, Optional, Component } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';


@Component({
  selector: 'app-dialog-choose-color',
  templateUrl: './templates/app-dialog-choose-color.html',
})
export class DialogChooseColorComponent {
  dataSource;
  constructor(
    public dialogRef: MatDialogRef<DialogChooseColorComponent>,
    @Optional() @Inject(MAT_DIALOG_DATA) public data: any) {
      this.data = data;
  }

  onNoClick(): void {
    this.dialogRef.close(this.data);
  }

  color(color: string): void {
    this.data = color;
    this.dialogRef.close(this.data);
  }
}
