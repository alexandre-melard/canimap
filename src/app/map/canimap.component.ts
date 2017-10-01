import { Component, OnInit } from '@angular/core';
import { MapService } from '../_services/map.service';

@Component({
  selector: 'app-canimap-map',
  templateUrl: './canimap.component.html',
  styleUrls: ['./canimap.component.css']
})
export class CanimapComponent implements OnInit {
  constructor(
    private mapService: MapService
  ) { }
  ngOnInit(): void {
    this.mapService.loadMap();
  }
}
