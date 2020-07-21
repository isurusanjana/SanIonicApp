import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { SurveyReportAddPage } from './survey-report-add';

@NgModule({
  declarations: [
    SurveyReportAddPage,
  ],
  imports: [
    IonicPageModule.forChild(SurveyReportAddPage),
  ],
})
export class SurveyReportAddPageModule {}
