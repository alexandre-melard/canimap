import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from '@angular/material';
import {CaniDrawObject} from '../_models/caniDrawObject';
import {DialogChooseColorComponent} from './chooseColor.component';

@Component({
    selector: 'app-dialog-objects-add',
    templateUrl: './templates/app-dialog-objects-add.html',
})
export class DialogObjectsAddComponent implements OnInit {
    step = 0;
    caniDrawObject: CaniDrawObject;
    position = {value: 'Gauche', label: 'à gauche'};
    positions = [
        {value: 'Gauche', label: 'A gauche'},
        {value: 'Droite', label: 'A droite'}
    ];
    vent = {value: 'Gauche', label: 'De la gauche'};
    vents = [
        {value: 'Gauche', label: 'De la gauche'},
        {value: 'Droite', label: 'De la droite'},
        {value: 'Face', label: 'De face'},
        {value: 'Dos', label: 'De dos'}
    ];
    fabric = {value: 'tissu', label: 'En tissu'};
    fabrics = [
        {value: 'tissu', label: 'En tissu'},
        {value: 'cuir', label: 'En cuir'},
        {value: 'carton', label: 'En carton'},
        {value: 'plastique', label: 'En plastique'},
        {value: 'bois', label: 'En bois'},
    ];
    type = {value: 'posé', label: 'Posé'};
    types = [
        {value: 'PoseMarker', label: 'Posé'},
        {value: 'SuspenduMarker', label: 'Suspendu'},
        {value: 'CacheMarker', label: 'Caché'}
    ];

    constructor(
        public dialogRef: MatDialogRef<DialogObjectsAddComponent>,
        public dialog: MatDialog,
        @Inject(MAT_DIALOG_DATA) public data) {
        this.caniDrawObject = new CaniDrawObject();
        this.caniDrawObject.type = 'PoseMarker';
    }

    ngOnInit() {
    }

    setStep(index: number) {
        this.step = index;
    }

    nextStep() {
        this.step++;
    }

    prevStep() {
        this.step--;
    }

    save(): void {
        this.caniDrawObject.specificity = this.types.find((type) => type.value === this.caniDrawObject.type).label;
        this.dialogRef.close(this.caniDrawObject);
    }

    getColor(color: string) {
        if (color && !color.startsWith('#')) {
            color = '#' + color;
        }
        return color;
    }

    chooseColor() {
        const dialogRef = this.dialog.open(DialogChooseColorComponent, {
            width: '500px'
        });
        dialogRef.afterClosed().subscribe(result => {
            if (result) {
                this.caniDrawObject.color = result;
            }
        });
    }
}
