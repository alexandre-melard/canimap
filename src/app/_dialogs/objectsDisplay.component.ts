import { Inject, Component } from '@angular/core';
import { DataSource } from '@angular/cdk/collections';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';
import { MapService } from '../_services/map.service';
import { LayerBox } from '../_models/layerBox';
import { CaniDrawObject } from '../_models/caniDrawObject';
import { DialogChooseColorComponent } from '../_dialogs/chooseColor.component';
import {MatTableDataSource} from '@angular/material';
declare var $;

@Component({
  selector: 'app-dialog-display-objects',
  templateUrl: './templates/app-dialog-objects-display.html',
})
export class DialogObjectsDisplayComponent {
  displayedColumns = ['index', 'name', 'position', 'color', 'fabric', 'wind', 'specificity'];
  dataSource: MatTableDataSource<CaniDrawObject>;

  constructor(
    public dialogRef: MatDialogRef<DialogObjectsDisplayComponent>,
    public dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public data: any) {
      this.dataSource = new MatTableDataSource<CaniDrawObject>(data.objects);
  }

  update(el: CaniDrawObject, key: string, value: string) {
    if (!value) { return; }
    // copy and mutate
    el[key] = value;
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
      if (result) {
        object.color = result;
      }
    });
  }

}

/**
 * Data source to provide what data should be rendered in the table. The observable provided
 * in connect should emit exactly the data that should be rendered by the table. If the data is
 * altered, the observable should emit that new set of data on the stream. In our case here,
 * we return a stream that contains only one set of data that doesn't change.
 */
export class ObjectDataSource extends DataSource<any> {

  private dataSubject = new BehaviorSubject<Element[]>([]);

  data() {
    return this.dataSubject.value;
  }

  update(data) {
    this.dataSubject.next(data);
  }

  constructor(data: any[]) {
    super();
    this.dataSubject.next(data);
  }

  /** Connect function called by the table to retrieve one stream containing the data to render. */
  connect(): Observable<Element[]> {
    return this.dataSubject;
  }

  disconnect() {}
}
