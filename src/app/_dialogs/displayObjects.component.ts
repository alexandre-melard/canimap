import { Inject, Component } from '@angular/core';
import { MdDialog, MdDialogRef, MD_DIALOG_DATA } from '@angular/material';
import { MapService } from '../_services/map.service';
import { LayerBox } from '../_models/layerBox';
import { CaniDrawObject } from '../_models/caniDrawObject';
import { DialogChooseColorComponent } from '../_dialogs/chooseColor.component';
import * as $ from 'jquery';

@Component({
  selector: 'app-dialog-display-objects',
  templateUrl: './templates/app-dialog-display-objects.html',
})
export class DialogDisplayObjectsComponent {
  private objects;
  constructor(
    public dialogRef: MdDialogRef<DialogDisplayObjectsComponent>,
    public dialog: MdDialog,
    @Inject(MD_DIALOG_DATA) public data: any) {
      this.objects = data.objects;
    }

  confirm(): void {
    this.dialogRef.close();
  }

  getColor(color: string) {
    if (color && !color.startsWith('#')) {
      color = '#' + color;
    }
    return color;
  }

  chooseColor(object: CaniDrawObject) {
    const dialogRef = this.dialog.open(DialogChooseColorComponent, {
      width: '500px',
      data: object.color
    });
    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      if (result !== undefined) {
        object.color = result;
      }
    });
  }

}
