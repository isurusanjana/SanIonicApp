import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';

import { MyApp } from './app.component';
import {StartPage} from "../pages/start/start";
import {RegisterPage} from "../pages/register/register";
import {ForgotPasswordPage} from "../pages/forgot-password/forgot-password";
import {AddressProvider} from "../providers/address/address";
import {ApiServiceProvider} from "../providers/api-service/api-service";
import {CameraServiceProvider} from "../providers/camera-service/camera-service";
import {Camera} from '@ionic-native/camera';
import {Geolocation} from "@ionic-native/geolocation";
import {HTTP} from '@ionic-native/http';
import {HttpClientModule} from "@angular/common/http";
import {HomePageModule} from "../pages/home/home.module";
import {AccidentReportAddPageModule} from "../pages/accident-report-add/accident-report-add.module";
import {InsuranceReportAddPageModule} from "../pages/insurance-report-add/insurance-report-add.module";
import {InvoiceReportAddPageModule} from "../pages/invoice-report-add/invoice-report-add.module";
import {SurveyReportAddPageModule} from "../pages/survey-report-add/survey-report-add.module";
import {WorkReportAddPageModule} from "../pages/work-report-add/work-report-add.module";
import {MapPageModule} from "../pages/map/map.module";
import {ProfilePageModule} from "../pages/profile/profile.module";
import {UsefulLinksPageModule} from "../pages/useful-links/useful-links.module";
import {ReportsPageModule} from "../pages/reports/reports.module";
import { HttpModule } from '@angular/http';
import { Services } from '../providers/api-service/service';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    MyApp,
    StartPage,
    RegisterPage,
    ForgotPasswordPage
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    HomePageModule,
    AccidentReportAddPageModule,
    InsuranceReportAddPageModule,
    InvoiceReportAddPageModule,
    SurveyReportAddPageModule,
    WorkReportAddPageModule,
    MapPageModule,
    ProfilePageModule,
    UsefulLinksPageModule,
    ReportsPageModule,
    HttpModule,
    IonicModule.forRoot(MyApp),
    ReactiveFormsModule
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    StartPage,
    RegisterPage,
    ForgotPasswordPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    Geolocation,
    HTTP,
    AddressProvider,
    ApiServiceProvider,
    Camera,
    CameraServiceProvider,Services
  ]
})
export class AppModule {}
