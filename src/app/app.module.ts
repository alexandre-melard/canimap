import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {
  MatDialogModule, MatButtonModule, MatButtonToggleModule, MatIconModule, MatTooltipModule,
  MatInputModule, MatSliderModule, MatExpansionModule, MatTableModule, MatMenuModule, MatTabsModule
} from '@angular/material';
import { AgmCoreModule } from '@agm/core';
import { AppRoutingModule } from './app-routing/app-routing.module';

// used to create fake backend

import { AppComponent } from './app.component';

// import {InlineEditorModule} from '@qontu/ngx-inline-editor';
import { DeviceDetectorModule } from 'ngx-device-detector';

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
import { LoginComponent } from './_guards/login.component';

import { DialogChooseLayersComponent } from './_dialogs/chooseLayer.component';
import { DialogChooseColorComponent } from './_dialogs/chooseColor.component';
import { DialogHelperComponent } from './_dialogs/helper.component';
import { DialogFileOpenComponent } from './_dialogs/fileOpen.component';
import { DialogFileSaveComponent } from './_dialogs/fileSave.component';
import { DialogFilesOpenComponent } from './_dialogs/filesOpen.component';
import { DialogDisplayObjectsComponent } from './_dialogs/displayObjects.component';
import { DialogLoginComponent } from './_dialogs/login.component';

import { AuthGuard } from './_services/auth-guard.service';
import { CheckEnv } from './_services/check-env.service';
import { AuthService } from './_services/auth.service';
import { AlertService, UserService } from './_services/index';
import { MenuEventService } from './_services/menuEvent.service';
import { MapService } from './_services/map.service';
import { CaniDrawObjectService } from './_services/caniDrawObject.service';
import { DrawService } from './_services/draw.service';
import { HelperEventService } from './_services/helperEvent.service';
import { FileService } from './_services/file.service';
import { HttpClientModule } from '@angular/common/http';
import { JwtModule } from '@auth0/angular-jwt';


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
    LoginComponent,
    DialogChooseLayersComponent,
    DialogChooseColorComponent,
    DialogHelperComponent,
    DialogFileOpenComponent,
    DialogFilesOpenComponent,
    DialogFileSaveComponent,
    DialogDisplayObjectsComponent,
    DialogLoginComponent,
    RegisterComponent
  ],
  imports: [
    HttpClientModule,
    JwtModule.forRoot({
      config: {
        tokenGetter: () => localStorage.getItem('token'),
        whitelistedDomains: ['localhost:4200']
      }
    }),
    BrowserModule,
    BrowserAnimationsModule,
    MatDialogModule,
    MatButtonModule,
    MatMenuModule,
    MatButtonToggleModule,
    MatIconModule,
    MatTooltipModule,
    MatInputModule,
    MatSliderModule,
    MatTabsModule,
    FormsModule,
    ReactiveFormsModule,
    // InlineEditorModule,
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
    AlertService,
    UserService,
    MenuEventService,
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
    DialogDisplayObjectsComponent,
    DialogChooseLayersComponent,
    DialogChooseColorComponent,
    DialogLoginComponent,
    DialogHelperComponent
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
