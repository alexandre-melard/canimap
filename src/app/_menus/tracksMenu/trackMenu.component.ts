import { ElementRef, Inject, Optional, NgZone, ViewChild, Component, OnInit } from '@angular/core';
import { MdDialog, MdDialogRef, MD_DIALOG_DATA } from '@angular/material';
import { FormControl } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { DataSource } from '@angular/cdk/collections';
import { Observable } from 'rxjs/Observable';
import { MapsAPILoader } from '@agm/core';
import { } from '@types/googlemaps';
import { AlertService, CanimapService, AuthenticationService, MenuEventService, HelperEventService } from '../../_services/index';
import { DialogChooseColorComponent } from '../../_dialogs/chooseColor.component';
import { DialogChooseLayersComponent } from '../../_dialogs/chooseLayer.component';

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

  get editColor(): string {
    return this.canimapService.editing ? 'red' : 'black';
  }

  get deleteColor(): string {
    return this.canimapService.deleting ? 'red' : 'black';
  }

  edit(event: any) {
    this.canimapService.editing = !this.canimapService.editing;
    if (this.canimapService.editing) {
      this.menuEventService.prepareEvent('editing', null, null);
      this.helperEventService.showHelper('editing', () => {
        this.menuEventService.proceed();
      });
    } else {
      this.menuEventService.callEvent('editing', null);
    }
  }

  delete(event: any) {
    this.canimapService.deleting = !this.canimapService.deleting;
    if (this.canimapService.deleting) {
      this.menuEventService.prepareEvent('deleting', null, null);
      this.helperEventService.showHelper('deleting', () => {
        this.menuEventService.proceed();
      });
    } else {
      this.menuEventService.callEvent('deleting', null);
    }
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
    this.states = this.statesModel.polyligne;
    this.menuEventService.prepareEvent('drawVictimPath', null, ( result: any ) => {
      this.contextVisible = false;
    });
    this.helperEventService.showHelper('drawPath', () => {
      this.menuEventService.proceed();
    });
  }

  drawK9Path(e: MouseEvent) {
    this.contextVisible = true;
    this.states = this.statesModel.polyligne;
    this.menuEventService.prepareEvent('drawK9Path', null, ( result: any ) => {
      this.contextVisible = false;
    });
    this.helperEventService.showHelper('drawPath', () => {
      this.menuEventService.proceed();
    });
  }

  parkingMarker(e: MouseEvent) {
    this.menuEventService.prepareEvent('parkingMarker', null, null);
    this.helperEventService.showHelper('marker', () => {
      this.menuEventService.proceed();
    });
  }

  gpsColor() {
    return this.gpsMarkerToggle ? 'black' : 'red';
  }

  gpsMarker(e: MouseEvent) {
    if (this.gpsMarkerToggle) {
      this.menuEventService.prepareEvent('gpsMarker', null, null);
      this.helperEventService.showHelper('gps', () => {
        this.menuEventService.proceed();
      });
    } else {
      this.menuEventService.callEvent('gpsMarkerDismiss', null);
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
