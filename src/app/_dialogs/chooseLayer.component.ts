import { Inject, Component } from '@angular/core';
import { MdDialog, MdDialogRef, MD_DIALOG_DATA } from '@angular/material';
import { MapService } from '../_services/map.service';
import { LayerBox } from '../_models/layerBox';

@Component({
  selector: 'app-dialog-choose-layers',
  templateUrl: './templates/app-dialog-choose-layers.html',
})
export class DialogChooseLayersComponent {
  layerBoxes;
  constructor(
    private mapService: MapService,
    public dialogRef: MdDialogRef<DialogChooseLayersComponent>) {
      this.layerBoxes = this.mapService.layerBoxes;
  }

  confirm(): void {
    this.dialogRef.close();
    this.mapService.saveOpacity();
  }

  onInputChange(event: any, layerBox: LayerBox) {
    this.mapService.setOpacity(layerBox, event.value);
  }
}
