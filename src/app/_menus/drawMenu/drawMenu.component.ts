import { Inject, Component, OnInit } from '@angular/core';
import { MdDialog, MdDialogRef, MD_DIALOG_DATA } from '@angular/material';
import { Observable } from 'rxjs/Observable';
import { AlertService, AuthenticationService } from '../../_services/index';
import { MapService } from '../../_services/map.service';
import { DrawService } from '../../_services/draw.service';
import { MenuEventService } from '../../_services/menuEvent.service';
import { HelperEventService } from '../../_services/helperEvent.service';

import { DialogChooseColorComponent } from '../../_dialogs/chooseColor.component';
import { DialogChooseLayersComponent } from '../../_dialogs/chooseLayer.component';

import 'rxjs/add/observable/of';
import * as $ from 'jquery';

@Component({
  selector: 'app-canimap-draw-menu',
  moduleId: module.id.toString(),
  templateUrl: 'drawMenu.component.html'
})

export class DrawMenuComponent implements OnInit {
  gpsMarkerToggle = true;
  constructor(
    private mapService: MapService,
    private drawService: DrawService,
    private menuEventService: MenuEventService,
    private helperEventService: HelperEventService,
    public dialog: MdDialog
  ) { }
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

  ngOnInit() {
  }


  polyligne(event: any) {
    this.menuEventService.prepareEvent('polyline', null);
    this.helperEventService.showHelper('polyline', () => {
      this.menuEventService.proceed();
    });
    this.states = this.statesModel.polyligne;
  }

  polygon(event: any) {
    this.menuEventService.prepareEvent('polygon', null);
    this.helperEventService.showHelper('polygon', () => {
      this.menuEventService.proceed();
    });
    this.states = this.statesModel.polygon;
  }

  rectangle(event: any) {
    this.menuEventService.prepareEvent('rectangle', null);
    this.helperEventService.showHelper('rectangle', () => {
      this.menuEventService.proceed();
    });
    this.states = this.statesModel.rectangle;
  }

  circle(event: any) {
    this.menuEventService.prepareEvent('circle', null);
    this.helperEventService.showHelper('circle', () => {
      this.menuEventService.proceed();
    });
    this.states = this.statesModel.circle;
  }

  chooseColor() {
    const dialogRef = this.dialog.open(DialogChooseColorComponent, {
      width: '500px',
      data: this.drawService.color
    });
    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      if (result !== undefined) {
        this.drawService.color = result;
        $('.app-canimap-color-chooser').css('background-color', result);
        $('.app-canimap-color-chooser').css('border-radius', '0');
      }
    });
  }
}

