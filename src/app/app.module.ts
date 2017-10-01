import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpModule } from '@angular/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {
  MdDialogModule, MdButtonModule, MdIconModule, MdTooltipModule,
  MdInputModule, MdSliderModule, MdExpansionModule, MdTableModule
} from '@angular/material';
import { AgmCoreModule } from '@agm/core';
import { routing } from './app.routing';

// used to create fake backend
import { fakeBackendProvider } from './_helpers/index';
import { MockBackend, MockConnection } from '@angular/http/testing';
import { BaseRequestOptions } from '@angular/http';

import { AppComponent } from './app.component';

import { HomeComponent } from './home/index';
import { LocationComponent } from './_menus/location/index';
import { MenuComponent } from './_menus/menu/index';
import { LoginComponent } from './login/index';
import { CanimapComponent } from './map/index';
import { RegisterComponent } from './register/index';
import { TrackMenuComponent } from './_menus/tracksMenu';
import { DrawMenuComponent } from './_menus/drawMenu';

import { DialogChooseLayersComponent } from './_dialogs/chooseLayer.component';
import { DialogChooseColorComponent } from './_dialogs/chooseColor.component';
import { DialogHelperComponent } from './_dialogs/helper.component';

import { AuthGuard } from './_guards/index';
import { AlertService, AuthenticationService, UserService } from './_services/index';
import { MenuEventService } from './_services/menuEvent.service';
import { MapService } from './_services/map.service';
import { DrawService } from './_services/draw.service';
import { HelperEventService } from './_services/helperEvent.service';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    MenuComponent,
    LocationComponent,
    TrackMenuComponent,
    DrawMenuComponent,
    LoginComponent,
    CanimapComponent,
    DialogChooseLayersComponent,
    DialogChooseColorComponent,
    DialogHelperComponent,
    RegisterComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    MdDialogModule,
    MdButtonModule,
    MdIconModule,
    MdTooltipModule,
    MdInputModule,
    MdSliderModule,
    FormsModule,
    HttpModule,
    ReactiveFormsModule,
    AgmCoreModule.forRoot({
      apiKey: 'AIzaSyBb1BipElNZJQPhdkSUdX5DxZpPnQV_D3k',
      libraries: ['places']
    }),
    routing
  ],
  providers: [
    AuthGuard,
    AlertService,
    AuthenticationService,
    UserService,
    MenuEventService,
    MapService,
    DrawService,
    HelperEventService,

    // providers used to create fake backend
    fakeBackendProvider,
    MockBackend,
    BaseRequestOptions
  ],
  entryComponents: [
    // DialogFileSaveComponent,
    // DialogFileOpenComponent,
    // DialogFilesOpenComponent,
    DialogChooseLayersComponent,
    DialogChooseColorComponent,
    DialogHelperComponent
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
