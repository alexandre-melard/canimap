import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MdDialogModule, MdButtonModule, MdIconModule } from '@angular/material';
import { LeafletModule } from '@asymmetrik/ngx-leaflet';
import { LeafletDrawModule } from '@asymmetrik/ngx-leaflet-draw';
import { ColorPickerModule } from 'ngx-color-picker';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { AgmCoreModule } from '@agm/core';

// used to create fake backend
import { fakeBackendProvider } from './_helpers/index';
import { MockBackend, MockConnection } from '@angular/http/testing';
import { BaseRequestOptions } from '@angular/http';

import { AppComponent } from './app.component';
import { routing } from './app.routing';

import { DialogFileSaveComponent } from './_services/file.service';

import { AlertComponent } from './_directives/index';
import { SliderComponent } from './_directives/index';
import { ModalComponent } from './_directives/index';
import { AuthGuard } from './_guards/index';
import { AlertService, AuthenticationService, UserService, MenuEventService,
  CanimapService, HelperEventService, FileService } from './_services/index';
import { HomeComponent } from './home/index';
import { LocationComponent } from './location/index';
import { MenuComponent } from './menu/index';
import { FileMenuComponent } from './FileMenu/index';
import { TrackMenuComponent } from './tracksMenu';
import { MenuMobileComponent } from './mobile';
import { LoginComponent } from './login/index';
import { CanimapComponent } from './map/index';
import { RegisterComponent } from './register/index';

@NgModule({
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    MdDialogModule,
    MdButtonModule,
    MdIconModule,
    FormsModule,
    HttpModule,
    NgbModule.forRoot(),
    LeafletModule.forRoot(),
    LeafletDrawModule.forRoot(),
    ColorPickerModule,
    ReactiveFormsModule,
    AgmCoreModule.forRoot({
      apiKey: 'AIzaSyBb1BipElNZJQPhdkSUdX5DxZpPnQV_D3k',
      libraries: ['places']
    }),
    routing
  ],
  declarations: [
    AppComponent,
    DialogFileSaveComponent,
    AlertComponent,
    SliderComponent,
    ModalComponent,
    HomeComponent,
    LocationComponent,
    MenuComponent,
    FileMenuComponent,
    TrackMenuComponent,
    MenuMobileComponent,
    LoginComponent,
    CanimapComponent,
    RegisterComponent
  ],
  providers: [
    AuthGuard,
    AlertService,
    AuthenticationService,
    UserService,
    MenuEventService,
    HelperEventService,
    CanimapService,
    FileService,

    // providers used to create fake backend
    fakeBackendProvider,
    MockBackend,
    BaseRequestOptions
  ],
  entryComponents: [
    DialogFileSaveComponent
  ],
  bootstrap: [AppComponent]
})

export class AppModule {
}
