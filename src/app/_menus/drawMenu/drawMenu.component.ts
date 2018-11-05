import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';
import { DrawService } from '../../_services/draw.service';
import { EventService } from '../../_services/event.service';
import { HelperEventService } from '../../_services/helperEvent.service';
import { BaseMenuComponent } from '../baseMenu';

import { DialogChooseColorComponent } from '../../_dialogs/chooseColor.component';
import { Events } from '../../_consts/events';
import { Helpers } from '../../_consts/helpers';
import { LogService } from '../../_services/log.service';

declare var $;

@Component({
  selector: 'app-canimap-draw-menu',
  moduleId: module.id.toString(),
  templateUrl: 'drawMenu.component.html'
})

export class DrawMenuComponent extends BaseMenuComponent implements OnInit {

  constructor(
    private log: LogService,
    private drawService: DrawService,
    public eventService: EventService,
    public helperEventService: HelperEventService,
    public dialog: MatDialog
  ) {
    super(eventService, helperEventService);
  }

  ngOnInit() {
    this.log.debug('[DrawMenuComponent] [INIT]');
  }

  color(state: any) {
    let color: string;
    [Events.MAP_DRAW_EDIT, Events.MAP_DRAW_DELETE].forEach((states) => {
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

  edit(event: any) {
    this.helperEventService.showHelper(Helpers.MAP_DRAW_EDIT, () => {
      this.eventService.call(Events.MAP_DRAW_EDIT);
    });
  }

  delete(event: any) {
    this.helperEventService.showHelper(Helpers.MAP_DRAW_DELETE, () => {
      this.eventService.call(Events.MAP_DRAW_DELETE);
    });
  }

  chooseColor(event: any) {
    const dialogRef = this.dialog.open(DialogChooseColorComponent, {
      width: '500px',
      data: this.drawService.color
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.drawService.color = result;
        $('.app-canimap-color-chooser > span > img').css('background-color', result);
        $('.app-canimap-color-chooser > span > img').css('border-radius', '20px');
        $('.app-canimap-color-chooser').css('border-radius', '0');
      }
    });
  }
}
