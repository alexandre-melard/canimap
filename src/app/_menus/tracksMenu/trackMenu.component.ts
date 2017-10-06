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
import { BaseMenuComponent } from '../baseMenu';

import { DialogChooseColorComponent } from '../../_dialogs/chooseColor.component';
import { DialogChooseLayersComponent } from '../../_dialogs/chooseLayer.component';

import 'rxjs/add/observable/of';
import * as $ from 'jquery';

@Component({
  selector: 'app-canimap-track-menu',
  moduleId: module.id.toString(),
  templateUrl: 'trackMenu.component.html'
})

export class TrackMenuComponent extends BaseMenuComponent {
  gpsMarkerToggle = true;
  contextVisible = false;
  constructor(
    private router: Router,
    public menuEventService: MenuEventService,
    public helperEventService: HelperEventService,
    public dialog: MdDialog) {
    super(menuEventService, helperEventService);
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

  chooseLayers(event: any) {
    const dialogRef = this.dialog.open(DialogChooseLayersComponent, {
      width: '350px'
    });
  }
}
