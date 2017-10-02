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
  statesModel = {
    move: {
      label: 'move'
    },
    edit: {
      label: 'edit'
    },
    polyligne:
    {
      label: 'polyligne'
    },
    polygon:
    {
      label: 'polygon'
    },
    rectangle:
    {
      label: 'rectangle'
    },
    circle:
    {
      label: 'circle'
    }
  };
  states = this.statesModel.move;

  ngOnInit() {
  }

  color(state: any) {
    let color = 'black';
    if (this.states.label === state) {
      color = 'red';
    }
    return color;
  }

  move(event: any) {
    this.menuEventService.callEvent('drawEnd', null);
    this.states = this.statesModel.move;
  }

  edit(event: any) {
    this.menuEventService.prepareEvent('edit', null);
    this.helperEventService.showHelper('edit', () => {
      this.menuEventService.proceed();
    });
    this.states = this.statesModel.edit;
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

