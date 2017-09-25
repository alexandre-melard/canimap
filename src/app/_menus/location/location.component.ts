import { ElementRef, NgZone, ViewChild, Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { MapsAPILoader } from '@agm/core';
import { } from '@types/googlemaps';

import { AlertService, AuthenticationService, MenuEventService, HelperEventService } from '../../_services/index';

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
    private helperEventService: HelperEventService,
    private mapsAPILoader: MapsAPILoader,
    private ngZone: NgZone) { }

  get visible(): boolean {
    return this.router.url === '/map';
  }

  ngOnInit() {
    // create search FormControl
    this.searchControl = new FormControl();

    // load Places Autocomplete
    this.mapsAPILoader.load().then(() => {
      const autocomplete = new google.maps.places.Autocomplete(this.searchElementRef.nativeElement, {
        type: 'address',
        componentRestrictions: { country: 'fr' }
      });
      autocomplete.addListener('place_changed', () => {
        this.ngZone.run(() => {
          // get the place result
          const place: google.maps.places.PlaceResult = autocomplete.getPlace();

          // verify result
          if (place.geometry === undefined || place.geometry === null) {
            return;
          }

          // set latitude, longitude and zoom
          const latitude = place.geometry.location.lat();
          const longitude = place.geometry.location.lng();

          this.menuEventService.callEvent('onMapMove', { lat: latitude, lng: longitude });
        });
      });
    });
  }
}
