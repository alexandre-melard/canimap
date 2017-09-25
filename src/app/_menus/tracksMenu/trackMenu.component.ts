import { ElementRef, Inject, Optional, NgZone, ViewChild, Component, OnInit } from '@angular/core';
import { MdDialog, MdDialogRef, MD_DIALOG_DATA } from '@angular/material';
import { FormControl } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { DataSource } from '@angular/cdk/collections';
import { Observable } from 'rxjs/Observable';
import { MapsAPILoader } from '@agm/core';
import { } from '@types/googlemaps';
import { AlertService, CanimapService, AuthenticationService, MenuEventService, HelperEventService } from '../../_services/index';

import 'rxjs/add/observable/of';
import * as $ from 'jquery';

@Component({
  selector: 'app-canimap-track-menu',
  moduleId: module.id.toString(),
  templateUrl: 'trackMenu.component.html'
})

export class TrackMenuComponent implements OnInit {
  gpsMarkerToggle = true;
  contextVisible = false;
  constructor(
    private router: Router,
    private canimapService: CanimapService,
    private menuEventService: MenuEventService,
    private helperEventService: HelperEventService,
    private mapsAPILoader: MapsAPILoader,
    public dialog: MdDialog,
    private ngZone: NgZone) { }
  states;
  statesModel = {
    edit: [
      {
        label: 'Terminer',
        id: 0,
        end: true
      },
      {
        label: 'Annuler',
        id: 1,
        end: true
      }
    ],
    polyligne: [
      {
        label: 'Terminer',
        id: 0,
        end: true
      },
      {
        label: 'Annuler le dernier point',
        id: 1,
        end: false
      },
      {
        label: 'Annuler',
        id: 2,
        end: true
      }
    ],
    polygon: [
      {
        label: 'Terminer',
        id: 0,
        end: true
      },
      {
        label: 'Annuler le dernier point',
        id: 1,
        end: false
      },
      {
        label: 'Annuler',
        id: 2,
        end: true
      }
    ],
    rectangle: [
      {
        label: 'Annuler',
        id: 0,
        end: true
      }
    ],
    circle: [
      {
        label: 'Annuler',
        id: 0,
        end: true
      }
    ]

  };

  get visible(): boolean {
    return this.router.url === '/map';
  }

  ngOnInit() {
  }

  edit(event: any) {
    $('a.leaflet-draw-edit-edit')[0].click();
    this.contextVisible = true;
    this.states = this.statesModel.edit;
  }

  polyligne(event: any) {
    $('a.leaflet-draw-draw-polyline')[0].click();
    this.contextVisible = true;
    this.states = this.statesModel.polyligne;
  }

  polygon(event: any) {
    $('a.leaflet-draw-draw-polygon')[0].click();
    this.contextVisible = true;
    this.states = this.statesModel.polygon;
  }

  rectangle(event: any) {
    $('a.leaflet-draw-draw-rectangle')[0].click();
    this.contextVisible = true;
    this.states = this.statesModel.rectangle;
  }

  circle(event: any) {
    $('a.leaflet-draw-draw-circle')[0].click();
    this.contextVisible = true;
    this.states = this.statesModel.circle;
  }

  drawVictimPath(e: MouseEvent) {
    this.contextVisible = true;
    this.menuEventService.prepareEvent('drawVictimPath', null, ( result: any ) => {
      this.contextVisible = false;
    });
    const dismissHelp: boolean = this.helperEventService.callHelper('drawVictimPath');
    if (dismissHelp) {
      e.stopPropagation();
      this.menuEventService.proceed();
    }
  }

  drawK9Path(e: MouseEvent) {
    this.contextVisible = true;
    this.menuEventService.prepareEvent('drawK9Path', null, ( result: any ) => {
      this.contextVisible = false;
    });
    const dismissHelp: boolean = this.helperEventService.callHelper('drawK9Path');
    if (dismissHelp) {
      e.stopPropagation();
      this.menuEventService.proceed();
    }
  }

  parkingMarker(e: MouseEvent) {
    this.menuEventService.prepareEvent('parkingMarker', null, null);
    const dismissHelp: boolean = this.helperEventService.callHelper('parkingMarker');
    if (dismissHelp) {
      e.stopPropagation();
      this.menuEventService.proceed();
    }
  }

  gpsMarker(e: MouseEvent) {
    if (this.gpsMarkerToggle) {
      this.menuEventService.prepareEvent('gpsMarker', null, null);
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
      data: {layers: this.canimapService.layers, service: this.canimapService}
    });
  }

  chooseColor() {
    const dialogRef = this.dialog.open(DialogChooseColorComponent, {
      width: '500px',
      data: this.canimapService.color
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      if (result !== undefined) {
        this.canimapService.color = result;
        $('.app-canimap-color-chooser').css('background-color', result);
        $('.app-canimap-color-chooser').css('border-radius', '0');
      }
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
    @Inject(MD_DIALOG_DATA) public data: any) {
      this.data = data;
  }

  onNoClick(): void {
    this.dialogRef.close();
  }
  onInputChange(event: any, layer: any) {
    this.data.service.setOpacity(layer, event.value);
    console.log('This is emitted as the thumb slides: ' + layer.name);
  }
}


@Component({
  selector: 'app-dialog-choose-color',
  templateUrl: './app-dialog-choose-color.html',
})
export class DialogChooseColorComponent {
  dataSource;
  constructor(
    public dialogRef: MdDialogRef<TrackMenuComponent>,
    @Optional() @Inject(MD_DIALOG_DATA) public data: any) {
      this.data = data;
  }

  onNoClick(): void {
    this.dialogRef.close(this.data);
  }

  color(color: string): void {
    this.data = color;
    this.dialogRef.close(this.data);
  }
}
