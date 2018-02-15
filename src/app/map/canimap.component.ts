import { Component, OnInit, HostListener } from '@angular/core';
import { MapService } from '../_services/map.service';
import { FileService } from '../_services/file.service';

@Component({
  selector: 'app-canimap-map',
  templateUrl: './canimap.component.html',
  styleUrls: ['./canimap.component.css']
})
export class CanimapComponent implements OnInit {
  constructor(
    private mapService: MapService,
    private fileService: FileService
  ) { }
  ngOnInit(): void {
    this.mapService.loadMap();
  }

  @HostListener('window:beforeunload', ['$event'])
  beforeunloadHandler(event) {
      return false;
  }

  @HostListener('window:unload', ['$event'])
  unloadHandler(event) {
      return false;
  }
}
