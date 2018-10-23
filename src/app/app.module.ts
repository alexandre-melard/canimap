import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SatPopoverModule } from '@ncstate/sat-popover';
import { AppMaterialModules } from './material.module';
import { AgmCoreModule } from '@agm/core';
import { AppRoutingModule } from './app-routing/app-routing.module';
import { HttpClientModule } from '@angular/common/http';
import { JWT_OPTIONS, JwtModule } from '@auth0/angular-jwt';

// used to create fake backend

import { AppComponent } from './app.component';

import { DeviceDetectorModule } from 'ngx-device-detector';

import { LogComponent } from './_directives/index';
import { CompassComponent } from './_directives/compass.component';
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
import { InlineEditComponent } from './_directives/inline-edit.component';

import { DialogChooseLayersComponent } from './_dialogs/chooseLayer.component';
import { DialogChooseColorComponent } from './_dialogs/chooseColor.component';
import { DialogHelperComponent } from './_dialogs/helper.component';
import { DialogFileOpenComponent } from './_dialogs/fileOpen.component';
import { DialogFileSaveComponent } from './_dialogs/fileSave.component';
import { DialogFilesOpenComponent } from './_dialogs/filesOpen.component';
import { DialogObjectsDisplayComponent } from './_dialogs/objectsDisplay.component';
import { DialogObjectsAddComponent } from './_dialogs/objectsAdd.component';
import { LoginComponent } from './_guards/login.component';

import { AuthGuard } from './_services/auth-guard.service';
import { CheckEnv } from './_services/check-env.service';
import { AuthService } from './_services/auth.service';
import { LogService } from './_services/log.service';
import { UserService } from './_services/user.service';
import { EventService } from './_services/event.service';
import { MapService } from './_services/map.service';
import { CaniDrawObjectService } from './_services/caniDrawObject.service';
import { DrawService } from './_services/draw.service';
import { HelperEventService } from './_services/helperEvent.service';
import { FileService } from './_services/file.service';

export function jwtOptionsFactory() {
  return {
    tokenGetter: () => {
      return sessionStorage.getItem('access_token');
    },
    whitelistedDomains: ['localhost:4200']
  };
}

export function getToken() {
  return localStorage.getItem('token');
}

@NgModule({
  declarations: [
    AppComponent,
    LogComponent,
    CompassComponent,
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
    DialogObjectsDisplayComponent,
    DialogObjectsAddComponent,
    LoginComponent,
    RegisterComponent,
    InlineEditComponent
  ],
  imports: [
    HttpClientModule,
    JwtModule.forRoot({
      jwtOptionsProvider: {
        provide: JWT_OPTIONS,
        useFactory: jwtOptionsFactory,
        deps: []
      }
    }),
    BrowserModule,
    BrowserAnimationsModule,
    AppMaterialModules,
    FormsModule,
    ReactiveFormsModule,
    SatPopoverModule,
    AgmCoreModule.forRoot({
      apiKey: 'AIzaSyBb1BipElNZJQPhdkSUdX5DxZpPnQV_D3k',
      libraries: ['places']
    }),
    DeviceDetectorModule.forRoot(),
    AppRoutingModule
  ],
  providers: [
    AuthGuard,
    CheckEnv,
    AuthService,
    LogService,
    UserService,
    EventService,
    MapService,
    DrawService,
    CaniDrawObjectService,
    HelperEventService,
    FileService
  ],
  entryComponents: [
    DialogFileSaveComponent,
    DialogFileOpenComponent,
    DialogFilesOpenComponent,
    DialogObjectsDisplayComponent,
    DialogObjectsAddComponent,
    DialogChooseLayersComponent,
    DialogChooseColorComponent,
    DialogHelperComponent
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
