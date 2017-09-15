import { Injectable, OnInit, OnDestroy } from '@angular/core';

import { MenuEventService } from '../_services/menuEvent.service';
import { CanimapService } from '../_services/canimap.service';
import { Subscription } from 'rxjs/Subscription';

import * as $ from 'jquery';
import { Map } from 'leaflet';
import * as L from 'leaflet';

@Injectable()
export class FileService implements OnDestroy {
  private map: Map;
  private subscriptions = new Array<Subscription>();

  constructor(
    private menuEventService: MenuEventService,
    private canimapService: CanimapService
  ) {}

  subscribe() {
    const map = this.map;

    this.subscriptions.push(this.menuEventService.getObservable('fileSave').subscribe(
      () => {
        // Get geojson data
        const geoJson = this.canimapService.geoJSON;
        const data: any = {};
        data['type'] = 'FeatureCollection';
        data['features'] = geoJson;

        // Stringify the GeoJson
        const convertedData = 'text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(data));

        // Create export
        document.getElementById('exportFile').setAttribute('href', 'data:' + convertedData);
        document.getElementById('exportFile').setAttribute('download', 'carte.geojson');
      },
      e => console.log('onError: %s', e),
      () => console.log('onCompleted')
    ));
    this.subscriptions.push(this.menuEventService.getObservable('fileOpen').subscribe(
      () => {
      },
      e => console.log('onError: %s', e),
      () => console.log('onCompleted')
    ));
  }

  ngOnDestroy() {
    // prevent memory leak when component destroyed
    console.log('unsubscribing from canimap service');
    for (const subscription of this.subscriptions) {
      subscription.unsubscribe();
    }
  }

}
