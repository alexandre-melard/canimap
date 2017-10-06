import { ElementRef, NgZone, ViewChild, Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { MapsAPILoader } from '@agm/core';
import { } from '@types/googlemaps';

import { MenuEventService } from '../../_services/menuEvent.service';

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
    private router: Router,
    private menuEventService: MenuEventService,
    private mapsAPILoader: MapsAPILoader,
    private ngZone: NgZone) { }

  ngOnInit() {
    const me = this;
    // create search FormControl
    this.searchControl = new FormControl();
    // load Places Autocomplete
    this.mapsAPILoader.load().then(() => {
      const autocomplete = new google.maps.places.Autocomplete(me.searchElementRef.nativeElement, {
        type: 'geocode',
        componentRestrictions: { country: 'fr' }
      });
      autocomplete.addListener('place_changed', () => {
        me.ngZone.run(() => {
          // get the place result
          const place: google.maps.places.PlaceResult = autocomplete.getPlace();
          let latitude;
          let longitude;

          // verify result
          if (place.geometry === undefined || place.geometry === null) {
            let output;
            const coords = place.name.split(' ');
            const latlng = coords.map((coord) => {
              const a = coord.split(/\D+/);
              let degrees = Number(a[0]);
              const minutes = typeof (a[1]) !== 'undefined' ? Number(a[1]) / 60 : 0;
              const seconds = typeof (a[2]) !== 'undefined' ? Number(a[2]) / 3600 : 0;
              const hemisphere = a[3] || null;
              if (hemisphere !== null && /[SW]/i.test(hemisphere)) {
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
          } else {
            latitude = place.geometry.location.lat();
            longitude = place.geometry.location.lng();
          }
          me.menuEventService.callEvent('mapMove', { lat: latitude, lng: longitude });
        });
      });
    });
  }
}
