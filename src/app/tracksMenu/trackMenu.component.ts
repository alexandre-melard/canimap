import { ElementRef, Inject, NgZone, ViewChild, Component, OnInit } from '@angular/core';
import { MdDialog, MdDialogRef, MD_DIALOG_DATA } from '@angular/material';
import { FormControl } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { DataSource } from '@angular/cdk/collections';
import { Observable } from 'rxjs/Observable';
import { MapsAPILoader } from '@agm/core';
import { } from '@types/googlemaps';
import 'rxjs/add/observable/of';

import { AlertService, CanimapService, AuthenticationService, MenuEventService, HelperEventService } from '../_services/index';

@Component({
  selector: 'app-canimap-track-menu',
  moduleId: module.id.toString(),
  templateUrl: 'trackMenu.component.html'
})

export class TrackMenuComponent implements OnInit {
  gpsMarkerToggle = true;
  constructor(
    private canimapService: CanimapService,
    private menuEventService: MenuEventService,
    private helperEventService: HelperEventService,
    private mapsAPILoader: MapsAPILoader,
    public dialog: MdDialog,
    private ngZone: NgZone) { }

  ngOnInit() {
  }

  drawVictimPath(e: MouseEvent) {
    this.menuEventService.prepareEvent('drawVictimPath', null);
    const dismissHelp: boolean = this.helperEventService.callHelper('drawVictimPath');
    if (dismissHelp) {
      e.stopPropagation();
      this.menuEventService.proceed();
    }
  }

  drawK9Path(e: MouseEvent) {
    this.menuEventService.prepareEvent('drawK9Path', null);
    const dismissHelp: boolean = this.helperEventService.callHelper('drawK9Path');
    if (dismissHelp) {
      e.stopPropagation();
      this.menuEventService.proceed();
    }
  }

  parkingMarker(e: MouseEvent) {
    this.menuEventService.prepareEvent('parkingMarker', null);
    const dismissHelp: boolean = this.helperEventService.callHelper('parkingMarker');
    if (dismissHelp) {
      e.stopPropagation();
      this.menuEventService.proceed();
    }
  }

  gpsMarker(e: MouseEvent) {
    if (this.gpsMarkerToggle) {
      this.menuEventService.prepareEvent('gpsMarker', null);
      const dismissHelp: boolean = this.helperEventService.callHelper('gpsMarker');
      if (dismissHelp) {
        e.stopPropagation();
        this.menuEventService.proceed();
      }
    } else {
      this.menuEventService.callEvent('gpsMarkerDismiss', null);
      e.stopPropagation();
    }
    this.gpsMarkerToggle = !this.gpsMarkerToggle;
  }

  chooseLayers() {
    const dialogRef = this.dialog.open(DialogChooseLayersComponent, {
      width: '350px',
      data: this.canimapService.layers
    });
  }
}

@Component({
  selector: 'app-dialog-choose-layers',
  templateUrl: './app-dialog-choose-layers.html',
})
export class DialogChooseLayersComponent {
  dataSource;
  constructor(
    public dialogRef: MdDialogRef<TrackMenuComponent>,
    @Inject(MD_DIALOG_DATA) public data: any[]) {
      this.data = data;
      // this.dataSource = new LayersDataSource(data);
  }

  onNoClick(): void {
    this.dialogRef.close();
  }
  onInputChange(event: any, layer: any) {
    layer.layer.setOpacity(event.value);
    console.log('This is emitted as the thumb slides: ' + layer.name);
  }
}

// export class LayersDataSource extends DataSource<any> {
//   /** Connect function called by the table to retrieve one stream containing the data to render. */
//   data: any[];

//   constructor(data: any[]) {
//     super();
//     this.data = data;
//   }

//   connect(): Observable<Element[]> {
//     return Observable.of(this.data);
//   }

//   disconnect() {}
// }
