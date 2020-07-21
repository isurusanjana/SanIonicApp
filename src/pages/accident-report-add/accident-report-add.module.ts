import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AccidentReportAddPage } from './accident-report-add';

@NgModule({
  declarations: [
    AccidentReportAddPage,
  ],
  imports: [
    IonicPageModule.forChild(AccidentReportAddPage),
  ],
})
export class AccidentReportAddPageModule {}
