import { Inject, Component, OnInit } from '@angular/core';
import { MdDialog, MdDialogRef, MD_DIALOG_DATA } from '@angular/material';
import { Observable } from 'rxjs/Observable';
import { AlertService, AuthenticationService } from '../../_services/index';
import { MapService } from '../../_services/map.service';
import { DrawService } from '../../_services/draw.service';
import { MenuEventService } from '../../_services/menuEvent.service';
import { HelperEventService } from '../../_services/helperEvent.service';
import { BaseMenuComponent } from '../baseMenu';

import { DialogChooseColorComponent } from '../../_dialogs/chooseColor.component';
import { DialogChooseLayersComponent } from '../../_dialogs/chooseLayer.component';

import 'rxjs/add/observable/of';
import * as $ from 'jquery';

@Component({
  selector: 'app-canimap-draw-menu',
  moduleId: module.id.toString(),
  templateUrl: 'drawMenu.component.html'
})

export class DrawMenuComponent extends BaseMenuComponent implements OnInit {
  constructor(
    private mapService: MapService,
    private drawService: DrawService,
    public menuEventService: MenuEventService,
    public helperEventService: HelperEventService,
    public dialog: MdDialog
  ) {
    super(menuEventService, helperEventService);
  }

  ngOnInit() {
  }

  color(state: any) {
    let color: string;
    ['edit', 'delete'].forEach((states) => {
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

  edit(event: any) {
    this.menuEventService.prepareEvent('edit', null);
    this.helperEventService.showHelper('edit', () => {
      this.menuEventService.proceed();
    });
  }

  delete(event: any) {
    this.menuEventService.prepareEvent('delete', null);
    this.helperEventService.showHelper('delete', () => {
      this.menuEventService.proceed();
    });
  }

  chooseColor(event: any) {
    const dialogRef = this.dialog.open(DialogChooseColorComponent, {
      width: '500px',
      data: this.drawService.color
    });
    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      if (result !== undefined) {
        this.drawService.color = result;
        $('.app-canimap-color-chooser > span > img').css('background-color', result);
        $('.app-canimap-color-chooser > span > img').css('border-radius', '20px');
        $('.app-canimap-color-chooser').css('border-radius', '0');
      }
    });
  }
}
