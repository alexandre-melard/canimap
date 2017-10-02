import { Inject, Component } from '@angular/core';
import { MdDialog, MdDialogRef, MD_DIALOG_DATA } from '@angular/material';

@Component({
  selector: 'app-dialog-file-open',
  templateUrl: './templates/app-dialog-file-open.html',
})
export class DialogFileOpenComponent {
  public data: File;
  constructor(public dialogRef: MdDialogRef<DialogFileOpenComponent>) { }

  fileReceived(evt: any) {
    this.data = evt.target.files[0];
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  drop(evt) {
    evt.stopPropagation();
    evt.preventDefault();
    const files = evt.dataTransfer.files;
    if (files.length > 1) {
      alert("Vous ne pouvez charger qu'un fichier gpx à la fois!'");
    }
    this.data = files[0]; // FileList object.
  }

  dragover(evt) {
    evt.stopPropagation();
    evt.preventDefault();
    evt.dataTransfer.dropEffect = 'copy'; // Explicitly show this is a copy.
  }
}
