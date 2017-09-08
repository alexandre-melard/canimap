import { ElementRef, NgZone, ViewChild , Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { MapsAPILoader } from '@agm/core';
import { } from '@types/googlemaps';

import { AlertService, AuthenticationService } from '../_services/index';
import { MenuEventService } from '../_services/menuEvent.service';

@Component({
  selector: 'canimap-location',
  moduleId: module.id.toString(),
  templateUrl: 'location.component.html'
})

export class LocationComponent implements OnInit {
  model:any = {};
  loading = false;
  public searchControl: FormControl;
  autocomplete;

  @ViewChild("search")
  public searchElementRef: ElementRef;

  constructor(
    private menuEventService:MenuEventService,
    private mapsAPILoader: MapsAPILoader,
    private ngZone: NgZone) {}

  ngOnInit() {
    //create search FormControl
    this.searchControl = new FormControl();

    //load Places Autocomplete
    this.mapsAPILoader.load().then(() => {
      let autocomplete = new google.maps.places.Autocomplete(this.searchElementRef.nativeElement, {
        type: "address",
        componentRestrictions: {country: 'fr'}
      });
      autocomplete.addListener("place_changed", () => {
        this.ngZone.run(() => {
          //get the place result
          let place: google.maps.places.PlaceResult = autocomplete.getPlace();

          //verify result
          if (place.geometry === undefined || place.geometry === null) {
            return;
          }

          //set latitude, longitude and zoom
          let latitude = place.geometry.location.lat();
          let longitude = place.geometry.location.lng();

          this.menuEventService.moveMap({lat: latitude, lng: longitude});
        });
      });
    });
  }

  gpsMarker() {
    this.menuEventService.gpsMarker();
  }

}
