import { Component, OnInit } from '@angular/core';
import { MenuEventService, HelperEventService } from '../_services/index';

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
    private helperEventService: HelperEventService
  ) { }

  ngOnInit() {
  }

  fileSave(e: MouseEvent) {
    this.menuEventService.prepareEvent('fileSave', null);
    const dismissHelp: boolean = this.helperEventService.callHelper('fileSave');
    if (dismissHelp) {
      e.stopPropagation();
      this.menuEventService.proceed();
    }
  }

  fileOpen(e: MouseEvent) {
    this.menuEventService.prepareEvent('fileOpen', null);
    const dismissHelp: boolean = this.helperEventService.callHelper('fileOpen');
    if (dismissHelp) {
      e.stopPropagation();
      this.menuEventService.proceed();
    }
  }

  fileReceived(event: any) {
    const file = event.target.files[0];
    this.menuEventService.callEvent('fileReceived', file);
  }

}
