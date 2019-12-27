import {Component, ElementRef, Inject, ViewChild} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';
import {LogService} from '../_services/log.service';

@Component({
    selector: 'app-dialog-file-open',
    templateUrl: './templates/app-dialog-file-open.html',
})
export class DialogFileOpenComponent {
    types;

    @ViewChild('fileOpen', {static: false})
    public uploadElement: ElementRef;

    constructor(
        public dialogRef: MatDialogRef<DialogFileOpenComponent>,
        private log: LogService,
        @Inject(MAT_DIALOG_DATA) public data: any) {
        this.types = '.' + (<string[]>this.data.types).join(',.');
        this.data = undefined;
    }

    upload() {
        this.uploadElement.nativeElement.click();
    }

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
            this.log.error(`[DialogFileOpenComponent] You can only load one file at a time`);
        }
        this.data = files[0]; // FileList object.
    }

    dragover(evt) {
        evt.stopPropagation();
        evt.preventDefault();
        evt.dataTransfer.dropEffect = 'copy'; // Explicitly show this is a copy.
    }
}
