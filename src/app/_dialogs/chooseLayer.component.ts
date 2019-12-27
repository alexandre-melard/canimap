import {Component} from '@angular/core';
import {MatDialogRef} from '@angular/material';
import {MapService} from '../_services/map.service';
import {LayerBox} from '../_models/layerBox';

@Component({
    selector: 'app-dialog-choose-layers',
    templateUrl: './templates/app-dialog-choose-layers.html',
})
export class DialogChooseLayersComponent {
    layerBoxes;

    constructor(
        private mapService: MapService,
        public dialogRef: MatDialogRef<DialogChooseLayersComponent>) {
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
