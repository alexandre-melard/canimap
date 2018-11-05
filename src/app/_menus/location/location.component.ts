import { ElementRef, NgZone, ViewChild, Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MapsAPILoader } from '@agm/core';
import { LogService } from '../../_services/log.service';
import { DeviceDetectorService } from 'ngx-device-detector';

import { EventService } from '../../_services/event.service';
import { MapService } from '../../_services/map.service';
import { Events } from '../../_consts/events';
import { } from '@types/googlemaps';

@Component({
  selector: 'app-canimap-location',
  moduleId: module.id.toString(),
  styleUrls: ['./location.component.css'],
  templateUrl: 'location.component.html'
})

export class LocationComponent implements OnInit {
  public searchControl: FormControl;
  autocomplete;

  @ViewChild('search')
  public searchElementRef: ElementRef;

  constructor(
    private eventService: EventService,
    private mapsAPILoader: MapsAPILoader,
    private log: LogService,
    private ngZone: NgZone,
    private mapService: MapService,
    private deviceDetectorService: DeviceDetectorService
  ) { }

  gps() {
    if (this.deviceDetectorService.isMobile()) {
      this.mapService.compass();
    } else {
      navigator.geolocation.getCurrentPosition(
        position => {
          this.eventService.call(
            Events.MAP_MOVE,
            {
              lat: position.coords.latitude, lng: position.coords.longitude, success: () => {
                this.mapService.addMarker({ lat: position.coords.latitude, lng: position.coords.longitude });
              }
            });
        },
        error => this.log.error('[LocationComponent] Error while getting current position: ' + JSON.stringify(error)),
        {
          enableHighAccuracy: true
        }
      );
    }
  }

  ngOnInit() {
    this.log.debug('[LocationComponent] [INIT]');
    const me = this;
    // create search FormControl
    this.searchControl = new FormControl();
    // load Places Autocomplete
    this.mapsAPILoader.load().then(() => {
      this.log.debug('[LocationComponent] [INIT] maps api loaded');
      const autocomplete = new google.maps.places.Autocomplete(me.searchElementRef.nativeElement, {
        type: 'geocode'
      });
      autocomplete.addListener('place_changed', () => {
        this.log.debug('[LocationComponent] [INIT] maps api place_changed listener called');
        me.ngZone.run(() => {
          this.log.debug('[LocationComponent] [INIT] maps api place_changed listener ngZone run');
          // get the place result
          const place: google.maps.places.PlaceResult = autocomplete.getPlace();
          let latitude;
          let longitude;

          // verify result
          if (place.geometry) {
            latitude = place.geometry.location.lat();
            longitude = place.geometry.location.lng();
          } else {
            let output;
            const coords = place.name.split(' ');
            const latlng = coords.map((coord) => {
              const a = coord.split(/\D+/);
              let degrees = Number(a[0]);
              const minutes = typeof (a[1]) !== 'undefined' ? Number(a[1]) / 60 : 0;
              const seconds = typeof (a[2]) !== 'undefined' ? Number(a[2]) / 3600 : 0;
              const hemisphere = a[3] || null;
              if (hemisphere && /[SW]/i.test(hemisphere)) {
                degrees = Math.abs(degrees) * -1;
              }
              if (degrees < 0) {
                output = degrees - minutes - seconds;
              } else {
                output = degrees + minutes + seconds;
              }
              return output;
            });
            latitude = latlng[0];
            longitude = latlng[1];
          }
          this.eventService.call(
            Events.MAP_MOVE,
            {
              lat: latitude, lng: longitude, success: () => {
                me.mapService.addMarker({ lat: latitude, lng: longitude });
              }
            }
          );
        });
      });
    });
  }
}
