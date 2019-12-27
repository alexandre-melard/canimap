import {Component, Inject} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';

@Component({
    selector: 'app-dialog-file-save',
    templateUrl: './templates/app-dialog-file-save.html',
})
export class DialogFileSaveComponent {
    constructor(
        public dialogRef: MatDialogRef<DialogFileSaveComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any) {
    }

    onNoClick(): void {
        this.dialogRef.close();
    }
}
