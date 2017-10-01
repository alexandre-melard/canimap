import { Inject, Component } from '@angular/core';
import { MdDialog, MdDialogRef, MD_DIALOG_DATA } from '@angular/material';

@Component({
  selector: 'app-dialog-files-open',
  templateUrl: './templates/app-dialog-files-open.html',
})
export class DialogFilesOpenComponent {
  public data: File[];
  constructor(public dialogRef: MdDialogRef<DialogFilesOpenComponent>) { }

  fileReceived(evt: any) {
    this.data = evt.target.files; // FileList object.
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  drop(evt) {
    evt.stopPropagation();
    evt.preventDefault();
    this.data = evt.dataTransfer.files; // FileList object.
  }

  dragover(evt) {
    evt.stopPropagation();
    evt.preventDefault();
    evt.dataTransfer.dropEffect = 'copy'; // Explicitly show this is a copy.
  }
}


