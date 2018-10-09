import { Inject, ElementRef, ViewChild, Component } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { Events } from '../_consts/events';

@Component({
  selector: 'app-dialog-files-open',
  templateUrl: './templates/app-dialog-files-open.html',
})
export class DialogFilesOpenComponent {
  public data: File[];

  @ViewChild('filesOpen')
  public uploadElement: ElementRef;

  constructor(public dialogRef: MatDialogRef<DialogFilesOpenComponent>) { }

  upload() {
    this.uploadElement.nativeElement.click();
  }

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


