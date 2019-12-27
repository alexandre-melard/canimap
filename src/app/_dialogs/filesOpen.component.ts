import {Component, ElementRef, ViewChild} from '@angular/core';
import {MatDialogRef} from '@angular/material';

@Component({
    selector: 'app-dialog-files-open',
    templateUrl: './templates/app-dialog-files-open.html',
})
export class DialogFilesOpenComponent {
    public data: File[];

    @ViewChild('filesOpen', {static: false})
    public uploadElement: ElementRef;

    constructor(public dialogRef: MatDialogRef<DialogFilesOpenComponent>) {
    }

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


