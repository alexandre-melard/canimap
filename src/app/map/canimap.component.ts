import { Component, OnInit } from '@angular/core';
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
}
