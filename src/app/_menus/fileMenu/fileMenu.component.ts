import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MenuEventService } from '../../_services/menuEvent.service';
import { HelperEventService } from '../../_services/helperEvent.service';

@Component({
  selector: 'app-canimap-file-menu',
  moduleId: module.id.toString(),
  templateUrl: 'fileMenu.component.html'
})

export class FileMenuComponent implements OnInit {
  model: any = {};

  constructor(
    private menuEventService: MenuEventService,
    private helperEventService: HelperEventService,
    private router: Router
  ) { }

  get visible(): boolean {
    return this.router.url === '/map';
  }

  ngOnInit() {
  }

  printScreen(e: MouseEvent) {
    this.menuEventService.callEvent('printScreen', null);
  }

  fileSave(e: MouseEvent) {
    this.menuEventService.prepareEvent('fileSave', null);
    this.helperEventService.showHelper('fileSave', () => {
      this.menuEventService.proceed();
    });
  }

  facebook(e: MouseEvent) {
    this.menuEventService.prepareEvent('facebook', null);
    this.helperEventService.showHelper('facebook', () => {
      this.menuEventService.proceed();
    });
  }

  filesOpen(e: MouseEvent) {
    this.menuEventService.prepareEvent('filesOpen', null);
    this.helperEventService.showHelper('filesOpen', () => {
      this.menuEventService.proceed();
    });
  }

  gps(e: MouseEvent) {
    this.menuEventService.prepareEvent('fileOpen', ['gpx', 'kml']);
    this.helperEventService.showHelper('loadGPS', () => {
      this.menuEventService.proceed();
    });
  }
}
