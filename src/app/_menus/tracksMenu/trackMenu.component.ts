import { Inject, Component, OnInit } from '@angular/core';
import { MdDialog, MdDialogRef, MD_DIALOG_DATA } from '@angular/material';
import { FormControl } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { DataSource } from '@angular/cdk/collections';
import { Observable } from 'rxjs/Observable';
import { MapsAPILoader } from '@agm/core';
import { } from '@types/googlemaps';
import { AlertService, AuthenticationService } from '../../_services/index';
import { HelperEventService } from '../../_services/helperEvent.service';
import { MenuEventService } from '../../_services/menuEvent.service';

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
    private menuEventService: MenuEventService,
    private helperEventService: HelperEventService,
    public dialog: MdDialog) { }
  states;

  ngOnInit() {
  }

  color(state: any) {
    let color = 'black';
    if (this.menuEventService.state === state) {
      color = 'red';
    }
    return color;
  }

  drawVictimPath(e: MouseEvent) {
    this.contextVisible = true;
    this.menuEventService.prepareEvent('drawVictimPath', null, null);
    this.helperEventService.showHelper('drawPath', () => {
      this.menuEventService.proceed();
    });
  }

  drawK9Path(e: MouseEvent) {
    this.contextVisible = true;
    this.menuEventService.prepareEvent('drawK9Path', null, null);
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
      width: '350px'
    });
  }
}
