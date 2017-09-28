import { Inject, Component } from '@angular/core';
import { MdDialog, MdDialogRef, MD_DIALOG_DATA } from '@angular/material';

@Component({
  selector: 'app-dialog-choose-layers',
  templateUrl: './templates/app-dialog-choose-layers.html',
})
export class DialogChooseLayersComponent {
  dataSource;
  constructor(
    public dialogRef: MdDialogRef<DialogChooseLayersComponent>,
    @Inject(MD_DIALOG_DATA) public data: any) {
      this.data = data;
  }

  confirm(): void {
    this.dialogRef.close();
    this.data.service.saveOpacity();
  }

  onInputChange(event: any, layer: any) {
    this.data.service.setOpacity(layer, event.value);
  }
}
