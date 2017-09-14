import { Injectable, OnInit, OnDestroy } from '@angular/core';

import { MenuEventService } from '../_services/menuEvent.service';
import { Subscription } from 'rxjs/Subscription';
import { Map, Layer, Path, Icon, LayerEvent, LeafletEvent, LocationEvent } from 'leaflet';
import * as formatcoords from 'formatcoords';

import * as $ from 'jquery';
import * as L from 'leaflet';

import { FontAwesomeOptions, FontAwesomeIcon } from 'ngx-leaflet-fa-markers/index';

@Injectable()
export class CanimapService implements OnDestroy {

  private _map: Map;
  private subscriptions = new Array<Subscription>();

  constructor(private menuEventService: MenuEventService) {
  }

  get map() {
    return this._map;
  }

  set map(map: Map) {
    this._map = map;
  }

  showError(error) {
    switch (error.code) {
      case error.PERMISSION_DENIED:
        alert('User denied the request for Geolocation.');
        break;
      case error.POSITION_UNAVAILABLE:
        alert('Location information is unavailable.');
        break;
      case error.TIMEOUT:
        alert('The request to get user location timed out.');
        break;
      case error.UNKNOWN_ERROR:
        alert('An unknown error occurred.');
        break;
    }
  }

  subscribe() {
    const map = this.map;

    this.subscriptions.push(this.menuEventService.getObservable('onTrack').subscribe(
      tracking => {
        if (tracking) {
          this.map.locate({ setView: true, maxZoom: 16, watch: true });
          console.log('tracking enabled');
        } else {
          this.map.stopLocate();
          console.log('tracking disabled');
        }
      },
      e => console.log('onError: %s', e),
      () => console.log('onCompleted')
    ));
    this.subscriptions.push(this.menuEventService.getObservable('recordTrack').subscribe(
      tracking => {
        if (tracking) {
          this.map.on('locationfound', (e: LocationEvent) => {
            console.log(
              'lat: ' + e.latlng.lat +
              ' lng: ' + e.latlng.lng +
              ' alt: ' + e.altitude +
              ' speed: ' + e.speed +
              ' time: ' + e.timestamp
            );
          });
          console.log('recording started');
        } else {
          this.map.off('locationfound');
          console.log('recording stopped');
        }
      },
      e => console.log('onError: %s', e),
      () => console.log('onCompleted')
    ));
    this.subscriptions.push(this.menuEventService.getObservable('onMapMove').subscribe(
      location => {
        this.map.panTo({ lat: location.lat, lng: location.lng });
        console.log('pan to lat: ' + location.lat + ' lng: ' + location.lng);
      },
      e => this.showError(e),
      () => console.log('onCompleted')
    ));
    this.subscriptions.push(this.menuEventService.getObservable('gpsMarkerDismiss').subscribe(
      () => {
        L.DomUtil.removeClass(map.getContainer(), 'crosshair-cursor-enabled');
        this.map.off('click');
      }
    ));
    this.subscriptions.push(this.menuEventService.getObservable('gpsMarker').subscribe(
      () => {
      //   const bounds = map.getBounds().pad(0.25); // slightly out of screen
      //   const tooltip = new L.Tooltip({
      //     direction: 'right',
      //     permanent: false,
      //     sticky: true,
      //     opacity: 1
      //   });
      //   tooltip.setLatLng(new L.LatLng(bounds.getCenter().lat, bounds.getCenter().lng))
      //   tooltip.setContent('Start drawing to see tooltip change');
      //   const lat = map.getBounds().getCenter().lat;
      //   const lng = map.getBounds().getCenter().lng;
      //   const iconOption: FontAwesomeOptions = {
      //     iconClasses: 'fa fa-info-circle', // you _could_ add other icon classes, not tested.
      //     // iconColor: '#F00',
      //     iconUrl: '../assets/marker-icon.png',
      //     shadowUrl: '../assets/marker-shadow.png'
      // };

      //   const icon = new FontAwesomeIcon(iconOption);
      //   const marker = new L.Marker([ lat, lng], {
      //     icon: icon,
      //     draggable: true});
      //   marker.addTo(map);

        // marker.bindTooltip(tooltip);
        L.DomUtil.addClass(map.getContainer(), 'crosshair-cursor-enabled');

        console.log('put marker on map');
        this.map.on('click', (e: any) => {
          const coords = formatcoords(e.latlng.lat, e.latlng.lng);
          const value = coords.format('DD MM ss X', { latLonSeparator: ', ', decimalPlaces: 0 });
          const popup = new L.Popup();
          popup
            .setLatLng(e.latlng)
            .setContent(value)
            .openOn(this.map);
        });
      },
      e => this.showError(e),
      () => console.log('onCompleted')
    ));
    this.map.on('movestart', (e: LeafletEvent) => {
      this.map.stopLocate();
    });

  }

  ngOnDestroy() {
    // prevent memory leak when component destroyed
    console.log('unsubscribing from canimap service');
    for (const subscription of this.subscriptions) {
      subscription.unsubscribe();
    }
  }

}
