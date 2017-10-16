import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpModule } from '@angular/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {
  MdDialogModule, MdButtonModule, MdButtonToggleModule, MdIconModule, MdTooltipModule,
  MdInputModule, MdSliderModule, MdExpansionModule, MdTableModule, MdMenuModule, MdTabsModule
} from '@angular/material';
import { AgmCoreModule } from '@agm/core';
import { routing } from './app.routing';

// used to create fake backend
import { fakeBackendProvider } from './_helpers/index';
import { MockBackend, MockConnection } from '@angular/http/testing';
import { BaseRequestOptions } from '@angular/http';

import { AppComponent } from './app.component';

import { AlertComponent } from './_directives/index';
import { HomeComponent } from './home/index';
import { LocationComponent } from './_menus/location/index';
import { MenuComponent } from './_menus/menu/index';
import { MenuMobileComponent } from './_menus/mobileMenu/index';
import { BaseMenuComponent } from './_menus/baseMenu';
import { FileMenuComponent } from './_menus/fileMenu/index';
import { CanimapComponent } from './map/index';
import { RegisterComponent } from './register/index';
import { TrackMenuComponent } from './_menus/tracksMenu';
import { MapMenuComponent } from './_menus/mapMenu';
import { DrawMenuComponent } from './_menus/drawMenu';
import { HelpComponent } from './help/index';

import { DialogChooseLayersComponent } from './_dialogs/chooseLayer.component';
import { DialogChooseColorComponent } from './_dialogs/chooseColor.component';
import { DialogHelperComponent } from './_dialogs/helper.component';
import { DialogFileOpenComponent } from './_dialogs/fileOpen.component';
import { DialogFileSaveComponent } from './_dialogs/fileSave.component';
import { DialogFilesOpenComponent } from './_dialogs/filesOpen.component';
import { DialogLoginComponent } from './_dialogs/login.component';

import { AuthGuard } from './_guards/index';
import { AlertService, AuthenticationService, UserService } from './_services/index';
import { MenuEventService } from './_services/menuEvent.service';
import { MapService } from './_services/map.service';
import { DrawService } from './_services/draw.service';
import { HelperEventService } from './_services/helperEvent.service';
import { FileService } from './_services/file.service';

@NgModule({
  declarations: [
    AppComponent,
    AlertComponent,
    HomeComponent,
    MenuComponent,
    MenuMobileComponent,
    FileMenuComponent,
    LocationComponent,
    BaseMenuComponent,
    TrackMenuComponent,
    MapMenuComponent,
    DrawMenuComponent,
    CanimapComponent,
    HelpComponent,
    DialogChooseLayersComponent,
    DialogChooseColorComponent,
    DialogHelperComponent,
    DialogFileOpenComponent,
    DialogFilesOpenComponent,
    DialogFileSaveComponent,
    DialogLoginComponent,
    RegisterComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    MdDialogModule,
    MdButtonModule,
    MdMenuModule,
    MdButtonToggleModule,
    MdIconModule,
    MdTooltipModule,
    MdInputModule,
    MdSliderModule,
    MdTabsModule,
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
    FileService,

    // providers used to create fake backend
    fakeBackendProvider,
    MockBackend,
    BaseRequestOptions
  ],
  entryComponents: [
    DialogFileSaveComponent,
    DialogFileOpenComponent,
    DialogFilesOpenComponent,
    DialogChooseLayersComponent,
    DialogChooseColorComponent,
    DialogLoginComponent,
    DialogHelperComponent
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
