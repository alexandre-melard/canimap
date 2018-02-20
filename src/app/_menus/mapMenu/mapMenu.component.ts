import { Inject, Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FormControl } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { DataSource } from '@angular/cdk/collections';
import { Observable } from 'rxjs/Observable';
import { MapsAPILoader } from '@agm/core';
import { } from '@types/googlemaps';
import { HelperEventService } from '../../_services/helperEvent.service';
import { MenuEventService } from '../../_services/menuEvent.service';
import { BaseMenuComponent } from '../baseMenu';

import { DialogChooseColorComponent } from '../../_dialogs/chooseColor.component';
import { DialogChooseLayersComponent } from '../../_dialogs/chooseLayer.component';

import 'rxjs/add/observable/of';
import * as $ from 'jquery';

@Component({
  selector: 'app-canimap-map-menu',
  moduleId: module.id.toString(),
  templateUrl: 'mapMenu.component.html'
})

export class MapMenuComponent extends BaseMenuComponent implements OnInit {
  constructor(
    private router: Router,
    public menuEventService: MenuEventService,
    public helperEventService: HelperEventService,
    public dialog: MatDialog) {
    super(menuEventService, helperEventService);
  }

  ngOnInit() {
    this.move();
  }

  color(state: any) {
    let color: string;
    ['move'].forEach((states) => {
      if (this.menuEventService.state === state) {
        color = 'red';
      } else {
        color = 'black';
      }
    });
    if (color === undefined) {
      color = super.color(state);
    }
    return color;
  }

  move(event?: any): void {
    this.menuEventService.callEvent('move', null);
  }

  gpsMarker(e: MouseEvent) {
    this.menuEventService.prepareEvent('gpsMarker', null, null);
    this.helperEventService.showHelper('gps', () => {
      this.menuEventService.proceed();
    });
  }

  chooseLayers(event: any) {
    const dialogRef = this.dialog.open(DialogChooseLayersComponent, {
      width: '350px'
    });
  }
}
