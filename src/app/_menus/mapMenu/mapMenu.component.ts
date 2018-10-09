import { Inject, Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FormControl } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { DataSource } from '@angular/cdk/collections';
import { Observable } from 'rxjs/Observable';
import { MapsAPILoader } from '@agm/core';
import { } from '@types/googlemaps';
import { HelperEventService } from '../../_services/helperEvent.service';
import { EventService } from '../../_services/event.service';
import { BaseMenuComponent } from '../baseMenu';

import { DialogChooseColorComponent } from '../../_dialogs/chooseColor.component';
import { DialogChooseLayersComponent } from '../../_dialogs/chooseLayer.component';

import 'rxjs/add/observable/of';
import { MapService } from '../../_services/map.service';
import { Events } from '../../_consts/events';
import { Helpers } from '../../_consts/helpers';
declare var $;

@Component({
  selector: 'app-canimap-map-menu',
  moduleId: module.id.toString(),
  templateUrl: 'mapMenu.component.html'
})

export class MapMenuComponent extends BaseMenuComponent implements OnInit {
  constructor(
    private router: Router,
    public eventService: EventService,
    public helperEventService: HelperEventService,
    private mapService: MapService,
    public dialog: MatDialog) {
    super(eventService, helperEventService);
  }

  ngOnInit() {
  }

  color(state: any) {
    let color: string;
    [Events.MAP_STATE_MOVE].forEach((states) => {
      if (this.eventService.state === state) {
        color = 'red';
      } else {
        color = 'black';
      }
    });
    if (!color) {
      color = super.color(state);
    }
    return color;
  }

  move(event?: any): void {
    this.eventService.call(Events.MAP_STATE_MOVE);
  }

  gpsMarker(e: MouseEvent) {
    this.helperEventService.showHelper(Helpers.MAP_DRAW_GPS,
      () => this.mapService.gpsMarker()
    );
  }

  chooseLayers(event: any) {
    const dialogRef = this.dialog.open(DialogChooseLayersComponent, {
      width: '350px'
    });
  }
}
