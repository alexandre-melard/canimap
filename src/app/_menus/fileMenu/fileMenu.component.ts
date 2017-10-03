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
  loading = false;

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

  fileSave(e: MouseEvent) {
    this.menuEventService.prepareEvent('fileSave', null);
    this.helperEventService.showHelper('fileSave', () => {
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