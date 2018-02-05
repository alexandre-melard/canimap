import { Inject, Component } from '@angular/core';
import { MdDialog, MdDialogRef, MD_DIALOG_DATA } from '@angular/material';
import { MapService } from '../_services/map.service';
import { LayerBox } from '../_models/layerBox';

@Component({
  selector: 'app-dialog-display-objects',
  templateUrl: './templates/app-dialog-display-objects.html',
})
export class DialogDisplayObjectsComponent {
  objects;
  constructor(
    public dialogRef: MdDialogRef<DialogDisplayObjectsComponent>,
    @Inject(MD_DIALOG_DATA) public data: any) {
      this.objects = data.objects;
    }

  confirm(): void {
    this.dialogRef.close();
  }
  getColor(color: string) {
    return '#' + color;
  }
}
