import { Component } from '@angular/core';
import { environment }from '../environments/environment';

@Component({
    moduleId: module.id.toString(),
    selector: 'app-canimap',
    templateUrl: 'app.component.html',
    styleUrls: ['./app.component.css']
})

export class AppComponent {
  google_api = environment.google;
  google_src = 'https://www.googletagmanager.com/gtag/js?id=' + this.google_api;
 }
